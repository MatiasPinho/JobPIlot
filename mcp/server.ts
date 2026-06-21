/**
 * JobPilot MCP Server (experimental)
 *
 * Expone herramientas para que Claude Cowork pueda consultar y actualizar
 * datos de JobPilot directamente, sin necesidad de archivos intermedios.
 *
 * Uso: npm run mcp:dev
 *
 * Configurar en Claude Code / MCP client:
 *   {
 *     "mcpServers": {
 *       "jobpilot": {
 *         "command": "node",
 *         "args": ["--loader", "ts-node/esm", "mcp/server.ts"],
 *         "cwd": "<ruta al proyecto>"
 *       }
 *     }
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const DATA_DIR = join(homedir(), 'Documents', 'JobPilot', 'data')

function readJson<T>(file: string, fallback: T): T {
  try {
    if (!existsSync(file)) return fallback
    return JSON.parse(readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJson(file: string, data: unknown): void {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

interface RawOffer {
  title?: string
  company?: string
  portal?: string
  link?: string
  description?: string
  requirements?: string[]
  modality?: string
  location?: string
  salary?: string
}

interface Profile {
  mainStack?: string[]
  secondaryStack?: string[]
  avoid?: string[]
  preferredModality?: string[]
  preferredLocation?: string[]
}

interface Settings {
  portals?: string[]
}

function buildSearchInstructions(profile: Profile | null, settings: Settings | null): string {
  const portals = settings?.portals?.length ? settings.portals.join(', ') : 'LinkedIn, Bumeran, GetOnBoard'
  const avoidList = (profile?.avoid ?? []).length
    ? (profile!.avoid!).map((a) => `- ${a}`).join('\n')
    : '- (ninguno configurado)'
  return `## PORTALES A BUSCAR\n${portals}\n\n## CRITERIOS DE FILTRO\nPriorizá ofertas que cumplan al menos 3 de:\n- Empresa con buena reputación (4+ estrellas)\n- Salario igual o mayor a la pretensión del perfil\n- Modalidad que coincida con las preferencias del perfil\n- Ubicación dentro de la zona indicada en el perfil o remoto\n- Beneficios mencionados\n\nDESCARTÁ siempre:\n- MLM, ventas a comisión pura sin sueldo base\n- Inversión inicial\n- Reviews negativos visibles\n- Inglés superior a B1\n- SENIOR (5+ años obligatorio)\n- Exclusiones del perfil:\n${avoidList}\n\n## PLAN\n1. get_profile\n2. Verificar Claude in Chrome y sesión en portal\n3. Buscar con keywords del perfil (hasta 4 en paralelo)\n4. add_offer por cada oferta relevante (o add_offers en bloque al final)\n5. STOP — reportar cuántas guardaste, esperar aprobación del usuario en JobPilot\n\n## REGLAS\n- NUNCA postules en esta fase\n- No reveles info personal fuera del portal`
}

function buildApplicationInstructions(): string {
  return `## PLAN\n1. get_profile — datos del usuario y ruta del CV\n2. get_answers_bank — banco de respuestas frecuentes\n3. list_approved_offers — ofertas aprobadas por el usuario\n4. Por cada oferta aprobada:\n   - Abrir link con Claude in Chrome\n   - Carta personalizada (por qué empresa, por qué rol, logro concreto)\n   - Adjuntar CV desde cvPath del perfil\n   - Completar formularios con banco de respuestas\n   - Registrar: mark_offer_applied / register_error (error / pendiente_test / pendiente_manual)\n5. get_tracker_summary — resumen final\n\n## REGLAS\n- NUNCA postules sin aprobación en JobPilot\n- NUNCA cartas genéricas\n- Cuenta nueva en portal → pendiente_manual`
}

// Separa cada tag en términos individuales: ["React TypeScript"] → ["react","typescript"]
// Tolera perfiles donde el usuario cargó varias tecnologías en un solo tag.
function tokenize(tags: string[] | undefined): string[] {
  return (tags ?? [])
    .flatMap((t) => t.split(/[\s,/|]+/))
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length >= 2)
}

function scoreOffer(offer: RawOffer, profile: Profile | null): number {
  if (!profile) return 50
  const text = `${offer.title ?? ''} ${offer.description ?? ''} ${(offer.requirements ?? []).join(' ')}`.toLowerCase()
  let score = 50
  for (const tech of tokenize(profile.mainStack))         if (text.includes(tech)) score += 8
  for (const tech of tokenize(profile.secondaryStack))    if (text.includes(tech)) score += 3
  for (const mod of tokenize(profile.preferredModality))  if (text.includes(mod))  score += 5
  for (const loc of tokenize(profile.preferredLocation))  if (text.includes(loc))  score += 5
  // avoid: frase completa (no tokenizar — evita penalizar por palabras sueltas como "años")
  for (const bad of profile.avoid ?? []) if (text.includes(bad.toLowerCase())) score -= 15
  return Math.max(0, Math.min(100, score))
}

function buildOffer(raw: RawOffer, profile: Profile | null): Record<string, unknown> {
  const score = scoreOffer(raw, profile)
  const status = score >= 65 ? 'recomendada' : score <= 20 ? 'rechazada' : 'detectada'
  return {
    id: `cowork-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: raw.title ?? 'Sin título',
    company: raw.company ?? 'Empresa desconocida',
    portal: raw.portal ?? 'Cowork',
    link: raw.link ?? '',
    description: raw.description ?? '',
    requirements: raw.requirements ?? [],
    modality: raw.modality,
    location: raw.location,
    salary: raw.salary,
    status,
    score,
    detectedAt: new Date().toISOString()
  }
}

const TOOLS = [
  {
    name: 'get_profile',
    description: 'Obtiene el perfil laboral del usuario guardado en JobPilot.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'list_approved_offers',
    description: 'Lista todas las ofertas con estado "aprobada" que están listas para postular.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'list_offers',
    description: 'Lista todas las ofertas filtradas por estado (opcional).',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filtrar por estado: detectada, recomendada, aprobada, rechazada, postulada, pendiente_manual, pendiente_test, error, duplicada'
        }
      },
      required: []
    }
  },
  {
    name: 'mark_offer_applied',
    description: 'Marca una oferta como postulada y registra el resultado.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la oferta' },
        result: { type: 'string', description: 'Descripción del resultado (ej: "Postulación enviada")' },
        notes: { type: 'string', description: 'Notas adicionales (opcional)' }
      },
      required: ['id']
    }
  },
  {
    name: 'register_error',
    description: 'Registra un error en una oferta (captcha, test técnico, error de carga).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la oferta' },
        status: {
          type: 'string',
          enum: ['error', 'pendiente_manual', 'pendiente_test'],
          description: 'Estado a asignar'
        },
        notes: { type: 'string', description: 'Descripción del problema' }
      },
      required: ['id', 'status']
    }
  },
  {
    name: 'get_tracker_summary',
    description: 'Devuelve un resumen del tracker con métricas de la búsqueda laboral.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_answers_bank',
    description: 'Devuelve el banco de respuestas frecuentes para usar en formularios de postulación.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'add_offer',
    description: 'Agrega una oferta laboral encontrada a JobPilot. Úsala cada vez que encontrás una oferta relevante mientras buscás trabajo para el usuario.',
    inputSchema: {
      type: 'object',
      properties: {
        title:        { type: 'string', description: 'Título del puesto' },
        company:      { type: 'string', description: 'Nombre de la empresa' },
        portal:       { type: 'string', description: 'Portal donde se encontró (LinkedIn, Bumeran, GetOnBoard, etc.)' },
        link:         { type: 'string', description: 'URL directa a la oferta' },
        description:  { type: 'string', description: 'Descripción completa del puesto y requisitos' },
        requirements: { type: 'array', items: { type: 'string' }, description: 'Lista de tecnologías o requisitos clave (opcional)' },
        modality:     { type: 'string', description: 'Modalidad: remoto, híbrido, presencial (opcional)' },
        location:     { type: 'string', description: 'Ubicación (opcional)' },
        salary:       { type: 'string', description: 'Rango salarial si está disponible (opcional)' }
      },
      required: ['title', 'company', 'link', 'description']
    }
  },
  {
    name: 'get_instructions',
    description: 'Obtiene las instrucciones completas para la tarea actual: criterios de filtro, portales, plan de pasos y reglas. Llamá esto antes de empezar cualquier búsqueda o postulación.',
    inputSchema: {
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['busqueda', 'postulacion'], description: '"busqueda" para buscar y guardar ofertas. "postulacion" para postular a las aprobadas.' }
      },
      required: ['mode']
    }
  },
  {
    name: 'add_offers',
    description: 'Agrega múltiples ofertas laborales de una vez. Úsala al final de una sesión de búsqueda para guardar todas las ofertas encontradas en JobPilot.',
    inputSchema: {
      type: 'object',
      properties: {
        offers: {
          type: 'array',
          description: 'Lista de ofertas encontradas',
          items: {
            type: 'object',
            properties: {
              title:        { type: 'string' },
              company:      { type: 'string' },
              portal:       { type: 'string' },
              link:         { type: 'string' },
              description:  { type: 'string' },
              requirements: { type: 'array', items: { type: 'string' } },
              modality:     { type: 'string' },
              location:     { type: 'string' },
              salary:       { type: 'string' }
            },
            required: ['title', 'company', 'link', 'description']
          }
        }
      },
      required: ['offers']
    }
  }
]

const server = new Server(
  { name: 'jobpilot', version: '0.1.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params

  try {
    switch (name) {
      case 'get_profile': {
        const profile = readJson(join(DATA_DIR, 'profile.json'), null)
        if (!profile) return { content: [{ type: 'text', text: 'No hay perfil guardado en JobPilot.' }] }
        return { content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }] }
      }

      case 'list_approved_offers': {
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const approved = offers.filter((o) => o.status === 'aprobada')
        return {
          content: [{
            type: 'text',
            text: approved.length === 0
              ? 'No hay ofertas aprobadas en JobPilot.'
              : JSON.stringify(approved, null, 2)
          }]
        }
      }

      case 'list_offers': {
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const status = (args as Record<string, string>).status
        const filtered = status ? offers.filter((o) => o.status === status) : offers
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(
              filtered.map((o) => ({ id: o.id, title: o.title, company: o.company, portal: o.portal, status: o.status, score: o.score })),
              null, 2
            )
          }]
        }
      }

      case 'mark_offer_applied': {
        const a = args as { id: string; result?: string; notes?: string }
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const idx = offers.findIndex((o) => o.id === a.id)
        if (idx === -1) return { content: [{ type: 'text', text: `Oferta con id "${a.id}" no encontrada.` }] }
        offers[idx] = {
          ...offers[idx],
          status: 'postulada',
          result: a.result ?? 'Postulada desde MCP',
          notes: a.notes,
          appliedAt: new Date().toISOString()
        }
        writeJson(join(DATA_DIR, 'offers.json'), offers)
        return { content: [{ type: 'text', text: `Oferta "${offers[idx].title}" marcada como postulada.` }] }
      }

      case 'register_error': {
        const a = args as { id: string; status: string; notes?: string }
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const idx = offers.findIndex((o) => o.id === a.id)
        if (idx === -1) return { content: [{ type: 'text', text: `Oferta con id "${a.id}" no encontrada.` }] }
        offers[idx] = { ...offers[idx], status: a.status, notes: a.notes }
        writeJson(join(DATA_DIR, 'offers.json'), offers)
        return { content: [{ type: 'text', text: `Oferta "${offers[idx].title}" marcada como ${a.status}.` }] }
      }

      case 'get_tracker_summary': {
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const counts: Record<string, number> = {}
        for (const o of offers) {
          const s = String(o.status)
          counts[s] = (counts[s] ?? 0) + 1
        }
        const summary = {
          total: offers.length,
          por_estado: counts,
          postuladas: offers.filter((o) => o.status === 'postulada').length,
          pendientes: offers.filter((o) => ['pendiente_manual', 'pendiente_test'].includes(String(o.status))).length,
          errores: offers.filter((o) => o.status === 'error').length
        }
        return { content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }] }
      }

      case 'get_instructions': {
        const { mode } = args as { mode: 'busqueda' | 'postulacion' }
        const prompts  = readJson<{ searchInstructions?: string; applicationInstructions?: string }>(join(DATA_DIR, 'prompts.json'), {})
        let text: string
        if (mode === 'busqueda') {
          text = prompts.searchInstructions ?? buildSearchInstructions(
            readJson<Profile | null>(join(DATA_DIR, 'profile.json'), null),
            readJson<Settings | null>(join(DATA_DIR, 'settings.json'), null)
          )
        } else {
          text = prompts.applicationInstructions ?? buildApplicationInstructions()
        }
        return { content: [{ type: 'text', text }] }
      }

      case 'get_answers_bank': {
        const answers = readJson(join(DATA_DIR, 'answers.json'), [])
        return { content: [{ type: 'text', text: JSON.stringify(answers, null, 2) }] }
      }

      case 'add_offer': {
        const a = args as RawOffer
        const profile = readJson<Profile | null>(join(DATA_DIR, 'profile.json'), null)
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const newOffer = buildOffer(a, profile)
        offers.push(newOffer)
        writeJson(join(DATA_DIR, 'offers.json'), offers)
        return { content: [{ type: 'text', text: `Oferta "${newOffer.title}" guardada en JobPilot (score: ${newOffer.score}, estado: ${newOffer.status}).` }] }
      }

      case 'add_offers': {
        const { offers: rawOffers } = args as { offers: RawOffer[] }
        if (!Array.isArray(rawOffers) || rawOffers.length === 0)
          return { content: [{ type: 'text', text: 'No se enviaron ofertas.' }] }
        const profile = readJson<Profile | null>(join(DATA_DIR, 'profile.json'), null)
        const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
        const built = rawOffers.map((r) => buildOffer(r, profile))
        offers.push(...built)
        writeJson(join(DATA_DIR, 'offers.json'), offers)
        const recomendadas = built.filter((o) => o.status === 'recomendada').length
        return {
          content: [{
            type: 'text',
            text: `${built.length} oferta(s) guardadas en JobPilot. ${recomendadas} recomendadas, ${built.length - recomendadas} detectadas.\n\n` +
              built.map((o) => `• ${o.title} @ ${o.company} — score ${o.score} (${o.status})`).join('\n')
          }]
        }
      }

      default:
        return { content: [{ type: 'text', text: `Herramienta desconocida: ${name}` }] }
    }
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${String(err)}` }], isError: true }
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  process.stderr.write('JobPilot MCP server corriendo en stdio\n')
}

main().catch((err) => {
  process.stderr.write(`Error fatal: ${err}\n`)
  process.exit(1)
})
