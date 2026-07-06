import { useState } from 'react'
import { Copy, CheckCheck, ChevronDown, ChevronUp, ClipboardPaste, Settings2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import { formatExperienceYearsRange, formatSalaryRange } from '../lib/mockData'
import type { UserProfile } from '../types'

// ─── Defaults ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT =
`Sos un agente de búsqueda y postulación de empleo conectado a JobPilot via MCP.

Antes de ejecutar cualquier tarea siempre llamá a:
1. get_profile — para leer el perfil actualizado del usuario
2. get_instructions con el mode correspondiente — para obtener criterios, portales y plan de pasos

Nunca postules sin aprobación explícita del usuario en JobPilot.`

const DEFAULT_SEARCH_MSG =
`Buscá ofertas de trabajo compatibles con mi perfil.

Llamá a get_profile y luego get_instructions mode="busqueda" antes de empezar.`

const DEFAULT_APP_MSG =
`Postulate a todas las ofertas que aprobé en JobPilot.

Llamá a get_profile y luego get_instructions mode="postulacion" antes de empezar.`

function listOrFallback(values: string[] | undefined, fallback: string): string {
  return values?.length ? values.join(', ') : fallback
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
function buildDefaultSearchInstructions(portals: string[], profile: UserProfile): string {
  const portal = portals.length ? portals.join(', ') : 'No definido'
  const targetRole = listOrFallback(profile.targetRoles, profile.targetRole || 'No definido')
  const targetSeniority = listOrFallback(profile.targetSeniority, DEFAULT_TARGET_SENIORITY.join(', '))
  const skills = listOrFallback(profile.mainStack, 'No definido')
  const softSkills = listOrFallback(profile.softSkills, 'Trabajo en equipo, comunicación con clientes y equipos técnicos, adaptabilidad')
  const experienceYears = formatExperienceYearsRange(profile)
  const salaryExpectation = formatSalaryRange(profile)
  const modality = listOrFallback(profile.preferredModality, 'híbrida (solo si es en Buenos Aires) / remota')
  const availability = listOrFallback(profile.availability, 'full-time')
  const location = listOrFallback(profile.preferredLocation, 'Buenos Aires, Argentina')
  const avoid = (profile.avoid ?? []).length ? profile.avoid : DEFAULT_AVOID
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

const DEFAULT_APP_INSTRUCTIONS =
`## PLAN DE TAREAS

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

// ─── Small pieces ────────────────────────────────────────────────────────────

function CopyBtn({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs border transition-all flex-shrink-0"
      style={{
        background: copied ? alpha(col.green, 0.12) : alpha(col.cream, 0.1),
        borderColor: copied ? alpha(col.green, 0.4) : alpha(col.cream, 0.3),
        color: copied ? col.green : col.cream,
      }}>
      {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
      {copied ? 'Copiado' : label}
    </button>
  )
}

// ─── "Lo que pegás en Cowork" — paso copiable ─────────────────────────────────

function PasteStep({ step, title, where, text }: {
  step: string; title: string; where: string; text: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-2 rounded-lg p-3.5"
      style={{ background: alpha(col.surface, 0.85), border: `1px solid ${alpha(col.cream, 0.18)}` }}>
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
          style={{ width: 22, height: 22, background: alpha(col.cream, 0.14), color: col.cream, fontSize: 11 }}>
          {step}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold" style={{ color: col.cream }}>{title}</p>
          <p className="text-2xs" style={{ color: col.fgMuted }}>Pegar en: <span style={{ color: col.amber }}>{where}</span></p>
        </div>
        <CopyBtn text={text} />
        <button onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-2xs px-2 py-1 rounded border transition-all flex-shrink-0"
          style={{ borderColor: alpha(col.border, 0.3), color: col.fgMuted }}>
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {open ? 'Ocultar' : 'Ver'}
        </button>
      </div>

      {open && (
        <pre className="rounded-md p-3 text-2xs leading-relaxed"
          style={{
            background: alpha(col.raised, 0.5), border: `1px solid ${alpha(col.border, 0.15)}`,
            color: col.fgDim, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
          {text}
        </pre>
      )}
    </div>
  )
}

// ─── "Comportamiento" — instrucción que Cowork lee, no se copia ───────────────

function BehaviorBlock({ title, sublabel, value }: {
  title: string; sublabel: string; value: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-2 rounded-lg p-3.5"
      style={{ background: alpha(col.surface, 0.5), border: `1px solid ${alpha(col.border, 0.2)}` }}>
      <div className="flex items-center gap-3">
        <Settings2 size={14} className="flex-shrink-0" style={{ color: col.fgMuted }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold" style={{ color: col.fg }}>{title}</p>
            <span className="text-2xs px-1.5 py-0.5 rounded"
              style={{ background: alpha(col.green, 0.12), color: col.green, border: `1px solid ${alpha(col.green, 0.25)}` }}>
              Automático
            </span>
          </div>
          <p className="text-2xs" style={{ color: col.fgMuted }}>{sublabel}</p>
        </div>
        <button onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-2xs px-2 py-1 rounded border transition-all flex-shrink-0"
          style={{ borderColor: alpha(col.border, 0.3), color: col.fgMuted }}>
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {open ? 'Ocultar' : 'Ver'}
        </button>
      </div>

      {open && (
        <pre
          className="rounded-md p-3 text-2xs leading-relaxed"
          style={{
            background: alpha(col.raised, 0.5), border: `1px solid ${alpha(col.border, 0.2)}`,
            color: col.fgDim, fontFamily: 'inherit', minHeight: 160, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
          {value}
        </pre>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function Instructions() {
  const profile  = useStore((s) => s.profile)
  const settings = useStore((s) => s.settings)

  const searchInstr = buildDefaultSearchInstructions(settings.portals ?? [], profile)
  const appInstr = DEFAULT_APP_INSTRUCTIONS
  const searchMsg = DEFAULT_SEARCH_MSG
  const appMsg = DEFAULT_APP_MSG
  const portals = settings.portals?.join(', ') || 'LinkedIn, Bumeran, GetOnBoard'

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Instrucciones Cowork</h1>
        <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
          Solo copiás 3 textos. El resto Cowork lo lee solo desde JobPilot.
        </p>
      </div>

      {/* ════ ZONA A: lo que pegás ════ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ClipboardPaste size={15} style={{ color: col.cream }} />
          <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: col.cream }}>
            Lo que pegás en Cowork
          </h2>
        </div>

        <PasteStep
          step="1"
          title="System prompt — una sola vez"
          where="Cowork → ⚙️ Instrucciones del proyecto"
          text={SYSTEM_PROMPT}
        />
        <PasteStep
          step="2"
          title="Para buscar ofertas"
          where="Chat de Cowork"
          text={searchMsg}
        />
        <PasteStep
          step="3"
          title="Para postular (después de aprobar en JobPilot)"
          where="Chat de Cowork"
          text={appMsg}
        />
      </div>

      {/* ════ ZONA B: comportamiento ════ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Settings2 size={15} style={{ color: col.fgMuted }} />
          <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: col.fgMuted }}>
            Comportamiento del agente
          </h2>
        </div>
        <div className="rounded-lg px-3.5 py-2.5 text-2xs"
          style={{ background: alpha(col.raised, 0.4), border: `1px solid ${alpha(col.border, 0.15)}`, color: col.fgMuted }}>
          No hace falta copiar esto. Cuando Cowork llama a <code style={{ color: col.violet }}>get_instructions</code> recibe
          estos textos automáticamente. Para cambiarlos, editá Perfil y Portales de búsqueda.
          El portal (<span style={{ color: col.cream }}>{portals}</span>) y el perfil se insertan solos.
        </div>

        <BehaviorBlock
          title="Instrucciones de búsqueda"
          sublabel="Criterios, portales y plan que Cowork sigue al buscar"
          value={searchInstr}
        />
        <BehaviorBlock
          title="Instrucciones de postulación"
          sublabel="Plan que Cowork sigue al postular a las ofertas aprobadas"
          value={appInstr}
        />
      </div>
    </div>
  )
}
