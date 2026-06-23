import { useState } from 'react'
import { FolderOpen, Save, RefreshCw, Download, Upload } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import { MOCK_OFFERS, MOCK_ANSWERS, MOCK_PROFILE } from '../lib/mockData'
import type { AppSettings } from '../types'

export function SettingsPage() {
  const settings         = useStore((s) => s.settings)
  const setSettings      = useStore((s) => s.setSettings)
  const setOffers        = useStore((s) => s.setOffers)
  const setAnswers       = useStore((s) => s.setAnswers)
  const setProfile       = useStore((s) => s.setProfile)
  const showNotification = useStore((s) => s.showNotification)

  const [form, setForm] = useState<AppSettings>({ ...settings })

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const save = async () => {
    await setSettings(form)
    showNotification('success', 'Configuración guardada')
  }

  const browseFolder = async () => {
    const folder = await window.api.selectFolder()
    if (folder) set('workFolder', folder)
  }

  const loadMockData = async () => {
    await setProfile({ ...MOCK_PROFILE, updatedAt: new Date().toISOString() })
    await setOffers(MOCK_OFFERS)
    await setAnswers(MOCK_ANSWERS)
    showNotification('success', 'Datos de prueba cargados — 8 ofertas, 6 respuestas')
  }

  const clearAllData = async () => {
    if (!confirm('¿Seguro que querés borrar todas las ofertas y respuestas? El perfil se mantiene.')) return
    await setOffers([])
    await setAnswers([])
    showNotification('info', 'Datos borrados')
  }

  const exportData = async () => {
    const res = await window.api.exportData()
    if (res.ok) showNotification('success', 'Backup exportado')
  }

  const importData = async () => {
    if (!confirm('Importar reemplaza tus datos actuales con los del archivo. ¿Continuar?')) return
    const res = await window.api.importData()
    if (res.ok) { await useStore.getState().loadFromStorage(); showNotification('success', 'Datos importados') }
    else if (res.error) showNotification('error', res.error)
  }

  return (
    <div className="p-5 flex flex-col gap-5 max-w-xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Configuración</h1>
          <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>JobPilot v0.1.0</p>
        </div>
        <button className="btn-primary" onClick={save}>
          <Save size={13} /> Guardar
        </button>
      </div>

      {/* Cowork Bridge */}
      <div className="card flex flex-col gap-4">
        <div className="section-label">Cowork Bridge</div>

        <div>
          <div className="label">Carpeta de trabajo</div>
          <p className="text-2xs mb-2" style={{ color: col.fgMuted }}>
            Donde JobPilot genera los archivos para Cowork. Por defecto: ~/Documents/JobPilot/cowork
          </p>
          <div className="flex gap-1.5">
            <input
              className="input"
              value={form.workFolder}
              onChange={(e) => set('workFolder', e.target.value)}
              placeholder="Ruta a la carpeta de trabajo..."
            />
            <button className="btn-secondary" style={{ padding: '0 0.625rem', flexShrink: 0 }} onClick={browseFolder}>
              <FolderOpen size={14} />
            </button>
          </div>
        </div>

        <div>
          <div className="label">Portales de búsqueda</div>
          <p className="text-2xs mb-2" style={{ color: col.fgMuted }}>
            Lista separada por comas que se incluye en la tarea para Cowork.
          </p>
          <input
            className="input"
            value={form.portals.join(', ')}
            onChange={(e) => set('portals', e.target.value.split(',').map((p) => p.trim()).filter(Boolean))}
            placeholder="LinkedIn, Bumeran, Zonajobs, GetOnBoard, Computrabajo"
          />
        </div>
      </div>

      {/* Scoring thresholds */}
      <div className="card flex flex-col gap-4">
        <div className="section-label">Umbrales de scoring</div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="label">
              Recomendada ≥{' '}
              <span style={{ color: col.cream }}>{form.scoreThresholdRecommended}</span>
            </div>
            <input
              type="range" min="50" max="90" step="5"
              className="w-full mt-1"
              style={{ accentColor: col.cream }}
              value={form.scoreThresholdRecommended}
              onChange={(e) => set('scoreThresholdRecommended', Number(e.target.value))}
            />
            <div className="flex justify-between text-2xs mt-0.5" style={{ color: col.fgMuted }}>
              <span>50</span><span>90</span>
            </div>
          </div>
          <div>
            <div className="label">
              Rechazar &lt;{' '}
              <span style={{ color: col.red }}>{form.scoreThresholdReject}</span>
            </div>
            <input
              type="range" min="10" max="50" step="5"
              className="w-full mt-1"
              style={{ accentColor: col.red }}
              value={form.scoreThresholdReject}
              onChange={(e) => set('scoreThresholdReject', Number(e.target.value))}
            />
            <div className="flex justify-between text-2xs mt-0.5" style={{ color: col.fgMuted }}>
              <span>10</span><span>50</span>
            </div>
          </div>
        </div>

        <p className="text-2xs" style={{ color: col.fgMuted }}>
          Score ≥ {form.scoreThresholdRecommended} → Recomendada &nbsp;·&nbsp;
          {form.scoreThresholdReject}–{form.scoreThresholdRecommended - 1} → Detectada &nbsp;·&nbsp;
          &lt; {form.scoreThresholdReject} → Rechazada
        </p>
      </div>

      {/* Data */}
      <div className="card flex flex-col gap-3">
        <div className="section-label">Datos</div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary" onClick={loadMockData}>
            <RefreshCw size={12} /> Cargar datos de prueba
          </button>
          <button className="btn-danger" onClick={clearAllData}>
            Borrar ofertas y respuestas
          </button>
        </div>
        <p className="text-2xs" style={{ color: col.fgMuted }}>
          Los datos se guardan en: ~/Documents/JobPilot/data/
        </p>
      </div>

      {/* Backup portátil */}
      <div className="card flex flex-col gap-3">
        <div className="section-label">Backup portátil</div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary" onClick={exportData}>
            <Download size={12} /> Exportar todo a un JSON
          </button>
          <button className="btn-secondary" onClick={importData}>
            <Upload size={12} /> Importar desde JSON
          </button>
        </div>
        <p className="text-2xs" style={{ color: col.fgMuted }}>
          Exportá perfil, ofertas, respuestas, settings y prompts en un archivo. Importalo en otra PC para tener todo.
        </p>
      </div>
    </div>
  )
}
