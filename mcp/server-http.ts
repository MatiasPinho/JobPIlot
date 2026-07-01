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
  targetRole?: string
  experience?: string
  softSkills?: string[]
  salaryExpectation?: string
  availability?: string[]
  mainStack?: string[]
  secondaryStack?: string[]
  avoid?: string[]
  preferredModality?: string[]
  preferredLocation?: string[]
}

interface Settings {
  portals?: string[]
}

function listOrFallback(values: string[] | undefined, fallback: string): string {
  return values?.length ? values.join(', ') : fallback
}

function portalText(settings: Settings | null): string {
  return settings?.portals?.length ? settings.portals.join(', ') : '{portal_url}'
}

const DEFAULT_AVOID = [
  'MLM',
  'Ventas a comisión pura sin sueldo base',
  'Inversión inicial',
  'Reviews negativos visibles',
  'Zona muy alejada no remota',
  'Inglés superior a B1',
  'Senior',
  'G&L GROUP'
]

function applyInstructionVariables(text: string, profile: Profile | null, settings: Settings | null): string {
  const portal = portalText(settings)
  const role = profile?.targetRole || 'Frontend Developer / React Developer / Angular Developer / TypeScript Developer'
  return text
    .replaceAll('{portal_url}', portal)
    .replaceAll('{portal}', portal)
    .replaceAll('{rol}', role)
    .replaceAll('{role}', role)
    .replaceAll('{target_role}', role)
}

function buildSearchInstructions(profile: Profile | null, settings: Settings | null): string {
  const portal = portalText(settings)
  const targetRole = profile?.targetRole || 'Frontend Developer / React Developer / Angular Developer / TypeScript Developer'
  const experience = profile?.experience || 'Frontend Developer con 2+ años de experiencia construyendo aplicaciones web con React, TypeScript y Angular en entornos enterprise, gubernamentales y freelance.'
  const skills = listOrFallback(profile?.mainStack, 'React, TypeScript, Angular, APIs REST, Jest / React Testing Library')
  const softSkills = listOrFallback(profile?.softSkills, 'Trabajo en equipo, comunicación con clientes y equipos técnicos, adaptabilidad')
  const salaryExpectation = profile?.salaryExpectation || 'USD 2000 como mínimo'
  const modality = listOrFallback(profile?.preferredModality, 'híbrida (solo si es en Buenos Aires) / remota')
  const availability = listOrFallback(profile?.availability, 'full-time')
  const location = listOrFallback(profile?.preferredLocation, 'Buenos Aires, Argentina')
  const avoid = (profile?.avoid ?? []).length ? profile!.avoid! : DEFAULT_AVOID
  const avoidLines = avoid.map((item) => `- ${item}`).join('\n')

  return `## ROL Y OBJETIVO

Sos un agente de búsqueda de empleo. Tu tarea es ingresar a ${portal}, buscar
ofertas laborales compatibles con mi perfil, priorizarlas según criterios
específicos y enviar postulaciones en mi nombre. Actuá con precisión,
sin saltearte pasos, y reportá cada acción realizada.

## MI PERFIL

- **Rol objetivo**: ${targetRole}
- **Experiencia laboral**: ${experience}
- **Competencias clave**: ${skills}
- **Soft skills**: ${softSkills}
- **Pretensión salarial**: ${salaryExpectation}
- **Modalidad preferida**: ${modality}
- **Disponibilidad**: ${availability}
- **Zona de residencia**: ${location}

## CRITERIOS DE FILTRO

Priorizá ofertas que cumplan al menos 3 de:
- Empresa con buena reputación (4+ estrellas)
- Salario igual o mayor a mi pretensión (o "no publicado" si el rol matchea)
- Modalidad que coincida
- Ubicación dentro de mi zona o remoto
- Beneficios mencionados

DESCARTÁ ofertas que:
${avoidLines}

## PLAN DE TAREAS

Ejecutá en orden:

1. **Verificar acceso y sesión**: confirmá que la extensión Claude in Chrome
   está activa. Verificá login en ${portal}.

2. **Buscar ofertas**: ingresá búsquedas en paralelo (hasta 4 simultáneas)
   usando keywords del rol. Ejemplo si soy "Asesor Comercial":
   "Asesor Comercial", "Ejecutivo de Ventas", "Vendedor B2B", "Account Manager".
   Abrí varias búsquedas, pero navegá los resultados con ritmo humano: no abras muchas ofertas o páginas en ráfaga.

   Cobertura obligatoria:
   - Armá la estrategia de búsqueda desde el perfil completo: rol objetivo, stack, seniority/experiencia, modalidad y ubicación.
   - A partir de esas palabras clave, generá variantes adicionales en español e inglés: sinónimos, títulos equivalentes, combinaciones con tecnologías del stack y términos de seniority. No te limites a las keywords literales cargadas.
   - Separá mentalmente keywords base (rol + stack principal del perfil) de keywords exploratorias (títulos equivalentes o tecnologías cercanas). Las exploratorias sirven para descubrir ofertas, pero no reemplazan los criterios de filtro.
   - Priorizá cobertura sobre velocidad. No te quedes solo con la primera página: intentá revisar al menos 3 páginas por búsqueda o 60-100 resultados totales por portal, salvo que se agoten resultados relevantes o el portal bloquee.
   - No estás obligado a encontrar una cantidad mínima de ofertas compatibles. Sí estás obligado a revisar suficiente mercado antes de concluir. Si encontrás menos de 10 compatibles, ampliá la búsqueda con más variantes, más páginas, otros portales configurados en JobPilot o filtros menos restrictivos del portal que no contradigan el perfil (por ejemplo fecha, orden, radio o seniority automático). Si hay un solo portal configurado, ampliá solo dentro de ese portal. Nunca relajes criterios, preferencias ni exclusiones cargadas en el perfil.
   - No rellenes el top con ofertas que no matchean solo para llegar a 10. Si después de ampliar hay menos de 10 compatibles, presentá las que haya y explicá la cobertura realizada.
   - Avanzá lento para evitar rate limit: esperá entre 6 y 12 segundos entre abrir resultados, cambiar de página, aplicar filtros o entrar a una oferta. Si el portal se pone lento, aumentá la espera.
   - No abras más de 2 ofertas del mismo portal al mismo tiempo. Si hay señales de bloqueo, pasá inmediatamente a navegación secuencial.
   - Usá todas las modalidades aceptadas por el perfil. Si el perfil dice Remoto e Híbrido, NO filtres solo remoto.
   - No uses filtros más restrictivos que el perfil (por ejemplo solo remoto, solo mid-senior, solo fecha reciente) salvo que expliques por qué y hagas también una búsqueda amplia.
   - En LinkedIn, revisá tanto búsquedas por keywords como la feed personalizada /jobs/search-results/ cuando esté disponible.
   - Buscá variantes en inglés y español derivadas del rol objetivo del perfil. Ejemplo si el rol fuera Frontend: Frontend Developer, React Developer, Angular Developer, TypeScript Developer, Desarrollador Frontend, Frontend SSR. Si el perfil indica otro rol, adaptá las variantes a ese rol.
   - Al presentar resultados, indicá qué keywords, filtros y secciones revisaste para que el usuario pueda auditar la búsqueda.
   - Si el portal aplica rate-limit, bloqueo o captcha, no afirmes que revisaste "todo lo relevante". Informá exactamente páginas/resultados revisados, qué quedó sin revisar y llamá a request_human_help con motivo y URL. No intentes resolver captchas por tu cuenta.

3. **Evaluar ofertas**: por cada resultado, abrí la oferta, leé descripción,
   evaluá según mis criterios. Asigná score 1-10.
   - No incluyas en el top ofertas que violen un descarte duro. Si son interesantes pero incumplen, listalas aparte como "descartadas".
   - Si una oferta pide inglés Strong, Advanced, Fluent, B2, C1 o C2, tratala como superior a B1 y descartala salvo que el perfil indique explícitamente que acepta ese nivel.
   - Si la empresa tiene rating visible menor a 4 o reviews claramente negativos, descartala en vez de ponerla en el top.

4. **STOP en paso 4 — presentar top 10** en tabla con columnas:
   Puesto | Empresa | Lugar | Salario | Modalidad | Score | Razón del match
   Mostrame y esperá mi confirmación.
   Antes de la tabla, incluí un resumen de cobertura: portales revisados, queries usadas, páginas/resultados revisados, cantidad de ofertas válidas, descartadas y pendientes por bloqueo.

5. **Esperar instrucción**:
   - "confirmar todos" → postular en orden
   - "omitir X" → postular solo las confirmadas
   - "editar X" → te indico cambios

## REGLAS DURAS

- NUNCA postular sin confirmación humana en paso 4
- En modo búsqueda, no prometas postular ni tomes "confirmar todos" como aprobación de postulación. La confirmación solo sirve para guardar o revisar ofertas; postular ocurre después, en modo postulación y con aprobación en JobPilot.
- NUNCA cartas genéricas, siempre personalizadas
- Si falla 2 veces, salteala y registrala como error
- Si pide test técnico antes de postular, marcala como "pendiente test"
- NUNCA reveles info personal a terceros fuera del portal
- Ante CAPTCHA, verificación humana, rate limit persistente, login o 2FA, llamá a request_human_help con motivo y URL, pausá y esperá al usuario.
- NO postules a G&L GROUP`
}

function buildApplicationInstructions(): string {
  return `## PLAN DE TAREAS

Ejecutá en orden:

6. **Postular**: por cada oferta confirmada o aprobada en JobPilot:
   - Adjuntá mi CV PDF desde cvPath
   - Carta personalizada: esperá a que yo te la envíe o te pase el mensaje de por qué quiero entrar a esta empresa, por qué este rol, y un logro específico relevante
   - Enviá postulación
   - Confirmá éxito

7. **Reportá**: resumen final con total postuladas, confirmadas, errores,
   y top 3 mejor match para seguimiento LinkedIn manual.

## REGLAS DURAS

- NUNCA postular sin confirmación humana en paso 4 o aprobación explícita en JobPilot
- NUNCA uses cartas genéricas, siempre personalizadas por empresa y rol
- Si falla 2 veces, salteala y registrala como error
- Si pide test técnico antes de postular, marcala como "pendiente test"
- NUNCA reveles info personal a terceros fuera del portal
- NO postules a G&L GROUP`
}

// Busca un término como palabra completa (evita que "react" matchee "reaction").
// Escapa caracteres especiales para soportar tags como "Node.js" o "C++".
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

// Scoring con topes por categoría para que discrimine (no satura en 100 con solo nombrar 4 techs).
function scoreOffer(offer: RawOffer, profile: Profile | null): ScoreResult {
  if (!profile) return { score: 50, positives: [], negatives: [] }
  const text = `${offer.title ?? ''} ${offer.description ?? ''} ${(offer.requirements ?? []).join(' ')}`.toLowerCase()
  let score = 42
  const positives: string[] = []
  const negatives: string[] = []

  let mainPts = 0
  for (const tech of profile.mainStack ?? []) if (hasTerm(text, tech)) { mainPts += 8; positives.push(tech) }
  score += Math.min(mainPts, 30) // stack principal aporta hasta +30

  if ((profile.preferredModality ?? []).some((m) => hasTerm(text, m))) { score += 6; positives.push('modalidad') }
  if ((profile.preferredLocation ?? []).some((l) => hasTerm(text, l))) { score += 6; positives.push('ubicación') }

  for (const bad of profile.avoid ?? []) if (hasTerm(text, bad)) { score -= 18; negatives.push(bad) }

  return { score: Math.max(0, Math.min(100, score)), positives, negatives }
}

function buildOffer(raw: RawOffer, profile: Profile | null): Record<string, unknown> {
  const { score, positives, negatives } = scoreOffer(raw, profile)
  const status = score >= 65 ? 'recomendada' : 'detectada'
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

// ponytail: dedup por link normalizado (saca www/protocolo/query/slash), fallback título+empresa
function normLink(s: string): string {
  try {
    const u = new URL(String(s))
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const path = u.pathname.toLowerCase().replace(/\/$/, '')
    const indeedId = u.searchParams.get('jk')
    if (host.includes('indeed.') && indeedId) return `${host}/viewjob?jk=${indeedId.toLowerCase()}`
    const linkedInId = u.searchParams.get('currentJobId') ?? u.searchParams.get('jobId')
    if (host.includes('linkedin.') && linkedInId) return `${host}/jobs/view/${linkedInId.toLowerCase()}`
    const linkedInPathId = path.match(/\/jobs\/view\/(\d+)/)?.[1]
    if (host.includes('linkedin.') && linkedInPathId) return `${host}/jobs/view/${linkedInPathId}`
    return `${host}${path}`
  } catch {
    return String(s).toLowerCase().split('?')[0].replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
  }
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
          const profile = readJson<Profile | null>(join(DATA_DIR, 'profile.json'), null)
          let text: string
          if (mode === 'busqueda') {
            const settings = readJson<Settings | null>(join(DATA_DIR, 'settings.json'), null)
            text = applyInstructionVariables(buildSearchInstructions(profile, settings), profile, settings)
          } else {
            text = applyInstructionVariables(buildApplicationInstructions(), profile, null)
          }
          return { content: [{ type: 'text', text }] }
        }

        case 'add_offer': {
          const a = args as RawOffer
          const profile = readJson<Profile | null>(join(DATA_DIR, 'profile.json'), null)
          const offers = readJson<Array<Record<string, unknown>>>(join(DATA_DIR, 'offers.json'), [])
          const dup = findDup(offers, a)
          if (dup) {
            return { content: [{ type: 'text', text: `Ya existe en JobPilot: "${dup.title}" (estado: ${dup.status}). NO la agregué de nuevo ni la abras — ya está cargada${dup.status === 'postulada' ? ', y ya postulada' : ''}. Saltala.` }] }
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
                (skipped.length ? `\n\nYa existentes (no agregadas): ${skipped.join(', ')}` : '')
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
