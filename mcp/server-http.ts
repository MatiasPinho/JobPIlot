/**
 * JobPilot MCP Server — HTTP transport (para Claude Cowork via tunnel)
 *
 * Corre en http://localhost:3005/mcp
 * Exponer con: cloudflared tunnel --url http://localhost:3005
 * Registrar en Cowork la URL pública: https://<random>.trycloudflare.com/mcp
 *
 * Uso: npm run mcp:http
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import http from 'http'

const PORT = 3005
const DATA_DIR = join(homedir(), 'Documents', 'JobPilot', 'data')

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
// Reemplaza la sección "## PORTALES A BUSCAR" con la lista actual de settings.
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

  return `## PORTALES A BUSCAR
${portals}

## CRITERIOS DE FILTRO
Priorizá ofertas que cumplan al menos 3 de:
- Empresa con buena reputación (4+ estrellas)
- Salario igual o mayor a la pretensión del perfil (o no publicado si el rol matchea)
- Modalidad que coincida con las preferencias del perfil
- Ubicación dentro de la zona indicada en el perfil o remoto
- Beneficios mencionados

DESCARTÁ siempre ofertas que:
- Sean MLM, ventas a comisión pura sin sueldo base
- Pidan inversión inicial
- Tengan reviews negativos visibles
- Pidan inglés superior a B1
- Sean SENIOR (5+ años obligatorio)
- Coincidan con los criterios de exclusión del perfil:
${avoidList}

## PLAN DE TAREAS
1. get_profile — leer el perfil completo del usuario
2. Verificar que Claude in Chrome está activo y hay sesión en cada portal
3. Buscar con las keywords del perfil (máximo 2 búsquedas en paralelo por portal — no más, para no parecer un bot)
4. Por cada oferta relevante: leer descripción completa → evaluar → add_offer
5. Al terminar todos los portales: add_offers en bloque si acumulaste varias
6. STOP — reportar cuántas guardaste y distribución de score, luego esperar aprobación del usuario en JobPilot

## REGLAS
- RITMO HUMANO: esperá entre 3 y 5 segundos entre cada acción (búsqueda, navegación, abrir una oferta, scroll). No hagas acciones en ráfaga — el ritmo pausado imita a una persona y reduce que el portal active CAPTCHAs o límites de velocidad.
- NUNCA postules en esta fase, solo buscás y guardás
- No reveles información personal fuera del portal
- BLOQUEOS: si encontrás un CAPTCHA, verificación de robot, login con 2FA o cualquier muro que requiera un humano, NO intentes resolverlo. Llamá a request_human_help con el motivo y la URL, pausá, y esperá a que el usuario lo resuelva y te avise para continuar.`
}

function buildApplicationInstructions(): string {
  return `## PLAN DE TAREAS
1. get_profile — obtener datos del usuario y ruta del CV (cvPath)
2. get_answers_bank — cargar banco de respuestas frecuentes
3. list_approved_offers — listar ofertas que el usuario aprobó en JobPilot
4. Por cada oferta aprobada:
   a. Abrir el link con Claude in Chrome
   b. Releer la descripción completa
   c. ¿La postulación pide carta de presentación, cover letter o mensaje al reclutador?
      - SÍ: NO la escribas. Llamá a request_cover_letter (company, role, offerId, link). La oferta queda pendiente y la escribe el usuario. Pasá a la siguiente oferta.
      - NO: seguí normalmente.
   d. Adjuntar CV desde la ruta cvPath del perfil
   e. Completar formularios usando el banco de respuestas si aplica
   f. Enviar la postulación (solo si no quedaba pendiente por carta)
   g. Registrar resultado:
      - Éxito: mark_offer_applied con descripción del resultado
      - 2 fallos: register_error status "error"
      - Test técnico requerido: register_error status "pendiente_test"
      - Requiere acción manual: register_error status "pendiente_manual"
5. get_tracker_summary — reportar resumen final, incluyendo cuántas ofertas quedaron esperando carta del usuario

## CARTAS DE PRESENTACIÓN
NO escribís cartas de presentación. Las escribe el usuario (tiene una skill dedicada para eso). Cuando una oferta requiera carta, usá request_cover_letter y seguí. Nunca improvises una carta vos.

## REGLAS
- RITMO HUMANO: esperá entre 3 y 5 segundos entre cada acción (abrir la oferta, completar un campo, navegar). No hagas acciones en ráfaga — el ritmo pausado imita a una persona y reduce que el portal active CAPTCHAs o límites de velocidad.
- NUNCA postules sin que la oferta esté en estado "aprobada" en JobPilot
- NUNCA uses cartas genéricas, siempre personalizadas por empresa y rol
- Si el portal pide crear cuenta nueva, marcá como "pendiente_manual"
- No reveles información personal fuera del portal
- BLOQUEOS: si encontrás un CAPTCHA, verificación de robot, login con 2FA o cualquier muro que requiera un humano, NO intentes resolverlo. Llamá a request_human_help con el motivo y la URL, pausá, y esperá a que el usuario lo resuelva y te avise para continuar.`
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

const log = (msg: string) =>
  process.stderr.write(`[${new Date().toISOString()}] ${msg}\n`)

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
        result: { type: 'string', description: 'Descripción del resultado' },
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
        reason:  { type: 'string', description: 'Qué bloqueo encontraste (ej: "CAPTCHA en Indeed al buscar", "Login con 2FA en LinkedIn")' },
        portal:  { type: 'string', description: 'Portal donde ocurrió (opcional)' },
        url:     { type: 'string', description: 'URL de la página bloqueada para que el usuario la abra (opcional)' }
      },
      required: ['reason']
    }
  },
  {
    name: 'request_cover_letter',
    description: 'Usá esto cuando una postulación requiera carta de presentación / cover letter / mensaje al reclutador. NO escribas la carta vos. Registrá el pedido para que el usuario la escriba, dejá esa oferta pendiente y seguí con las demás.',
    inputSchema: {
      type: 'object',
      properties: {
        company: { type: 'string', description: 'Nombre de la empresa' },
        role:    { type: 'string', description: 'Título del puesto' },
        offerId: { type: 'string', description: 'ID de la oferta en JobPilot (si la tenés)' },
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
        mode: {
          type: 'string',
          enum: ['busqueda', 'postulacion'],
          description: '"busqueda" para buscar y guardar ofertas. "postulacion" para postular a las ofertas aprobadas.'
        }
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

function createMcpServer() {
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
              text: `Pedido de ayuda registrado en JobPilot: "${a.reason}". PAUSÁ acá. El usuario tiene que resolver el bloqueo manualmente (no intentes resolverlo vos). Esperá a que te avise que ya está resuelto para continuar.`
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
          // dejar la oferta pendiente para que no se postule sin carta
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
              text: `Esta oferta (${a.role} en ${a.company}) requiere carta de presentación. NO la escribas. La dejé pendiente en JobPilot para que el usuario la escriba. Seguí con las otras ofertas aprobadas; cuando el usuario te pase la carta, volvés a esta.`
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
            // Forzar que los portales salgan de Settings, no del texto guardado
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

  return server
}

const httpServer = http.createServer(async (req, res) => {
  log(`${req.method} ${req.url} | Accept: ${req.headers['accept'] ?? '-'} | CT: ${req.headers['content-type'] ?? '-'}`)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Mcp-Session-Id')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/mcp' || req.url?.startsWith('/mcp?')) {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    const server = createMcpServer()
    await server.connect(transport)
    await transport.handleRequest(req, res)
    return
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', server: 'jobpilot-mcp', version: '0.1.0' }))
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

httpServer.listen(PORT, () => {
  log(`JobPilot MCP HTTP server corriendo en http://localhost:${PORT}/mcp`)
  log('Para exponer públicamente: cloudflared tunnel --url http://localhost:3005')
})

httpServer.on('error', (err) => {
  process.stderr.write(`Error: ${err.message}\n`)
  process.exit(1)
})
