import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useStore } from '../store/useStore'
import { Dashboard } from '../pages/Dashboard'
import { Profile } from '../pages/Profile'
import { Offers } from '../pages/Offers'
import { Tracker } from '../pages/Tracker'
import { Answers } from '../pages/Answers'
import { CoworkBridge } from '../pages/CoworkBridge'
import { Instructions } from '../pages/Instructions'
import { SettingsPage } from '../pages/Settings'
import { col, alpha } from '../lib/theme'

const PAGES = {
  dashboard: Dashboard,
  profile:   Profile,
  offers:    Offers,
  tracker:   Tracker,
  answers:   Answers,
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

      <main className="flex-1 overflow-y-auto min-w-0">
        <Page />
      </main>

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
