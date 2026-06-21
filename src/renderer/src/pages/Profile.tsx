import { useState, useRef, useCallback } from 'react'
import { Plus, X, Save, FileText, Upload, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import type { UserProfile } from '../types'

function CvDropZone({ value, onChange }: { value: string | undefined; onChange: (path: string | undefined) => void }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  const applyFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) return
    const filePath = (file as File & { path?: string }).path
    if (filePath) { onChange(filePath); return }
    setLoading(true)
    const res = await window.api.readPdfFromPath(file.name)
    setLoading(false)
    if (res.success) onChange(file.name)
  }, [onChange])

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await applyFile(file)
  }

  const handlePick = async () => {
    setLoading(true)
    const res = await window.api.selectPdf()
    setLoading(false)
    if (res.success && res.filename) {
      // selectPdf returns text; we need the path — fall back to dialog:select-file
      // Actually selectPdf doesn't return path. Use input click instead.
    }
    // Use the hidden input for picking (gives us file.path in Electron)
    inputRef.current?.click()
  }

  const filename = value ? value.split(/[/\\]/).pop() : null

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border-2 border-dashed flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all"
        style={{
          borderColor: dragging ? col.cream : alpha(col.border, 0.35),
          background: dragging ? alpha(col.cream, 0.04) : alpha(col.surface, 0.5),
        }}
      >
        {loading
          ? <Loader2 size={14} className="animate-spin flex-shrink-0" style={{ color: col.fgMuted }} />
          : <FileText size={14} className="flex-shrink-0" style={{ color: filename ? col.green : col.fgMuted }} />
        }
        <div className="flex-1 min-w-0">
          {filename
            ? <p className="text-xs truncate" style={{ color: col.fg }}>{filename}</p>
            : <p className="text-2xs" style={{ color: col.fgMuted }}>Arrastrá tu CV acá o hacé click para abrirlo</p>
          }
          {value && <p className="text-2xs truncate mt-0.5" style={{ color: col.dim }}>{value}</p>}
        </div>
        <Upload size={12} className="flex-shrink-0" style={{ color: col.fgMuted }} />
      </div>

      {value && (
        <button
          className="btn-mini"
          style={{ alignSelf: 'flex-start' }}
          onClick={(e) => { e.stopPropagation(); onChange(undefined) }}
        >
          <X size={10} /> Quitar CV
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const filePath = (file as File & { path?: string }).path
          if (filePath) onChange(filePath)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setInput('')
  }

  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex flex-wrap gap-1 mb-2 min-h-7">
        {values.map((v) => (
          <span
            key={v}
            className="tag"
            style={{ color: col.cream, borderColor: alpha(col.cream, 0.28), background: alpha(col.cream, 0.07) }}
          >
            {v}
            <button
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: col.cream }}
            >
              <X size={9} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          onBlur={add}
          placeholder="Escribí y presioná Enter o +"
        />
        <button onClick={add} className="btn-secondary" style={{ minWidth: 32, padding: '0 0.5rem' }}>
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
    <div className="p-5 flex flex-col gap-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Perfil laboral</h1>
          <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
            Tu perfil define el scoring de todas las ofertas
          </p>
        </div>
        <button className="btn-primary" onClick={save}>
          <Save size={13} /> Guardar
        </button>
      </div>

      {/* Form card */}
      <div className="card flex flex-col gap-4">
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
          <input
            className="input"
            value={form.experience}
            onChange={(e) => set('experience', e.target.value)}
            placeholder="Ej: 2+ años de experiencia en desarrollo frontend"
          />
        </div>

        <TagInput label="Stack principal"       values={form.mainStack}         onChange={(v) => set('mainStack', v)} />
        <TagInput label="Stack secundario"      values={form.secondaryStack}    onChange={(v) => set('secondaryStack', v)} />
        <TagInput label="Modalidad preferida"   values={form.preferredModality} onChange={(v) => set('preferredModality', v)} />
        <TagInput label="Ubicación preferida"   values={form.preferredLocation} onChange={(v) => set('preferredLocation', v)} />
        <TagInput label="Evitar"                values={form.avoid}             onChange={(v) => set('avoid', v)} />

        <div>
          <div className="label">
            CV <span style={{ color: col.fgMuted }}>(opcional)</span>
          </div>
          <CvDropZone value={form.cvPath} onChange={(v) => set('cvPath', v)} />
        </div>
      </div>

      <p className="text-2xs" style={{ color: col.fgMuted }}>
        Última actualización: {new Date(profile.updatedAt).toLocaleString('es-AR')}
      </p>
    </div>
  )
}
