import { useState, useEffect, useCallback } from 'react'
import { Copy, CheckCheck, RotateCcw, ChevronDown, ChevronUp, ClipboardPaste, Settings2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'

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

function buildDefaultSearchInstructions(portals: string[], avoid: string[]): string {
  const portalList = portals.length ? portals.join(', ') : 'LinkedIn, Bumeran, GetOnBoard'
  const avoidLines = avoid.length
    ? avoid.map((a) => `- ${a}`).join('\n')
    : '- (ninguno configurado — editá tu perfil)'
  return `## PORTALES A BUSCAR
${portalList}

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
- Coincidan con las exclusiones del perfil:
${avoidLines}

## PLAN DE TAREAS
1. get_profile — leer el perfil completo del usuario
2. Verificar que Claude in Chrome está activo y hay sesión en cada portal
3. Buscar con las keywords del perfil (hasta 4 búsquedas en paralelo por portal)
4. Por cada oferta relevante: leer descripción completa → evaluar → add_offer
5. Al terminar todos los portales: add_offers en bloque si acumulaste varias
6. STOP — reportar cuántas guardaste y distribución de score, esperar aprobación en JobPilot

## REGLAS
- NUNCA postules en esta fase, solo buscás y guardás
- No reveles información personal fuera del portal`
}

const DEFAULT_APP_INSTRUCTIONS =
`## PLAN DE TAREAS
1. get_profile — obtener datos del usuario y ruta del CV (cvPath)
2. get_answers_bank — cargar banco de respuestas frecuentes
3. list_approved_offers — listar ofertas que el usuario aprobó en JobPilot
4. Por cada oferta aprobada:
   a. Abrir el link con Claude in Chrome
   b. Releer la descripción completa
   c. Redactar carta personalizada (2-3 párrafos):
      - Por qué esta empresa específicamente
      - Por qué este rol encaja con tu experiencia
      - Un logro concreto y relevante
   d. Adjuntar CV desde la ruta cvPath del perfil
   e. Completar formularios usando el banco de respuestas si aplica
   f. Enviar la postulación
   g. Registrar resultado:
      - Éxito → mark_offer_applied con descripción del resultado
      - 2 fallos → register_error status "error"
      - Test técnico requerido → register_error status "pendiente_test"
      - Requiere acción manual → register_error status "pendiente_manual"
5. get_tracker_summary — reportar resumen final al usuario

## REGLAS
- NUNCA postules sin que la oferta esté en estado "aprobada" en JobPilot
- NUNCA uses cartas genéricas, siempre personalizadas por empresa y rol
- Si el portal pide crear cuenta nueva → pendiente_manual
- No reveles información personal fuera del portal`

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

function ResetBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs border transition-all flex-shrink-0"
      style={{ background: alpha(col.raised, 0.8), borderColor: alpha(col.border, 0.3), color: col.fgMuted }}
      title="Volver al texto por defecto">
      <RotateCcw size={10} /> Reset
    </button>
  )
}

// ─── "Lo que pegás en Cowork" — paso copiable ─────────────────────────────────

function PasteStep({ step, title, where, text, editable, isCustom, onChange, onReset }: {
  step: string; title: string; where: string; text: string
  editable?: boolean; isCustom?: boolean
  onChange?: (v: string) => void; onReset?: () => void
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
        {editable && isCustom && onReset && <ResetBtn onClick={onReset} />}
        <CopyBtn text={text} />
        <button onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-2xs px-2 py-1 rounded border transition-all flex-shrink-0"
          style={{ borderColor: alpha(col.border, 0.3), color: col.fgMuted }}>
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {open ? 'Ocultar' : 'Ver'}
        </button>
      </div>

      {open && (
        editable && onChange ? (
          <textarea
            className="rounded-md p-3 text-2xs leading-relaxed resize-y"
            rows={5}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            style={{
              background: alpha(col.raised, 0.5), border: `1px solid ${alpha(col.border, 0.2)}`,
              color: col.fg, fontFamily: 'inherit', outline: 'none', minHeight: 80,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = alpha(col.cream, 0.25) }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = alpha(col.border, 0.2) }}
          />
        ) : (
          <pre className="rounded-md p-3 text-2xs leading-relaxed"
            style={{
              background: alpha(col.raised, 0.5), border: `1px solid ${alpha(col.border, 0.15)}`,
              color: col.fgDim, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
            {text}
          </pre>
        )
      )}
    </div>
  )
}

// ─── "Comportamiento" — instrucción que Cowork lee, no se copia ───────────────

function BehaviorBlock({ title, sublabel, value, isCustom, onChange, onReset }: {
  title: string; sublabel: string; value: string; isCustom: boolean
  onChange: (v: string) => void; onReset: () => void
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
            {isCustom && (
              <span className="text-2xs px-1.5 py-0.5 rounded"
                style={{ background: alpha(col.violet, 0.15), color: col.violet, border: `1px solid ${alpha(col.violet, 0.3)}` }}>
                Editado
              </span>
            )}
          </div>
          <p className="text-2xs" style={{ color: col.fgMuted }}>{sublabel}</p>
        </div>
        {isCustom && <ResetBtn onClick={onReset} />}
        <button onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-2xs px-2 py-1 rounded border transition-all flex-shrink-0"
          style={{ borderColor: alpha(col.border, 0.3), color: col.fgMuted }}>
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {open ? 'Ocultar' : 'Editar'}
        </button>
      </div>

      {open && (
        <textarea
          className="rounded-md p-3 text-2xs leading-relaxed resize-y"
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: alpha(col.raised, 0.5), border: `1px solid ${alpha(col.border, 0.2)}`,
            color: col.fg, fontFamily: 'inherit', outline: 'none', minHeight: 160,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = alpha(col.cream, 0.25) }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = alpha(col.border, 0.2) }}
        />
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function Instructions() {
  const profile  = useStore((s) => s.profile)
  const settings = useStore((s) => s.settings)

  // Instrucciones que get_instructions devuelve (Cowork las lee, no se pegan)
  const [searchInstr, setSearchInstr] = useState('')
  const [appInstr,    setAppInstr]    = useState('')
  const [customSearch, setCustomSearch] = useState(false)
  const [customApp,    setCustomApp]    = useState(false)

  // Mensajes cortos (se pegan en el chat)
  const [searchMsg, setSearchMsg] = useState(DEFAULT_SEARCH_MSG)
  const [appMsg,    setAppMsg]    = useState(DEFAULT_APP_MSG)
  const [customSearchMsg, setCustomSearchMsg] = useState(false)
  const [customAppMsg,    setCustomAppMsg]    = useState(false)

  const defaultSearchInstr = buildDefaultSearchInstructions(settings.portals ?? [], profile.avoid ?? [])

  useEffect(() => {
    window.api.getPrompts().then((p) => {
      if (p.searchInstructions)      { setSearchInstr(p.searchInstructions);   setCustomSearch(true) }
      else                             setSearchInstr(defaultSearchInstr)
      if (p.applicationInstructions) { setAppInstr(p.applicationInstructions); setCustomApp(true) }
      else                             setAppInstr(DEFAULT_APP_INSTRUCTIONS)
      if (p.searchMessage)           { setSearchMsg(p.searchMessage);          setCustomSearchMsg(true) }
      if (p.applicationMessage)      { setAppMsg(p.applicationMessage);        setCustomAppMsg(true) }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mantener instrucciones de búsqueda en sync con perfil/settings si no están editadas
  useEffect(() => {
    if (!customSearch) setSearchInstr(defaultSearchInstr)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.avoid, settings.portals, customSearch])

  const persist = useCallback((
    si: string | null, ai: string | null, sm: string | null, am: string | null
  ) => {
    window.api.savePrompts({ searchInstructions: si, applicationInstructions: ai, searchMessage: sm, applicationMessage: am })
  }, [])

  // Helpers para no repetir el cálculo de los 4 valores en cada handler
  const save = (over: Partial<{ si: string | null; ai: string | null; sm: string | null; am: string | null }>) => {
    persist(
      'si' in over ? over.si! : (customSearch ? searchInstr : null),
      'ai' in over ? over.ai! : (customApp ? appInstr : null),
      'sm' in over ? over.sm! : (customSearchMsg ? searchMsg : null),
      'am' in over ? over.am! : (customAppMsg ? appMsg : null),
    )
  }

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
          editable
          isCustom={customSearchMsg}
          onChange={(v) => { setSearchMsg(v); setCustomSearchMsg(true); save({ sm: v }) }}
          onReset={() => { setSearchMsg(DEFAULT_SEARCH_MSG); setCustomSearchMsg(false); save({ sm: null }) }}
        />
        <PasteStep
          step="3"
          title="Para postular (después de aprobar en JobPilot)"
          where="Chat de Cowork"
          text={appMsg}
          editable
          isCustom={customAppMsg}
          onChange={(v) => { setAppMsg(v); setCustomAppMsg(true); save({ am: v }) }}
          onReset={() => { setAppMsg(DEFAULT_APP_MSG); setCustomAppMsg(false); save({ am: null }) }}
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
          estos textos automáticamente. Editalos solo si querés cambiar cómo busca o postula.
          Los portales (<span style={{ color: col.cream }}>{portals}</span>) y la lista Evitar se insertan solos desde Settings y Perfil.
        </div>

        <BehaviorBlock
          title="Instrucciones de búsqueda"
          sublabel="Criterios, portales y plan que Cowork sigue al buscar"
          value={searchInstr}
          isCustom={customSearch}
          onChange={(v) => { setSearchInstr(v); setCustomSearch(true); save({ si: v }) }}
          onReset={() => { setSearchInstr(defaultSearchInstr); setCustomSearch(false); save({ si: null }) }}
        />
        <BehaviorBlock
          title="Instrucciones de postulación"
          sublabel="Plan que Cowork sigue al postular a las ofertas aprobadas"
          value={appInstr}
          isCustom={customApp}
          onChange={(v) => { setAppInstr(v); setCustomApp(true); save({ ai: v }) }}
          onReset={() => { setAppInstr(DEFAULT_APP_INSTRUCTIONS); setCustomApp(false); save({ ai: null }) }}
        />
      </div>
    </div>
  )
}
