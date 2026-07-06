import { useState, useRef, useCallback, useEffect, type CSSProperties, type ReactNode } from 'react'
import { Plus, X, Save, FileText, Upload, Loader2, ShieldAlert } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import { formatExperienceYearsRange, formatSalaryRange } from '../lib/mockData'
import type { UserProfile } from '../types'

function CvDropZone({ value, hasText, onChange }: {
  value: string | undefined
  hasText: boolean
  onChange: (path: string | undefined, text?: string) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  const applyFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) return
    const filePath = (file as File & { path?: string }).path
    setLoading(true)
    setError(null)
    // Parsear el PDF para guardar el texto (lo usa Cowork para sacar logros/métricas)
    const res = await window.api.readPdfFromPath(filePath || file.name)
    setLoading(false)
    const path = filePath || file.name
    if (!res.success) setError(res.error ?? 'No se pudo extraer texto del PDF')
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
              {hasText ? '✓ Texto extraído (Cowork lo usa para la carta)' : `⚠ ${error ?? 'Sin texto extraído — volvé a cargarlo'}`}
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
    // Separa por coma o salto de línea para crear varios tags de una vez
    const parts = input.split(/[,;\n/]+/).map((p) => p.trim()).filter(Boolean)
    if (parts.length === 0) { setInput(''); return }
    const next = [...values]
    for (const p of parts) if (!next.includes(p)) next.push(p)
    if (next.length !== values.length) onChange(next)
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
          placeholder={placeholder ?? 'Escribí y Enter (o separá con comas)'}
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

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="text-2xs mt-1 leading-relaxed" style={{ color: col.fgMuted }}>
      {children}
    </p>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function pct(value: number, min: number, max: number): number {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}

function snapToStep(value: number, min: number, step: number): number {
  const snapped = Math.round((value - min) / step) * step + min
  return Number(snapped.toFixed(4))
}

function salaryScale(currency: string | undefined, salaryMin: number | undefined, salaryMax: number | undefined): { max: number; step: number } {
  const normalized = (currency ?? 'USD').trim().toUpperCase()
  const baseMax = normalized === 'ARS' ? 5000000 : 10000
  const step = normalized === 'ARS' ? 50000 : 100
  const highest = Math.max(salaryMin ?? 0, salaryMax ?? 0, baseMax)
  return { max: Math.ceil(highest / step) * step, step }
}

function formatYears(value: number): string {
  return Number.isInteger(value) ? `${value} años` : `${value.toFixed(1)} años`
}

function formatMoney(currency: string, value: number): string {
  return `${currency || 'USD'} ${value.toLocaleString('es-AR')}`
}

function RangeBar({
  label,
  minBound,
  maxBound,
  step,
  minValue,
  maxValue,
  openMinLabel,
  openMaxLabel,
  formatValue,
  clearMinAtBound = false,
  clearMaxAtBound = true,
  onMinChange,
  onMaxChange
}: {
  label: string
  minBound: number
  maxBound: number
  step: number
  minValue?: number
  maxValue?: number
  openMinLabel?: string
  openMaxLabel?: string
  formatValue: (value: number) => string
  clearMinAtBound?: boolean
  clearMaxAtBound?: boolean
  onMinChange: (value: number | undefined) => void
  onMaxChange: (value: number | undefined) => void
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)
  const rawMin = typeof minValue === 'number' ? minValue : minBound
  const rawMax = typeof maxValue === 'number' ? maxValue : maxBound
  const currentMin = clamp(Math.min(rawMin, rawMax), minBound, maxBound)
  const currentMax = clamp(Math.max(rawMin, rawMax), minBound, maxBound)
  const start = pct(currentMin, minBound, maxBound)
  const end = pct(currentMax, minBound, maxBound)
  const style = {
    '--range-start': `${start}%`,
    '--range-end': `${end}%`
  } as CSSProperties

  const valueFromClientX = (clientX: number): number => {
    const rect = shellRef.current?.getBoundingClientRect()
    if (!rect) return minBound
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return clamp(snapToStep(minBound + ratio * (maxBound - minBound), minBound, step), minBound, maxBound)
  }

  const updateMin = (value: number) => {
    const next = clamp(Math.min(value, currentMax), minBound, maxBound)
    onMinChange(clearMinAtBound && next === minBound ? undefined : next)
  }

  const updateMax = (value: number) => {
    const next = clamp(Math.max(value, currentMin), minBound, maxBound)
    onMaxChange(clearMaxAtBound && next === maxBound ? undefined : next)
  }

  const updateHandle = (handle: 'min' | 'max', value: number) => {
    if (handle === 'min') updateMin(value)
    else updateMax(value)
  }

  const handleShellPointerDown = (clientX: number) => {
    const next = valueFromClientX(clientX)
    const handle = Math.abs(next - currentMin) <= Math.abs(next - currentMax) ? 'min' : 'max'
    updateHandle(handle, next)
  }

  const handleKeyDown = (handle: 'min' | 'max', key: string) => {
    const current = handle === 'min' ? currentMin : currentMax
    if (key === 'ArrowLeft' || key === 'ArrowDown') updateHandle(handle, current - step)
    if (key === 'ArrowRight' || key === 'ArrowUp') updateHandle(handle, current + step)
    if (key === 'Home') updateHandle(handle, minBound)
    if (key === 'End') updateHandle(handle, maxBound)
  }

  return (
    <div className="range-field">
      <div className="flex items-center justify-between gap-3">
        <div className="label" style={{ marginBottom: 0 }}>{label}</div>
        <div className="range-values">
          <span>{typeof minValue === 'number' ? formatValue(currentMin) : (openMinLabel ?? formatValue(currentMin))}</span>
          <span className="range-separator">-</span>
          <span>{typeof maxValue === 'number' ? formatValue(currentMax) : (openMaxLabel ?? formatValue(currentMax))}</span>
        </div>
      </div>
      <div
        ref={shellRef}
        className="range-shell"
        style={style}
        onPointerDown={(e) => {
          if (!(e.target instanceof HTMLElement) || !e.target.classList.contains('range-handle')) {
            handleShellPointerDown(e.clientX)
          }
        }}
      >
        <div className="range-track" />
        <button
          type="button"
          className={`range-handle ${dragging === 'min' ? 'dragging' : ''}`}
          style={{ left: `${start}%` }}
          aria-label={`${label} minimo`}
          onKeyDown={(e) => handleKeyDown('min', e.key)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging('min')
          }}
          onPointerMove={(e) => {
            if (dragging === 'min') updateMin(valueFromClientX(e.clientX))
          }}
          onPointerUp={() => setDragging(null)}
          onPointerCancel={() => setDragging(null)}
        />
        <button
          type="button"
          className={`range-handle ${dragging === 'max' ? 'dragging' : ''}`}
          style={{ left: `${end}%` }}
          aria-label={`${label} maximo`}
          onKeyDown={(e) => handleKeyDown('max', e.key)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging('max')
          }}
          onPointerMove={(e) => {
            if (dragging === 'max') updateMax(valueFromClientX(e.clientX))
          }}
          onPointerUp={() => setDragging(null)}
          onPointerCancel={() => setDragging(null)}
        />
      </div>
      <div className="range-scale">
        <span>{formatValue(minBound)}</span>
        <span>{formatValue(maxBound)}</span>
      </div>
    </div>
  )
}

export function Profile() {
  const profile          = useStore((s) => s.profile)
  const settings         = useStore((s) => s.settings)
  const setProfile       = useStore((s) => s.setProfile)
  const setSettings      = useStore((s) => s.setSettings)
  const showNotification = useStore((s) => s.showNotification)

  const [form, setForm] = useState<UserProfile>({ ...profile })
  const [portals, setPortals] = useState<string[]>(settings.portals ?? [])

  useEffect(() => {
    setForm({ ...profile })
  }, [profile])

  useEffect(() => {
    setPortals(settings.portals ?? [])
  }, [settings.portals])

  const set = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const setTargetRoles = (roles: string[]) =>
    setForm((f) => ({ ...f, targetRoles: roles, targetRole: roles.join(', ') }))

  const currentSalaryScale = salaryScale(form.salaryCurrency, form.salaryMin, form.salaryMax)

  const setPersonalInfo = (key: keyof UserProfile['personalInfo'], value: string) =>
    setForm((f) => ({
      ...f,
      personalInfo: {
        ...(f.personalInfo ?? { dni: '', email: '', phone: '', address: '' }),
        [key]: value
      }
    }))

  const save = async () => {
    let next = {
      ...form,
      targetRole: (form.targetRoles ?? []).join(', '),
      experience: formatExperienceYearsRange(form),
      salaryExpectation: formatSalaryRange(form)
    }
    if (next.cvPath && !next.cvText) {
      const res = await window.api.readPdfFromPath(next.cvPath)
      if (res.success && res.text) {
        next = { ...next, cvText: res.text }
        setForm(next)
      } else {
        showNotification('error', res.error ?? 'No se pudo extraer texto del CV')
      }
    }

    await setProfile({ ...next, secondaryStack: [], updatedAt: new Date().toISOString() })
    await setSettings({ ...settings, portals })
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
            Define qué busca Cowork, qué guarda para revisar y qué descarta.
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
            <TagInput
              label="Roles objetivo"
              values={form.targetRoles ?? []}
              onChange={setTargetRoles}
              variant="primary"
              placeholder="Frontend Developer, React Developer, Angular Developer..."
            />
            <FieldHint>
              Títulos de puesto que Cowork usa como búsquedas base. El stack y el seniority generan variantes encima de estos roles.
            </FieldHint>
            <TagInput
              label="Seniority buscado"
              values={form.targetSeniority ?? []}
              onChange={(v) => set('targetSeniority', v)}
              variant="preference"
              placeholder="Junior, Semi Senior, SSR..."
            />
            <FieldHint>
              Se combina con el rol para probar variantes como SSR, Semi Senior, Mid-level o Junior.
            </FieldHint>
            <div className="flex flex-col gap-2">
              <RangeBar
                label="Años de experiencia"
                minBound={0}
                maxBound={12}
                step={0.5}
                minValue={form.experienceYearsMin}
                maxValue={form.experienceYearsMax}
                openMinLabel="Sin mínimo"
                openMaxLabel="Sin máximo"
                formatValue={formatYears}
                clearMinAtBound
                onMinChange={(value) => set('experienceYearsMin', value)}
                onMaxChange={(value) => set('experienceYearsMax', value)}
              />
              <FieldHint>
                Cowork lo usa como criterio explícito al evaluar ofertas que piden años obligatorios.
              </FieldHint>
            </div>
            <TagInput
              label="Soft skills"
              values={form.softSkills ?? []}
              onChange={(v) => set('softSkills', v)}
              variant="secondary"
              placeholder="Trabajo en equipo, comunicación, adaptabilidad…"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <RangeBar
                    label="Pretensión salarial"
                    minBound={0}
                    maxBound={currentSalaryScale.max}
                    step={currentSalaryScale.step}
                    minValue={form.salaryMin}
                    maxValue={form.salaryMax}
                    openMinLabel="Sin mínimo"
                    openMaxLabel="Sin máximo"
                    formatValue={(value) => formatMoney(form.salaryCurrency ?? 'USD', value)}
                    clearMinAtBound
                    onMinChange={(value) => set('salaryMin', value)}
                    onMaxChange={(value) => set('salaryMax', value)}
                  />
                </div>
                <div style={{ width: 84 }}>
                  <div className="label">Moneda</div>
                  <input
                    className="input"
                    value={form.salaryCurrency ?? 'USD'}
                    onChange={(e) => set('salaryCurrency', e.target.value.toUpperCase())}
                    placeholder="USD"
                  />
                </div>
              </div>
              <FieldHint>
                Si dejás el máximo vacío, se interpreta como mínimo aceptado.
              </FieldHint>
            </div>
            <TagInput
              label="Disponibilidad"
              values={form.availability ?? []}
              onChange={(v) => set('availability', v)}
              variant="preference"
              placeholder="Full-time, Part-time…"
            />
          </div>

          {/* Personal info */}
          <div
            className="card flex flex-col gap-4"
            style={{ boxShadow: `inset 3px 0 0 ${alpha(col.amber, 0.45)}` }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldAlert size={12} style={{ color: alpha(col.amber, 0.75) }} strokeWidth={2} />
              <div className="section-label" style={{ marginBottom: 0, color: alpha(col.amber, 0.8) }}>
                Datos personales
              </div>
            </div>
            <p className="text-2xs" style={{ color: col.fgMuted, marginTop: '-0.75rem' }}>
              Estos datos son sensibles. No es recomendable compartir DNI, telefono o direccion salvo que el portal lo pida de forma justificada.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="label">DNI</div>
                <input
                  className="input"
                  value={form.personalInfo?.dni ?? ''}
                  onChange={(e) => setPersonalInfo('dni', e.target.value)}
                  placeholder="Ej: 12.345.678"
                />
              </div>
              <div>
                <div className="label">Email</div>
                <input
                  className="input"
                  value={form.personalInfo?.email ?? ''}
                  onChange={(e) => setPersonalInfo('email', e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <div className="label">Telefono</div>
                <input
                  className="input"
                  value={form.personalInfo?.phone ?? ''}
                  onChange={(e) => setPersonalInfo('phone', e.target.value)}
                  placeholder="+54 9 11..."
                />
              </div>
              <div>
                <div className="label">Direccion</div>
                <input
                  className="input"
                  value={form.personalInfo?.address ?? ''}
                  onChange={(e) => setPersonalInfo('address', e.target.value)}
                  placeholder="Ciudad o direccion completa"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card flex flex-col gap-4 min-w-0">
            <div className="section-label" style={{ marginBottom: 0 }}>Habilidades</div>
            <TagInput
              label="Stack"
              values={form.mainStack}
              onChange={(v) => set('mainStack', v)}
              variant="primary"
              placeholder="React, TypeScript, Angular, APIs REST…"
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
              placeholder="Remoto, Híbrido, Presencial…"
            />
            <hr className="divider" />
            <TagInput
              label="Ubicación"
              values={form.preferredLocation}
              onChange={(v) => set('preferredLocation', v)}
              variant="preference"
              placeholder="CABA, AMBA, LATAM…"
            />
            <hr className="divider" />
            <TagInput
              label="Portales de búsqueda"
              values={portals}
              onChange={setPortals}
              variant="preference"
              placeholder="LinkedIn, GetOnBoard, Indeed…"
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
