import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { useStore } from './store/useStore'
import { col } from './lib/theme'

function LoadingScreen() {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: col.base }}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          width="32" height="32" viewBox="0 0 28 28" fill="none"
          stroke={col.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="animate-scan"
        >
          <circle cx="14" cy="14" r="11" />
          <circle cx="14" cy="14" r="2.5" />
          <line x1="14" y1="3" x2="14" y2="8" />
          <line x1="14" y1="20" x2="14" y2="25" />
          <line x1="3" y1="14" x2="8" y2="14" />
          <line x1="20" y1="14" x2="25" y2="14" />
        </svg>
        <p className="text-2xs" style={{ color: col.fgMuted }}>Cargando JobPilot...</p>
      </div>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const loadFromStorage    = useStore((s) => s.loadFromStorage)
  const reloadOffers       = useStore((s) => s.reloadOffers)
  const reloadHelpRequests = useStore((s) => s.reloadHelpRequests)

  useEffect(() => {
    loadFromStorage().then(() => setReady(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Recargar datos cuando el MCP server escribe los archivos
  useEffect(() => {
    window.api.onDataChanged((file) => {
      if (file === 'offers.json') reloadOffers()
      if (file === 'help_requests.json') reloadHelpRequests()
    })
    return () => window.api.offDataChanged()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <LoadingScreen />

  return <Layout />
}
