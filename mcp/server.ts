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

// Los portales SIEMPRE salen de Settings, aunque las instrucciones estén editadas.
function injectPortals(text: string, settings: Settings | null): string {
  const portalLine = settings?.portals?.length ? settings.portals.join(', ') : 'LinkedIn, Bumeran, GetOnBoard'
  if (/## PORTALES A BUSCAR\n/.test(text)) {
    return text.replace(/(## PORTALES A BUSCAR\n)[\s\S]*?(\n\n)/, `$1${portalLine}$2`)
  }
  return `## PORTALES A BUSCAR\n${portalLine}\n\n${text}`
}

function buildSearchInstructions(profile: Profile | null, settings: Settings | null): string {
  const portals = settings?.portals?.length ? settings.portals.join(', ') : 'LinkedIn, Bumeran, GetOnBoard'
  const avoidList = (profile?.avoid ?? []).length
    ? (profile!.avoid!).map((a) => `- ${a}`).join('\n')
    : '- (ninguno configurado)'
  return `## PORTALES A BUSCAR\n${portals}\n\n## CRITERIOS DE FILTRO\nPriorizá ofertas que cumplan al menos 3 de:\n- Empresa con buena reputación (4+ estrellas)\n- Salario igual o mayor a la pretensión del perfil\n- Modalidad que coincida con las preferencias del perfil\n- Ubicación dentro de la zona indicada en el perfil o remoto\n- Beneficios mencionados\n\nDESCARTÁ siempre:\n- MLM, ventas a comisión pura sin sueldo base\n- Inversión inicial\n- Reviews negativos visibles\n- Inglés superior a B1\n- SENIOR (5+ años obligatorio)\n- Exclusiones del perfil:\n${avoidList}\n\n## PLAN\n1. get_profile\n2. Verificar Claude in Chrome y sesión en portal\n3. Buscar con keywords del perfil (máximo 2 en paralelo, no más)\n4. Por cada oferta de los resultados: ANTES de abrirla, add_offer con título/empresa/link. Si "ya existe", saltala sin abrir. Si es nueva, abrí y completá datos.\n5. STOP — reportar cuántas guardaste, esperar aprobación del usuario en JobPilot\n\n## REGLAS\n- RITMO HUMANO: esperá entre 3 y 5 segundos entre cada acción (búsqueda, navegación, abrir oferta). No hagas acciones en ráfaga — reduce CAPTCHAs y límites de velocidad.\n- NUNCA postules en esta fase\n- No reveles info personal fuera del portal\n- BLOQUEOS: ante CAPTCHA, verificación de robot, 2FA o muro que requiera un humano, NO intentes resolverlo. Llamá a request_human_help con el motivo y la URL, pausá y esperá a que el usuario lo resuelva.`
}

function buildApplicationInstructions(): string {
  return `## PLAN\n1. get_profile — datos del usuario y ruta del CV\n2. get_answers_bank — banco de respuestas frecuentes\n3. list_approved_offers — ofertas aprobadas por el usuario\n4. Por cada oferta aprobada:\n   - Abrir link con Claude in Chrome\n   - ¿Pide carta de presentación / cover letter / mensaje al reclutador? SÍ: NO la escribas, llamá a request_cover_letter (company, role, offerId, link), la oferta queda pendiente y la escribe el usuario, pasá a la siguiente. NO: seguí.\n   - Adjuntar CV desde cvPath del perfil\n   - Completar formularios con banco de respuestas\n   - Enviar (solo si no quedó pendiente por carta)\n   - Registrar: mark_offer_applied / register_error (error / pendiente_test / pendiente_manual)\n5. get_tracker_summary — resumen final, incluí cuántas quedaron esperando carta del usuario\n\n## CARTAS DE PRESENTACIÓN\nNO escribís cartas. Las escribe el usuario (tiene una skill dedicada). Cuando una oferta requiera carta, usá request_cover_letter y seguí. Nunca improvises una carta.\n\n## REGLAS\n- RITMO HUMANO: esperá entre 3 y 5 segundos entre cada acción (abrir oferta, completar campo, navegar). No hagas acciones en ráfaga — reduce CAPTCHAs y límites de velocidad.\n- NUNCA postules sin aprobación en JobPilot\n- NUNCA cartas genéricas\n- Cuenta nueva en portal → pendiente_manual\n- BLOQUEOS: ante CAPTCHA, verificación de robot, 2FA o muro que requiera un humano, NO intentes resolverlo. Llamá a request_human_help con el motivo y la URL, pausá y esperá a que el usuario lo resuelva.`
}

// Busca un término como palabra completa (evita que "react" matchee "reaction").
function hasTerm(text: string, term: string): boolean {
  const t = term.trim().toLowerCase()
  if (t.length < 2) return false
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text)
}

interface ScoreResult {
  score: number
  positives: string[]
  negatives: string[]
}

// Scoring con topes por categoría para que discrimine (no satura con solo nombrar 4 techs).
function scoreOffer(offer: RawOffer, profile: Profile | null): ScoreResult {
  if (!profile) return { score: 50, positives: [], negatives: [] }
  const text = `${offer.title ?? ''} ${offer.description ?? ''} ${(offer.requirements ?? []).join(' ')}`.toLowerCase()
  let score = 42
  const positives: string[] = []
  const negatives: string[] = []

  let mainPts = 0
  for (const tech of profile.mainStack ?? []) if (hasTerm(text, tech)) { mainPts += 8; positives.push(tech) }
  score += Math.min(mainPts, 30)

  let secPts = 0
  for (const tech of profile.secondaryStack ?? []) if (hasTerm(text, tech)) { secPts += 3; positives.push(tech) }
  score += Math.min(secPts, 12)

  if ((profile.preferredModality ?? []).some((m) => hasTerm(text, m))) { score += 6; positives.push('modalidad') }
  if ((profile.preferredLocation ?? []).some((l) => hasTerm(text, l))) { score += 6; positives.push('ubicación') }

  for (const bad of profile.avoid ?? []) if (hasTerm(text, bad)) { score -= 18; negatives.push(bad) }

  return { score: Math.max(0, Math.min(100, score)), positives, negatives }
}

function buildOffer(raw: RawOffer, profile: Profile | null): Record<string, unknown> {
  const { score, positives, negatives } = scoreOffer(raw, profile)
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
    scoreBreakdown: { positives, negatives },
    detectedAt: new Date().toISOString()
  }
}

// ponytail: dedup por link normalizado, fallback título+empresa
function normLink(s: string): string {
  return String(s).toLowerCase().split('?')[0].replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}
function findDup(offers: Array<Record<string, unknown>>, raw: RawOffer): Record<string, unknown> | undefined {
  const link = (raw.link ?? '').trim()
  if (link) {
    const n = normLink(link)
    const hit = offers.find((o) => o.link && normLink(String(o.link)) === n)
    if (hit) return hit
  }
  const key = `${(raw.title ?? '').trim().toLowerCase()}|${(raw.company ?? '').trim().toLowerCase()}`
  if (key === '|') return undefined
  return offers.find((o) => `${String(o.title ?? '').toLowerCase()}|${String(o.company ?? '').toLowerCase()}` === key)
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
    name: 'request_human_help',
    description: 'Pedí intervención humana cuando un bloqueo te impide continuar: CAPTCHA, verificación de robot, login con 2FA, muro de inicio de sesión, o cualquier paso que requiera un humano. NUNCA intentes resolver un CAPTCHA o verificación vos mismo. Llamá esto, pausá, y esperá a que el usuario resuelva y te avise.',
    inputSchema: {
      type: 'object',
      properties: {
        reason:  { type: 'string', description: 'Qué bloqueo encontraste' },
        portal:  { type: 'string', description: 'Portal donde ocurrió (opcional)' },
        url:     { type: 'string', description: 'URL de la página bloqueada (opcional)' }
      },
      required: ['reason']
    }
  },
  {
    name: 'request_cover_letter',
    description: 'Usá esto cuando una postulación requiera carta de presentación / cover letter. NO escribas la carta vos. Registrá el pedido para que el usuario la escriba, dejá la oferta pendiente y seguí con las demás.',
    inputSchema: {
      type: 'object',
      properties: {
        company: { type: 'string', description: 'Nombre de la empresa' },
        role:    { type: 'string', description: 'Título del puesto' },
        offerId: { type: 'string', description: 'ID de la oferta (si la tenés)' },
        link:    { type: 'string', description: 'URL de la oferta (opcional)' }
      },
      required: ['company', 'role']
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

      case 'request_human_help': {
        const a = args as { reason: string; portal?: string; url?: string }
        const file = join(DATA_DIR, 'help_requests.json')
        const list = readJson<Array<Record<string, unknown>>>(file, [])
        list.push({
          id: `help-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          reason: a.reason,
          portal: a.portal,
          url: a.url,
          createdAt: new Date().toISOString(),
          resolved: false
        })
        writeJson(file, list)
        return {
          content: [{
            type: 'text',
            text: `Pedido de ayuda registrado en JobPilot: "${a.reason}". PAUSÁ acá. El usuario tiene que resolver el bloqueo manualmente. Esperá a que te avise que ya está resuelto para continuar.`
          }]
        }
      }

      case 'request_cover_letter': {
        const a = args as { company: string; role: string; offerId?: string; link?: string }
        const file = join(DATA_DIR, 'help_requests.json')
        const list = readJson<Array<Record<string, unknown>>>(file, [])
        list.push({
          id: `cover-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: 'cover_letter',
          reason: `Carta de presentación: ${a.role} en ${a.company}`,
          company: a.company,
          role: a.role,
          offerId: a.offerId,
          url: a.link,
          createdAt: new Date().toISOString(),
          resolved: false
        })
        writeJson(file, list)
        if (a.offerId) {
          const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
          const idx = offers.findIndex((o) => o.id === a.offerId)
          if (idx !== -1) {
            offers[idx] = { ...offers[idx], status: 'pendiente_manual', notes: 'Esperando carta de presentación del usuario' }
            writeJson(join(DATA_DIR, 'offers.json'), offers)
          }
        }
        return {
          content: [{
            type: 'text',
            text: `Esta oferta (${a.role} en ${a.company}) requiere carta de presentación. NO la escribas. La dejé pendiente para que la escriba el usuario. Seguí con las otras ofertas.`
          }]
        }
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
          const settings = readJson<Settings | null>(join(DATA_DIR, 'settings.json'), null)
          const base = prompts.searchInstructions ?? buildSearchInstructions(
            readJson<Profile | null>(join(DATA_DIR, 'profile.json'), null),
            settings
          )
          text = injectPortals(base, settings)
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
        const dup = findDup(offers, a)
        if (dup) {
          return { content: [{ type: 'text', text: `Ya existe en JobPilot: "${dup.title}" (estado: ${dup.status}). NO la agregué ni la abras${dup.status === 'postulada' ? ', ya postulada' : ''}. Saltala.` }] }
        }
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
        const skipped: string[] = []
        const built: Array<Record<string, unknown>> = []
        for (const r of rawOffers) {
          const dup = findDup([...offers, ...built], r)
          if (dup) { skipped.push(`${dup.title} (${dup.status})`); continue }
          built.push(buildOffer(r, profile))
        }
        offers.push(...built)
        writeJson(join(DATA_DIR, 'offers.json'), offers)
        const recomendadas = built.filter((o) => o.status === 'recomendada').length
        return {
          content: [{
            type: 'text',
            text: `${built.length} oferta(s) nuevas guardadas (${recomendadas} recomendadas). ${skipped.length} ya existían y se saltaron.\n\n` +
              built.map((o) => `• ${o.title} @ ${o.company} — score ${o.score} (${o.status})`).join('\n') +
              (skipped.length ? `\n\nYa existentes: ${skipped.join(', ')}` : '')
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
