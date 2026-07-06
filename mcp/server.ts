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
  status?: string
  decision?: string
  save?: boolean
  compatible?: boolean
}

interface Profile {
  targetRole?: string
  targetRoles?: string[]
  experienceYearsMin?: number
  experienceYearsMax?: number
  experience?: string
  softSkills?: string[]
  salaryCurrency?: string
  salaryMin?: number
  salaryMax?: number
  salaryExpectation?: string
  availability?: string[]
  mainStack?: string[]
  secondaryStack?: string[]
  targetSeniority?: string[]
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

function formatExperienceYearsRange(profile: Profile | null): string {
  const min = profile?.experienceYearsMin
  const max = profile?.experienceYearsMax
  if (typeof min === 'number' && typeof max === 'number') return min === max ? `${min} años` : `${min}-${max} años`
  if (typeof min === 'number') return `${min}+ años`
  if (typeof max === 'number') return `hasta ${max} años`
  return profile?.experience?.trim() || 'No definido'
}

function formatSalaryRange(profile: Profile | null): string {
  const currency = profile?.salaryCurrency || 'USD'
  const min = profile?.salaryMin
  const max = profile?.salaryMax
  if (typeof min === 'number' && typeof max === 'number') return min === max ? `${currency} ${min}` : `${currency} ${min}-${max}`
  if (typeof min === 'number') return `${currency} ${min} como mínimo`
  if (typeof max === 'number') return `hasta ${currency} ${max}`
  return profile?.salaryExpectation?.trim() || 'USD 2000 como minimo'
}

function portalText(settings: Settings | null): string {
  return settings?.portals?.length ? settings.portals.join(', ') : 'No definido'
}

const DEFAULT_AVOID = [
  'MLM',
  'Ventas a comisión pura sin sueldo base',
  'Inversión inicial',
  'Reviews negativos visibles',
  'Zona muy alejada no remota',
  'Inglés superior a B1',
  'Senior 5+ años',
  'Lead',
  'Staff',
  'Principal',
  'G&L GROUP'
]

const DEFAULT_TARGET_SENIORITY = ['Junior', 'Semi Senior', 'SSR']

function applyInstructionVariables(text: string, profile: Profile | null, settings: Settings | null): string {
  const portal = portalText(settings)
  const role = listOrFallback(profile?.targetRoles, profile?.targetRole || 'No definido')
  return text
    .replaceAll('{portal_url}', portal)
    .replaceAll('{portal}', portal)
    .replaceAll('{rol}', role)
    .replaceAll('{role}', role)
    .replaceAll('{target_role}', role)
}

function buildSearchInstructions(profile: Profile | null, settings: Settings | null): string {
  const portal = portalText(settings)
  const targetRole = listOrFallback(profile?.targetRoles, profile?.targetRole || 'No definido')
  const targetSeniority = listOrFallback(profile?.targetSeniority, DEFAULT_TARGET_SENIORITY.join(', '))
  const skills = listOrFallback(profile?.mainStack, 'No definido')
  const softSkills = listOrFallback(profile?.softSkills, 'Trabajo en equipo, comunicación con clientes y equipos técnicos, adaptabilidad')
  const experienceYears = formatExperienceYearsRange(profile)
  const salaryExpectation = formatSalaryRange(profile)
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

- **Roles objetivo**: ${targetRole}
- **Seniority buscado**: ${targetSeniority}
- **Años de experiencia buscados**: ${experienceYears}
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
   - Si Roles objetivo o portales figuran como "No definido", no inicies la búsqueda. Pedí al usuario que complete Perfil/Portales en JobPilot y esperá.
   - Armá la estrategia de búsqueda desde el perfil completo: roles objetivo, stack, seniority, años de experiencia, modalidad y ubicación.
   - A partir de esas palabras clave, generá variantes adicionales en español e inglés: sinónimos, títulos equivalentes, combinaciones con tecnologías del stack y términos de seniority. No te limites a las keywords literales cargadas.
   - Usá el seniority buscado para generar variantes de búsqueda. Por ejemplo, si el perfil indica SSR o Semi Senior, probá variantes como "SSR", "Semi Senior", "Semi-Senior", "Semisenior", "Mid-level" y "Mid".
   - Separá mentalmente keywords base (rol + stack principal del perfil) de keywords exploratorias (títulos equivalentes o tecnologías cercanas). Las exploratorias sirven para descubrir ofertas, pero no reemplazan los criterios de filtro.
   - Priorizá profundidad sobre velocidad. Antes de concluir una búsqueda normal, revisá como mínimo 80-120 tarjetas/resultados por portal y abrí/lee 40-60 avisos que parezcan mínimamente cercanos al perfil. Si hay menos resultados disponibles, indicá exactamente dónde se agotaron.
   - Para cada keyword principal, revisá al menos 3 páginas completas de resultados. No uses "saturación" para cortar antes de página 3 salvo bloqueo técnico real, captcha, login, rate limit o ausencia total de resultados.
   - Recién podés declarar saturación cuando hayas revisado al menos 5 queries distintas y 100 tarjetas/resultados totales, y más del 70% de los resultados nuevos sean repetidos o claramente fuera de perfil por título/empresa ya vistos.
   - No alcanza con abrir 20-30 avisos en total. Si encontrás pocas compatibles, seguí buscando más lento y más profundo: más páginas, más variantes, otros portales configurados o filtros menos restrictivos del portal que no contradigan el perfil. Nunca relajes criterios, preferencias ni exclusiones cargadas en el perfil.
   - No rellenes el top con ofertas que no matchean solo para llegar a 10. Si después de ampliar hay menos de 10 compatibles, presentá las que haya y explicá la cobertura realizada.
   - Avanzá lento para evitar rate limit: esperá entre 8 y 15 segundos entre abrir resultados, cambiar de página, aplicar filtros o entrar a una oferta. Si el portal se pone lento, aumentá la espera. Es preferible tardar más y revisar mucho que hacer una búsqueda superficial.
   - No abras más de 2 ofertas del mismo portal al mismo tiempo. Si hay señales de bloqueo, pasá inmediatamente a navegación secuencial.
   - Usá todas las modalidades aceptadas por el perfil. Si el perfil dice Remoto e Híbrido, NO filtres solo remoto.
   - No uses filtros más restrictivos que el perfil (por ejemplo solo remoto, solo mid-senior, solo fecha reciente) salvo que expliques por qué y hagas también una búsqueda amplia.
   - En LinkedIn, revisá tanto búsquedas por keywords como la feed personalizada /jobs/search-results/ cuando esté disponible.
   - Buscá variantes en inglés y español derivadas de los roles objetivo del perfil. Ejemplo si el rol fuera Frontend: Frontend Developer, React Developer, Angular Developer, TypeScript Developer, Desarrollador Frontend, Frontend SSR. Si el perfil indica otros roles, adaptá las variantes a esos roles.
   - Al presentar resultados, indicá qué keywords, filtros y secciones revisaste, cuántas tarjetas/resultados escaneaste, cuántos avisos abriste/leíste completos, cuántas páginas recorriste por query y cuántos quedaron pendientes por error de carga.
   - Si el portal aplica rate-limit, bloqueo o captcha, no afirmes que revisaste "todo lo relevante". Informá exactamente páginas/resultados revisados, qué quedó sin revisar y llamá a request_human_help con motivo y URL. No intentes resolver captchas por tu cuenta.

3. **Evaluar ofertas**: por cada resultado, abrí la oferta, leé descripción,
   evaluá según mis criterios. Asigná score 1-10.
   - Guardá en JobPilot solo ofertas compatibles o dudosas que valga la pena que el usuario revise.
   - No guardes en JobPilot ofertas que violen un descarte duro o que claramente no interesan. Esas ofertas van solo en el resumen como "descartadas", con motivo breve.
   - Si una oferta no carga o no podés leer la descripción completa, no la descartes por falta de información. Reintentá al menos 2 veces con espera; si sigue fallando, registrala en el resumen como pendiente por error de carga con URL, portal y reintentos.
   - Si una oferta pide inglés Strong, Advanced, Fluent, B2, C1 o C2, tratala como superior a B1 y descartala salvo que el perfil indique explícitamente que acepta ese nivel.
   - Si la empresa tiene rating visible menor a 4 o reviews claramente negativos, descartala en vez de ponerla en el top.

4. **STOP en paso 4 — presentar top 10** en tabla con columnas:
   Puesto | Empresa | Lugar | Salario | Modalidad | Score | Razón del match
   Mostrame y esperá mi confirmación.
   Antes de la tabla, incluí un resumen de cobertura: portales revisados, queries usadas, páginas/resultados revisados, cantidad de ofertas guardadas, descartadas no guardadas y pendientes por bloqueo.

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
function hasTerm(text: string, term: string): boolean {
  const t = term.trim().toLowerCase()
  if (t.length < 2) return false
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text)
}

const SENIORITY_PATTERNS: Record<string, RegExp[]> = {
  trainee: [/(^|[^a-z0-9])(trainee|pasante|internship|intern)([^a-z0-9]|$)/i],
  junior: [/(^|[^a-z0-9])(junior|jr\.?)([^a-z0-9]|$)/i],
  'semi senior': [/(^|[^a-z0-9])(semi[\s-]?senior|semi[\s-]?sr\.?|semisenior|ssr)([^a-z0-9]|$)/i],
  ssr: [/(^|[^a-z0-9])(ssr|semi[\s-]?senior|semi[\s-]?sr\.?|semisenior)([^a-z0-9]|$)/i],
  mid: [/(^|[^a-z0-9])(mid[\s-]?level|mid|intermediate|semi[\s-]?senior|ssr)([^a-z0-9]|$)/i],
  lead: [/(^|[^a-z0-9])(lead|tech lead|team lead)([^a-z0-9]|$)/i],
  staff: [/(^|[^a-z0-9])staff([^a-z0-9]|$)/i],
  principal: [/(^|[^a-z0-9])principal([^a-z0-9]|$)/i]
}

const SENIORITY_MAX_YEARS: Record<string, number> = {
  trainee: 1,
  junior: 2,
  'semi senior': 4,
  ssr: 4,
  mid: 4,
  senior: 99,
  lead: 99,
  staff: 99,
  principal: 99
}

interface YearsRange {
  min: number
  max: number
}

interface SalaryRange {
  currency?: string
  min?: number
  max?: number
}

function normalizeSeniority(value: string): string {
  return value.trim().toLowerCase()
    .replace(/\./g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
}

function getTargetSeniorities(profile: Profile): string[] {
  const values = (profile.targetSeniority?.length ? profile.targetSeniority : DEFAULT_TARGET_SENIORITY)
    .map(normalizeSeniority)
  return [...new Set(values)]
}

function matchesStandaloneSenior(text: string): boolean {
  const seniorMatches = [...text.matchAll(/(^|[^a-z0-9])(senior|sr\.?)([^a-z0-9]|$)/gi)]
  return seniorMatches.some((match) => {
    const start = match.index ?? 0
    const prefix = text.slice(Math.max(0, start - 10), start + match[1].length).toLowerCase()
    return !/(semi[\s-]?|mid[\s-]?)$/.test(prefix)
  })
}

function matchesSeniority(text: string, seniority: string): boolean {
  if (seniority === 'senior') return matchesStandaloneSenior(text)
  const patterns = SENIORITY_PATTERNS[seniority]
  return patterns ? patterns.some((pattern) => pattern.test(text)) : hasTerm(text, seniority)
}

function requiredYearsRange(text: string): YearsRange | null {
  if (/(sin experiencia|no se requiere experiencia|without experience|no experience)/i.test(text)) {
    return { min: 0, max: 0 }
  }
  const matches = [...text.matchAll(/(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s*\+?\s*(?:años|anos|years|yrs)/gi)]
  if (matches.length === 0) return null
  const ranges = matches.map((match) => ({
    min: Number(match[1]),
    max: Number(match[2] ?? match[1])
  }))
  return {
    min: Math.min(...ranges.map((range) => range.min)),
    max: Math.max(...ranges.map((range) => range.max))
  }
}

function parseMoney(value: string): number | undefined {
  const compact = value.replace(/\s+/g, '')
  const normalized = compact.includes(',') && !compact.includes('.')
    ? compact.replace(',', '.')
    : compact.replace(/[.,]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseSalaryRange(value: string | undefined): SalaryRange {
  const text = value ?? ''
  const currencyMatch = text.match(/(USD|ARS|EUR|US\$|U\$S|\$)/i)
  const rawCurrency = currencyMatch?.[1]
  const currency = rawCurrency
    ? (rawCurrency === '$' ? 'ARS' : rawCurrency.replace(/^US\$|^U\$S$/i, 'USD').toUpperCase())
    : undefined
  const numbers = [...text.matchAll(/\d[\d.,]*/g)]
    .map((match) => parseMoney(match[0]))
    .filter((number): number is number => typeof number === 'number')
  return { currency, min: numbers[0], max: numbers[1] ?? numbers[0] }
}

function hasHighSenioritySignal(text: string): string | null {
  for (const level of ['lead', 'staff', 'principal', 'senior']) {
    if (matchesSeniority(text, level)) return level
  }
  return null
}

function isAvoidMatch(text: string, term: string): boolean {
  const normalized = normalizeSeniority(term)
  if (normalized === 'senior') return matchesSeniority(text, 'senior')
  return hasTerm(text, term)
}

function scoreSeniority(text: string, profile: Profile): ScoreResult {
  const targets = getTargetSeniorities(profile)
  const positives: string[] = []
  const negatives: string[] = []

  const matchedTarget = targets.find((level) => matchesSeniority(text, level))
  if (matchedTarget) positives.push(`seniority: ${matchedTarget}`)

  const highSignal = hasHighSenioritySignal(text)
  const seniorityMaxYears = Math.max(...targets.map((level) => SENIORITY_MAX_YEARS[level] ?? 4))
  const maxAcceptedYears = typeof profile.experienceYearsMax === 'number'
    ? profile.experienceYearsMax
    : seniorityMaxYears
  const years = requiredYearsRange(text)

  if (highSignal && !targets.includes(highSignal)) negatives.push(`seniority alto: ${highSignal}`)
  if (years !== null && years.max > maxAcceptedYears) negatives.push(`experiencia requerida: ${years.max}+ años`)
  if (years !== null && typeof profile.experienceYearsMin === 'number' && years.max < profile.experienceYearsMin) {
    negatives.push(`experiencia por debajo del rango: ${years.max} años`)
  }

  return {
    score: (matchedTarget ? 10 : 0) - (negatives.length ? 22 : 0),
    positives,
    negatives
  }
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

  if ((profile.preferredModality ?? []).some((m) => hasTerm(text, m))) { score += 6; positives.push('modalidad') }
  if ((profile.preferredLocation ?? []).some((l) => hasTerm(text, l))) { score += 6; positives.push('ubicación') }

  const seniority = scoreSeniority(text, profile)
  score += seniority.score
  positives.push(...seniority.positives)
  negatives.push(...seniority.negatives)

  const offeredSalary = parseSalaryRange(offer.salary)
  const sameCurrency = !offeredSalary.currency ||
    !profile.salaryCurrency ||
    offeredSalary.currency === profile.salaryCurrency.toUpperCase()
  if (typeof profile.salaryMin === 'number' && typeof offeredSalary.max === 'number' && sameCurrency) {
    if (offeredSalary.max < profile.salaryMin) {
      score -= 18
      negatives.push('salario debajo de pretensión')
    } else {
      score += 6
      positives.push('salario compatible')
    }
  }

  for (const bad of profile.avoid ?? []) if (isAvoidMatch(text, bad)) { score -= 18; negatives.push(bad) }

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

// ponytail: dedup por link normalizado, fallback título+empresa
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

function rawOfferShouldNotBeSaved(raw: RawOffer): boolean {
  if (raw.save === false || raw.compatible === false) return true
  const decision = `${raw.status ?? ''} ${raw.decision ?? ''}`.toLowerCase()
  return /\b(rechazad[ao]s?|descartad[ao]s?|discarded|rejected|hard reject)\b/.test(decision)
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
    name: 'add_offer',
    description: 'Agrega una oferta laboral a JobPilot solo si es compatible o dudosa y vale la pena que el usuario la revise. No uses esta herramienta para ofertas descartadas por criterios duros; reportalas solo en el resumen.',
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
    description: 'Agrega múltiples ofertas laborales compatibles o dudosas de una vez. No incluyas ofertas descartadas por criterios duros; esas se informan solo en el resumen de cobertura.',
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
        if (rawOfferShouldNotBeSaved(a)) {
          return { content: [{ type: 'text', text: `Oferta "${a.title ?? 'sin título'}" no guardada: fue marcada como descartada/no compatible. Informala solo en el resumen.` }] }
        }
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
        const notSaved: string[] = []
        const built: Array<Record<string, unknown>> = []
        for (const r of rawOffers) {
          if (rawOfferShouldNotBeSaved(r)) {
            notSaved.push(r.title ?? 'Sin título')
            continue
          }
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
              (skipped.length ? `\n\nYa existentes: ${skipped.join(', ')}` : '') +
              (notSaved.length ? `\n\nDescartadas no guardadas: ${notSaved.join(', ')}` : '')
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
