import { useState, useRef, useCallback } from 'react'
import { Plus, X, Save, FileText, Upload, Loader2, ShieldAlert } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import type { UserProfile } from '../types'

function CvDropZone({ value, hasText, onChange }: {
  value: string | undefined
  hasText: boolean
  onChange: (path: string | undefined, text?: string) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  const applyFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) return
    const filePath = (file as File & { path?: string }).path
    setLoading(true)
    // Parsear el PDF para guardar el texto (lo usa Cowork para sacar logros/métricas)
    const res = await window.api.readPdfFromPath(filePath || file.name)
    setLoading(false)
    const path = filePath || file.name
    onChange(path, res.success ? res.text : undefined)
  }, [onChange])

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await applyFile(file)
  }

  const filename = value ? value.split(/[/\\]/).pop() : null

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border-2 border-dashed flex items-center gap-3 px-4 py-4 cursor-pointer transition-all"
        style={{
          borderColor: dragging ? col.cream : alpha(col.border, 0.35),
          background:  dragging ? alpha(col.cream, 0.04) : alpha(col.surface, 0.5),
        }}
      >
        {loading
          ? <Loader2 size={16} className="animate-spin flex-shrink-0" style={{ color: col.fgMuted }} />
          : <FileText size={16} className="flex-shrink-0" style={{ color: filename ? col.green : col.fgMuted }} />
        }
        <div className="flex-1 min-w-0">
          {filename
            ? <p className="text-xs font-medium truncate" style={{ color: col.fg }}>{filename}</p>
            : <p className="text-xs" style={{ color: col.fgMuted }}>Arrastrá tu CV acá o hacé click para seleccionarlo</p>
          }
          {value && <p className="text-2xs truncate mt-0.5" style={{ color: col.dim }}>{value}</p>}
          {value && (
            <p className="text-2xs mt-0.5" style={{ color: hasText ? col.green : col.amber }}>
              {hasText ? '✓ Texto extraído (Cowork lo usa para la carta)' : '⚠ Sin texto extraído — volvé a cargarlo'}
            </p>
          )}
        </div>
        <Upload size={13} className="flex-shrink-0" style={{ color: col.fgMuted }} />
      </div>

      {value && (
        <button
          className="btn-mini"
          style={{ alignSelf: 'flex-start' }}
          onClick={(e) => { e.stopPropagation(); onChange(undefined, undefined) }}
        >
          <X size={10} /> Quitar CV
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          await applyFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

type TagVariant = 'primary' | 'secondary' | 'preference' | 'exclude'

const TAG_STYLES: Record<TagVariant, React.CSSProperties> = {
  primary:    { color: col.cream,  borderColor: alpha(col.cream, 0.3),  background: alpha(col.cream, 0.08)  },
  secondary:  { color: col.fgDim, borderColor: alpha(col.fgDim, 0.22), background: alpha(col.fgDim, 0.06)  },
  preference: { color: col.amber, borderColor: alpha(col.amber, 0.3),  background: alpha(col.amber, 0.07)  },
  exclude:    { color: col.red,   borderColor: alpha(col.red, 0.28),   background: alpha(col.red, 0.06)    },
}

function TagInput({
  label, values, onChange, variant = 'primary', placeholder,
}: {
  label: string; values: string[]; onChange: (v: string[]) => void;
  variant?: TagVariant; placeholder?: string;
}) {
  const [input, setInput] = useState('')
  const tagStyle = TAG_STYLES[variant]

  const add = () => {
    const v = input.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setInput('')
  }

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {label && <div className="label">{label}</div>}

      {/* Tags — overflow:hidden prevents horizontal blowout */}
      <div
        className="flex flex-wrap gap-1.5 overflow-hidden"
        style={{ minHeight: '1.75rem' }}
      >
        {values.map((v) => (
          <span key={v} className="tag" style={tagStyle}>
            {v}
            <button
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'currentColor', lineHeight: 0 }}
            >
              <X size={9} />
            </button>
          </span>
        ))}
        {values.length === 0 && (
          <span className="text-2xs self-center" style={{ color: col.dim, fontStyle: 'italic' }}>
            Sin entradas
          </span>
        )}
      </div>

      <div className="flex gap-1.5">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          onBlur={add}
          placeholder={placeholder ?? 'Escribí y presioná Enter'}
        />
        <button
          onClick={add}
          className="btn-secondary flex-shrink-0"
          style={{ minWidth: 32, padding: '0 0.5rem' }}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  )
}

export function Profile() {
  const profile          = useStore((s) => s.profile)
  const setProfile       = useStore((s) => s.setProfile)
  const showNotification = useStore((s) => s.showNotification)

  const [form, setForm] = useState<UserProfile>({ ...profile })

  const set = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const save = async () => {
    await setProfile({ ...form, updatedAt: new Date().toISOString() })
    showNotification('success', 'Perfil guardado')
  }

  return (
    <div className="p-5 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label" style={{ marginBottom: '0.2rem' }}>Configuración</p>
          <h1 className="page-title" style={{ color: col.fg }}>Perfil</h1>
          <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
            Define cómo se puntúan las ofertas para vos
          </p>
        </div>
        <button className="btn-primary flex-shrink-0" onClick={save}>
          <Save size={13} /> Guardar cambios
        </button>
      </div>

      {/* Two-column grid — CSS grid gives each child an explicit track width,
          preventing the flex min-width blowout that caused tag overflow */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ── LEFT: Identity + Skills ── */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* Identity */}
          <div className="card flex flex-col gap-4">
            <div className="section-label" style={{ marginBottom: 0 }}>Identidad</div>
            <div>
              <div className="label">Rol objetivo</div>
              <input
                className="input"
                value={form.targetRole}
                onChange={(e) => set('targetRole', e.target.value)}
                placeholder="Ej: Frontend Developer SSR"
              />
            </div>
            <div>
              <div className="label">Experiencia</div>
              <textarea
                className="input"
                rows={2}
                value={form.experience}
                onChange={(e) => set('experience', e.target.value)}
                placeholder="Ej: 2+ años en desarrollo frontend con React y TypeScript"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="card flex flex-col gap-4 min-w-0">
            <div className="section-label" style={{ marginBottom: 0 }}>Habilidades</div>
            <TagInput
              label="Stack principal"
              values={form.mainStack}
              onChange={(v) => set('mainStack', v)}
              variant="primary"
              placeholder="React, TypeScript, Node.js…"
            />
            <hr className="divider" />
            <TagInput
              label="Stack secundario"
              values={form.secondaryStack}
              onChange={(v) => set('secondaryStack', v)}
              variant="secondary"
              placeholder="Jest, Docker, SQL…"
            />
          </div>
        </div>

        {/* ── RIGHT: Preferences + Exclusions ── */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* Preferences — amber accent */}
          <div
            className="card flex flex-col gap-4 min-w-0"
            style={{ boxShadow: `inset 3px 0 0 ${alpha(col.amber, 0.55)}` }}
          >
            <div className="section-label" style={{ marginBottom: 0, color: alpha(col.amber, 0.75) }}>
              Preferencias
            </div>
            <TagInput
              label="Modalidad"
              values={form.preferredModality}
              onChange={(v) => set('preferredModality', v)}
              variant="preference"
              placeholder="Remoto, Híbrido, Full-time…"
            />
            <hr className="divider" />
            <TagInput
              label="Ubicación"
              values={form.preferredLocation}
              onChange={(v) => set('preferredLocation', v)}
              variant="preference"
              placeholder="CABA, AMBA, LATAM…"
            />
          </div>

          {/* Exclusion filters — red accent + shield icon */}
          <div
            className="card flex flex-col gap-4 min-w-0"
            style={{ boxShadow: `inset 3px 0 0 ${alpha(col.red, 0.5)}` }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldAlert size={12} style={{ color: alpha(col.red, 0.7) }} strokeWidth={2} />
              <div className="section-label" style={{ marginBottom: 0, color: alpha(col.red, 0.72) }}>
                Filtros de exclusión
              </div>
            </div>
            <p className="text-2xs" style={{ color: col.fgMuted, marginTop: '-0.75rem' }}>
              Ofertas con estas palabras son penalizadas en el scoring.
            </p>
            <TagInput
              label=""
              values={form.avoid}
              onChange={(v) => set('avoid', v)}
              variant="exclude"
              placeholder="Soporte técnico, inglés excluyente…"
            />
          </div>
        </div>
      </div>

      {/* CV — full width */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <FileText size={12} style={{ color: col.fgMuted }} />
          <div className="section-label" style={{ marginBottom: 0 }}>Currículum</div>
        </div>
        <p className="text-2xs" style={{ color: col.fgMuted }}>
          Subí tu CV en PDF para que Cowork lo use como referencia al postular.
        </p>
        <CvDropZone
          value={form.cvPath}
          hasText={!!form.cvText}
          onChange={(path, text) => setForm((f) => ({ ...f, cvPath: path, cvText: text }))}
        />
      </div>

      <p className="text-2xs" style={{ color: col.dim }}>
        Última actualización: {new Date(profile.updatedAt).toLocaleString('es-AR')}
      </p>
    </div>
  )
}
