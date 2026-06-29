import { useState, useRef, useCallback, useEffect } from 'react'
import {
  CheckCheck, Upload, Loader2, FileText, Plus, Copy, Power, PowerOff,
  CheckCircle2, ArrowRight, X
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'

// ─── Server Panel ─────────────────────────────────────────────────────────────

type ProcState = 'stopped' | 'starting' | 'running' | 'stopping'

const MAX_LOG_LINES = 4

function ServerPanel() {
  const [mcpState, setMcpState]     = useState<ProcState>('stopped')
  const [tunState, setTunState]     = useState<ProcState>('stopped')
  const [url,      setUrl]          = useState<string | null>(null)
  const [copied,   setCopied]       = useState(false)
  const [mcpLogs,  setMcpLogs]      = useState<string[]>([])
  const [tunLogs,  setTunLogs]      = useState<string[]>([])
  const [showLog,  setShowLog]      = useState<'mcp' | 'tunnel' | null>(null)
  const pollFastUntil   = useRef(0)
  const mcpStartTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tunStartTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pushLog = (setter: React.Dispatch<React.SetStateAction<string[]>>, line: string) =>
    setter((prev) => [...prev.slice(-(MAX_LOG_LINES - 1)), line])

  // Live log listeners
  useEffect(() => {
    const mcpCb = (line: string) => pushLog(setMcpLogs, line)
    const tunCb = (line: string) => pushLog(setTunLogs, line)
    window.api.onMcpLog(mcpCb)
    window.api.onTunnelLog(tunCb)
    return () => { window.api.offMcpLog(mcpCb); window.api.offTunnelLog(tunCb) }
  }, [])

  // Status polling — fast after a click, normal otherwise
  useEffect(() => {
    let active = true
    const poll = async () => {
      if (!active) return
      try {
        const s = await window.api.serverStatus()
        if (!active) return
        setMcpState((prev) => {
          if (s.mcpRunning) {
            if (mcpStartTimeout.current) { clearTimeout(mcpStartTimeout.current); mcpStartTimeout.current = null }
            return 'running'
          }
          if (prev === 'stopping') return 'stopped'
          if (prev === 'starting') return 'starting'
          return 'stopped'
        })
        setTunState((prev) => {
          if (s.tunnelRunning) {
            if (tunStartTimeout.current) { clearTimeout(tunStartTimeout.current); tunStartTimeout.current = null }
            return 'running'
          }
          if (prev === 'stopping') return 'stopped'
          if (prev === 'starting') return 'starting'
          return 'stopped'
        })
        setUrl(s.tunnelUrl)
      } catch { /* ignore */ }
    }

    poll()
    const tick = () => {
      const fast = Date.now() < pollFastUntil.current
      return setTimeout(async () => { await poll(); id = setTimeout(tick, fast ? 600 : 2000) }, 0)
    }
    let id = setTimeout(tick, 600)
    return () => { active = false; clearTimeout(id) }
  }, [])

  const startFastPoll = () => { pollFastUntil.current = Date.now() + 20_000 }

  const toggleMcp = async () => {
    if (mcpState === 'running') {
      setMcpState('stopping')
      await window.api.serverMcpStop()
      setMcpState('stopped')
      setMcpLogs([])
    } else if (mcpState === 'stopped') {
      setMcpState('starting')
      setMcpLogs([])
      startFastPoll()
      await window.api.serverMcpStart()
      // fallback: if not confirmed running in 20s, reset to stopped
      mcpStartTimeout.current = setTimeout(() => setMcpState((s) => s === 'starting' ? 'stopped' : s), 20_000)
    }
  }

  const toggleTunnel = async () => {
    if (tunState === 'running') {
      setTunState('stopping')
      await window.api.serverTunnelStop()
      setTunState('stopped')
      setTunLogs([])
      setUrl(null)
    } else if (tunState === 'stopped') {
      setTunState('starting')
      setTunLogs([])
      startFastPoll()
      await window.api.serverTunnelStart()
      // tunnel can take ~10s to get URL, allow 30s
      tunStartTimeout.current = setTimeout(() => setTunState((s) => s === 'starting' ? 'stopped' : s), 30_000)
    }
  }

  const copyUrl = async () => {
    if (!url) return
    await navigator.clipboard.writeText(`${url}/mcp`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stateColor = (s: ProcState) =>
    s === 'running'  ? col.green :
    s === 'starting' || s === 'stopping' ? col.amber :
    alpha(col.fgMuted, 0.4)

  const stateLabel = (s: ProcState, running: string) =>
    s === 'running'  ? running :
    s === 'starting' ? 'Iniciando…' :
    s === 'stopping' ? 'Deteniendo…' :
    'Detenido'

  function Dot({ state }: { state: ProcState }) {
    const c = stateColor(state)
    const pulse = state === 'starting' || state === 'stopping'
    return (
      <span
        className={`inline-block rounded-full flex-shrink-0${pulse ? ' animate-pulse' : ''}`}
        style={{ width: 7, height: 7, background: c, boxShadow: state === 'running' ? `0 0 5px ${c}` : 'none' }}
      />
    )
  }

  function ToggleBtn({ state, onToggle }: { state: ProcState; onToggle: () => void }) {
    const busy = state === 'starting' || state === 'stopping'
    const isOn = state === 'running'
    return (
      <button
        onClick={onToggle}
        disabled={busy}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs border transition-all flex-shrink-0"
        style={{
          background: isOn ? alpha(col.red, 0.08) : alpha(col.green, 0.08),
          borderColor: isOn ? alpha(col.red, 0.3) : alpha(col.green, 0.3),
          color: isOn ? col.red : col.green,
          opacity: busy ? 0.6 : 1,
          cursor: busy ? 'not-allowed' : 'pointer',
        }}
      >
        {busy ? <Loader2 size={11} className="animate-spin" /> : isOn ? <PowerOff size={11} /> : <Power size={11} />}
        {isOn ? 'Detener' : busy ? '…' : 'Iniciar'}
      </button>
    )
  }

  function LogArea({ lines, label }: { lines: string[]; label: string }) {
    if (lines.length === 0) return null
    return (
      <div
        className="rounded-md p-2.5 flex flex-col gap-0.5"
        style={{ background: alpha(col.base, 0.7), border: `1px solid ${alpha(col.border, 0.15)}` }}
      >
        <p className="text-2xs font-semibold mb-1" style={{ color: col.fgMuted }}>{label}</p>
        {lines.map((l, i) => (
          <p key={i} className="text-2xs font-mono leading-snug truncate" style={{ color: col.fgDim }}>{l}</p>
        ))}
      </div>
    )
  }

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3"
      style={{ background: alpha(col.surface, 0.8), border: `1px solid ${alpha(col.border, 0.25)}` }}
    >
      <p className="text-xs font-semibold" style={{ color: col.cream }}>Servidor MCP</p>

      <div className="flex flex-col gap-2">
        {/* MCP row */}
        <div className="flex items-center gap-3">
          <Dot state={mcpState} />
          <span className="text-2xs flex-1" style={{ color: col.fg }}>MCP HTTP</span>
          <span
            className="text-2xs cursor-pointer select-none"
            style={{ color: stateColor(mcpState) }}
            onClick={() => setShowLog((v) => v === 'mcp' ? null : 'mcp')}
            title="Ver log"
          >
            {stateLabel(mcpState, 'Corriendo :3005')}
            {mcpLogs.length > 0 && ' ▾'}
          </span>
          <ToggleBtn state={mcpState} onToggle={toggleMcp} />
        </div>

        {showLog === 'mcp' && <LogArea lines={mcpLogs} label="Últimas líneas MCP" />}

        {/* Tunnel row */}
        <div className="flex items-center gap-3">
          <Dot state={tunState} />
          <span className="text-2xs flex-1" style={{ color: col.fg }}>Cloudflare Tunnel</span>
          <span
            className="text-2xs truncate max-w-[180px] cursor-pointer select-none"
            style={{ color: stateColor(tunState) }}
            onClick={() => setShowLog((v) => v === 'tunnel' ? null : 'tunnel')}
            title="Ver log"
          >
            {tunState === 'running'
              ? (url ? url.replace('https://', '') : 'conectando…')
              : stateLabel(tunState, '')}
            {tunLogs.length > 0 && ' ▾'}
          </span>
          <ToggleBtn state={tunState} onToggle={toggleTunnel} />
        </div>

        {showLog === 'tunnel' && <LogArea lines={tunLogs} label="Últimas líneas Tunnel" />}
      </div>

      {/* URL bar */}
      {url && (
        <div
          className="flex items-center gap-2 rounded-md px-3 py-2"
          style={{ background: alpha(col.raised, 0.6), border: `1px solid ${alpha(col.border, 0.2)}` }}
        >
          <span className="text-2xs flex-1 truncate font-mono" style={{ color: col.fgDim }}>{url}/mcp</span>
          <button
            onClick={copyUrl}
            className="flex items-center gap-1 text-2xs px-2 py-0.5 rounded border transition-all flex-shrink-0"
            style={{
              background: copied ? alpha(col.green, 0.1) : 'transparent',
              borderColor: copied ? alpha(col.green, 0.3) : alpha(col.border, 0.3),
              color: copied ? col.green : col.fgMuted,
            }}
          >
            {copied ? <CheckCheck size={10} /> : <Copy size={10} />}
            {copied ? 'Copiada' : 'Copiar URL'}
          </button>
        </div>
      )}
    </div>
  )
}

function PdfImporter({ onImport }: { onImport: (text: string, filename: string) => void }) {
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [preview, setPreview]     = useState<{ text: string; filename: string } | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  const processResult = useCallback((res: { success: boolean; text?: string; filename?: string; error?: string }) => {
    if (res.success && res.text) {
      setPreview({ text: res.text, filename: res.filename ?? 'archivo.pdf' })
      setError(null)
    } else {
      setError(res.error ?? 'Error desconocido')
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file || !file.name.endsWith('.pdf')) { setError('Solo se aceptan archivos PDF'); return }
    setLoading(true)
    setError(null)
    // Electron exposes file.path on dropped files
    const filePath = (file as File & { path?: string }).path
    const res = filePath
      ? await window.api.readPdfFromPath(filePath)
      : { success: false, error: 'No se pudo obtener la ruta del archivo' }
    setLoading(false)
    processResult(res)
  }, [processResult])

  const handlePickFile = async () => {
    setLoading(true)
    setError(null)
    const res = await window.api.selectPdf()
    setLoading(false)
    processResult(res)
  }

  const handleAdd = () => {
    if (!preview) return
    onImport(preview.text, preview.filename)
    setPreview(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="section-label">Importar oferta desde PDF</div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !preview && !loading && inputRef.current?.click()}
        className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
        style={{
          minHeight: 90,
          borderColor: dragging ? col.cream : alpha(col.border, 0.35),
          background: dragging ? alpha(col.cream, 0.04) : alpha(col.surface, 0.5),
          padding: '1rem',
        }}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" style={{ color: col.fgMuted }} />
        ) : preview ? (
          <div className="flex flex-col gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <FileText size={13} style={{ color: col.green }} />
              <span className="text-xs font-semibold truncate" style={{ color: col.fg }}>{preview.filename}</span>
              <span className="text-2xs ml-auto" style={{ color: col.fgMuted }}>{preview.text.length.toLocaleString()} chars</span>
            </div>
            <p
              className="text-2xs leading-relaxed rounded px-2 py-1.5 max-h-20 overflow-y-auto"
              style={{ color: col.fgMuted, background: alpha(col.raised, 0.6) }}
            >
              {preview.text.slice(0, 300).trim()}…
            </p>
            <div className="flex gap-2 mt-1">
              <button className="btn-primary" style={{ fontSize: 'var(--text-2xs)', minHeight: 26, padding: '0 0.6rem' }} onClick={handleAdd}>
                <Plus size={11} /> Agregar como oferta
              </button>
              <button className="btn-secondary" style={{ fontSize: 'var(--text-2xs)', minHeight: 26, padding: '0 0.6rem' }} onClick={() => setPreview(null)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <FileText size={20} style={{ color: col.fgMuted }} />
            <p className="text-2xs text-center" style={{ color: col.fgMuted }}>
              Arrastrá un PDF acá o hacé click para abrirlo
            </p>
          </>
        )}
      </div>

      {error && <p className="text-2xs" style={{ color: col.red }}>{error}</p>}

      <button
        className="btn-secondary"
        style={{ alignSelf: 'flex-start', fontSize: 'var(--text-2xs)', minHeight: 26 }}
        onClick={handlePickFile}
        disabled={loading}
      >
        <Upload size={12} /> Abrir PDF…
      </button>

      {/* hidden file input fallback */}
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setLoading(true)
        const filePath = (file as File & { path?: string }).path
        const res = filePath
          ? await window.api.readPdfFromPath(filePath)
          : { success: false, error: 'No se pudo obtener la ruta' }
        setLoading(false)
        processResult(res)
        e.target.value = ''
      }} />
    </div>
  )
}

function PasteImporter({ onImport }: { onImport: (title: string, company: string, link: string, text: string) => void }) {
  const [open, setOpen]       = useState(false)
  const [title, setTitle]     = useState('')
  const [company, setCompany] = useState('')
  const [link, setLink]       = useState('')
  const [text, setText]       = useState('')

  const canAdd = text.trim().length > 20

  const handleAdd = () => {
    onImport(
      title.trim() || 'Oferta pegada manualmente',
      company.trim() || '—',
      link.trim(),
      text.trim()
    )
    setTitle(''); setCompany(''); setLink(''); setText(''); setOpen(false)
  }

  if (!open) {
    return (
      <button
        className="btn-secondary"
        style={{ alignSelf: 'flex-start', fontSize: 'var(--text-2xs)', minHeight: 28 }}
        onClick={() => setOpen(true)}
      >
        <Plus size={12} /> Pegar oferta manualmente
      </button>
    )
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-lg p-4"
      style={{ background: alpha(col.surface, 0.7), border: `1px solid ${alpha(col.border, 0.28)}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: col.fg }}>Pegar oferta</span>
        <button onClick={() => setOpen(false)} style={{ color: col.fgMuted }}><X size={13} /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="label">Título <span style={{ color: col.fgMuted }}>(opcional)</span></div>
          <input className="input" placeholder="Frontend Developer" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <div className="label">Empresa <span style={{ color: col.fgMuted }}>(opcional)</span></div>
          <input className="input" placeholder="Empresa S.A." value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
      </div>

      <div>
        <div className="label">Link <span style={{ color: col.fgMuted }}>(opcional)</span></div>
        <input className="input" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
      </div>

      <div>
        <div className="label">Descripción de la oferta <span style={{ color: col.red }}>*</span></div>
        <textarea
          className="input"
          rows={6}
          placeholder="Pegá acá el texto completo de la oferta — descripción, requisitos, modalidad, etc."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ resize: 'vertical', minHeight: 100 }}
        />
      </div>

      <div className="flex gap-2">
        <button className="btn-primary" disabled={!canAdd} onClick={handleAdd}
          style={{ fontSize: 'var(--text-2xs)', minHeight: 28, padding: '0 0.75rem' }}>
          <Plus size={11} /> Agregar oferta
        </button>
        <button className="btn-secondary" onClick={() => setOpen(false)}
          style={{ fontSize: 'var(--text-2xs)', minHeight: 28, padding: '0 0.75rem' }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, onClick }: {
  label: string; value: number; color: string; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-all"
      style={{
        background: alpha(col.surface, 0.7), border: `1px solid ${alpha(color, 0.25)}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <span className="font-bold" style={{ color, fontSize: '1.1rem', lineHeight: 1 }}>{value}</span>
      <span className="text-2xs" style={{ color: col.fgMuted }}>{label}</span>
    </button>
  )
}

export function CoworkBridge() {
  const offers           = useStore((s) => s.offers)
  const importOffers     = useStore((s) => s.importOffers)
  const showNotification = useStore((s) => s.showNotification)
  const setActiveView    = useStore((s) => s.setActiveView)

  const detectadas   = offers.filter((o) => o.status === 'detectada').length
  const recommended  = offers.filter((o) => o.status === 'recomendada')
  const approved     = offers.filter((o) => o.status === 'aprobada').length
  const postuladas   = offers.filter((o) => o.status === 'postulada').length

  const handlePdfImport = (text: string, filename: string) => {
    const titleLine = text.split('\n').map((l) => l.trim()).find((l) => l.length > 5 && l.length < 120)
    importOffers([{
      title: titleLine ?? filename.replace('.pdf', ''),
      company: '—',
      portal: 'PDF',
      link: '',
      description: text.slice(0, 8000),
    }])
    showNotification('success', `"${filename}" agregada como oferta`)
  }

  const handlePasteImport = (title: string, company: string, link: string, text: string) => {
    importOffers([{ title, company, portal: 'Manual', link, description: text }])
    showNotification('success', `"${title}" agregada como oferta`)
  }

  const handleBulkApprove = () => {
    const n = recommended.length
    useStore.getState().bulkApproveRecommended()
    showNotification('success', `${n} oferta(s) aprobada(s)`)
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Conexión Cowork</h1>
        <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
          Levantá los servidores para que Cowork pueda leer y escribir en JobPilot vía MCP.
        </p>
      </div>

      {/* Server control */}
      <ServerPanel />

      {/* Resumen de ofertas */}
      <div className="flex flex-col gap-2">
        <div className="section-label">Ofertas en el tracker</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Detectadas"   value={detectadas}         color={col.fgDim}  onClick={() => setActiveView('offers')} />
          <StatCard label="Recomendadas" value={recommended.length} color={col.green}  onClick={() => setActiveView('offers')} />
          <StatCard label="Aprobadas"    value={approved}           color={col.cream}  onClick={() => setActiveView('offers')} />
          <StatCard label="Postuladas"   value={postuladas}         color={col.violet} onClick={() => setActiveView('tracker')} />
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          <button
            className="btn-primary"
            disabled={recommended.length === 0}
            onClick={handleBulkApprove}
            style={{ opacity: recommended.length === 0 ? 0.4 : 1 }}
          >
            <CheckCheck size={13} /> Aprobar {recommended.length} recomendadas
          </button>
          <button className="btn-secondary" onClick={() => setActiveView('offers')}>
            Revisar ofertas <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Cómo funciona */}
      <div
        className="rounded-lg px-4 py-3"
        style={{ background: alpha(col.surface, 0.6), border: `1px solid ${alpha(col.border, 0.15)}` }}
      >
        <div className="section-label">Cómo se usa con Cowork</div>
        <ol className="flex flex-col gap-1">
          {[
            'Iniciá los servidores (arriba) y pegá la URL en el conector de Cowork.',
            'En Cowork, pegá el mensaje de búsqueda (lo tenés en Instrucciones).',
            'Cowork busca y guarda las ofertas acá automáticamente — aparecen como detectadas/recomendadas.',
            'Revisá en Ofertas y aprobá las que te interesan (o usá "Aprobar recomendadas").',
            'Pegá el mensaje de postulación en Cowork → postula solo a las aprobadas.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-1.5 text-2xs" style={{ color: col.fgMuted }}>
              <span className="font-semibold" style={{ color: col.cream }}>{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Cargar ofertas a mano */}
      <div className="flex flex-col gap-2">
        <div className="section-label">Cargar una oferta a mano</div>
        <p className="text-2xs" style={{ color: col.fgMuted }}>
          Si encontraste una oferta por tu cuenta, importala acá y entra al mismo scoring.
        </p>
        <PdfImporter onImport={handlePdfImport} />
        <PasteImporter onImport={handlePasteImport} />
      </div>
    </div>
  )
}
