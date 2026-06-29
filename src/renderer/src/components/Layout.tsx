import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X, ShieldAlert, ExternalLink, Check, FileText } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useStore } from '../store/useStore'
import { Dashboard } from '../pages/Dashboard'
import { Profile } from '../pages/Profile'
import { Offers } from '../pages/Offers'
import { Tracker } from '../pages/Tracker'
import { CoworkBridge } from '../pages/CoworkBridge'
import { Instructions } from '../pages/Instructions'
import { SettingsPage } from '../pages/Settings'
import { col, alpha } from '../lib/theme'

const PAGES = {
  dashboard: Dashboard,
  profile:   Profile,
  offers:    Offers,
  tracker:   Tracker,
  bridge:       CoworkBridge,
  instructions: Instructions,
  settings:     SettingsPage
} as const

const TOAST_STYLE = {
  success: { text: col.green,  border: alpha(col.green, 0.35),  bg: alpha(col.green, 0.08)  },
  error:   { text: col.red,    border: alpha(col.red, 0.35),    bg: alpha(col.red, 0.08)    },
  info:    { text: col.cream,  border: alpha(col.cream, 0.25),  bg: alpha(col.cream, 0.05)  },
}

const TOAST_ICON = { success: CheckCircle2, error: XCircle, info: Info }

function HelpBanner() {
  const helpRequests       = useStore((s) => s.helpRequests)
  const resolveHelpRequest = useStore((s) => s.resolveHelpRequest)
  const pending = helpRequests.filter((h) => !h.resolved)
  if (pending.length === 0) return null

  return (
    <div className="flex flex-col">
      {pending.map((h) => {
        const isCover = h.type === 'cover_letter'
        const accent  = isCover ? col.violet : col.amber
        const Icon    = isCover ? FileText : ShieldAlert
        return (
          <div
            key={h.id}
            className="flex items-center gap-3 px-5 py-2.5 animate-fade-in"
            style={{ background: alpha(accent, 0.14), borderBottom: `1px solid ${alpha(accent, 0.4)}` }}
          >
            <Icon size={16} className="flex-shrink-0" style={{ color: accent }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: accent }}>
                {isCover
                  ? `Carta de presentación para ${h.company ?? 'una empresa'}`
                  : `Cowork necesita tu ayuda${h.portal ? ` · ${h.portal}` : ''}`}
              </p>
              <p className="text-2xs truncate" style={{ color: col.fg }}>
                {isCover
                  ? `${h.role ?? 'Puesto'} — escribila (pedímela a Claude) y cuando esté, avisale a Cowork que continúe.`
                  : `${h.reason} — resolvelo en el navegador y avisale a Cowork que continúe.`}
              </p>
            </div>
            {h.url && (
              <a
                href={h.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-2xs px-2.5 py-1 rounded-md border flex-shrink-0"
                style={{ borderColor: alpha(accent, 0.4), color: accent }}
              >
                <ExternalLink size={11} /> Ver oferta
              </a>
            )}
            <button
              onClick={() => resolveHelpRequest(h.id)}
              className="flex items-center gap-1 text-2xs px-2.5 py-1 rounded-md border flex-shrink-0"
              style={{ borderColor: alpha(col.green, 0.4), color: col.green, background: alpha(col.green, 0.08) }}
            >
              <Check size={11} /> {isCover ? 'Lista' : 'Resuelto'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function Layout() {
  const activeView = useStore((s) => s.activeView)
  const notification = useStore((s) => s.notification)
  const clearNotification = useStore((s) => s.clearNotification)

  const Page = PAGES[activeView]

  useEffect(() => {
    document.title = `JobPilot — ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`
  }, [activeView])

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: col.base, color: col.fg, fontFamily: 'inherit' }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <HelpBanner />
        <main className="flex-1 overflow-y-auto min-w-0 main-content">
          <Page />
        </main>
      </div>

      {/* Toast notification */}
      {notification && (() => {
        const style = TOAST_STYLE[notification.type]
        const Icon  = TOAST_ICON[notification.type]
        return (
          <div
            className="fixed bottom-5 right-5 z-50 flex items-start gap-3 px-4 py-3 max-w-sm rounded-lg border animate-fade-in"
            style={{ background: style.bg, borderColor: style.border, color: style.text }}
          >
            <Icon size={15} className="mt-px flex-shrink-0" />
            <p className="flex-1 text-xs leading-relaxed" style={{ color: col.fg }}>{notification.message}</p>
            <button onClick={clearNotification} className="opacity-40 hover:opacity-70 transition-opacity">
              <X size={13} />
            </button>
          </div>
        )
      })()}
    </div>
  )
}
