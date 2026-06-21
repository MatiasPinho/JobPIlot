import {
  LayoutDashboard,
  User,
  Briefcase,
  ClipboardList,
  MessageSquare,
  Plug,
  BookOpen,
  Settings
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import type { View } from '../types'

const NAV: { view: View; label: string; icon: React.ElementType }[] = [
  { view: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { view: 'profile',   label: 'Perfil',        icon: User },
  { view: 'offers',    label: 'Ofertas',        icon: Briefcase },
  { view: 'tracker',   label: 'Tracker',        icon: ClipboardList },
  { view: 'answers',   label: 'Respuestas',     icon: MessageSquare },
  { view: 'bridge',        label: 'Conexión Cowork', icon: Plug },
  { view: 'instructions',  label: 'Instrucciones',   icon: BookOpen },
  { view: 'settings',      label: 'Settings',        icon: Settings },
]

export function Sidebar() {
  const activeView    = useStore((s) => s.activeView)
  const setActiveView = useStore((s) => s.setActiveView)
  const metrics       = useStore((s) => s.getDashboardMetrics())

  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{
        width: 220,
        background: col.surface,
        borderRight: `1px solid ${alpha(col.border, 0.22)}`,
      }}
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ borderBottom: `1px solid ${alpha(col.border, 0.2)}` }}
      >
        {/* JobPilot motif — compass rose line-art */}
        <svg
          width="28" height="28" viewBox="0 0 28 28" fill="none"
          stroke={col.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="motif-sway flex-shrink-0"
          aria-hidden
        >
          <circle cx="14" cy="14" r="11" />
          <circle cx="14" cy="14" r="2.5" />
          <line x1="14" y1="3" x2="14" y2="8" />
          <line x1="14" y1="20" x2="14" y2="25" />
          <line x1="3" y1="14" x2="8" y2="14" />
          <line x1="20" y1="14" x2="25" y2="14" />
          <polygon points="14,6 15.2,9 14,8.5 12.8,9" fill={col.cream} stroke="none" />
        </svg>

        <div>
          <div className="font-bold tracking-wide" style={{ color: col.cream, fontSize: '0.8125rem' }}>
            JobPilot
          </div>
          <div className="text-2xs" style={{ color: col.fgMuted }}>
            búsqueda laboral
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
        {NAV.map(({ view, label, icon: Icon }) => {
          const active = activeView === view
          return (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className="nav-item"
              style={active
                ? { background: alpha(col.cream, 0.12), color: col.cream }
                : undefined
              }
            >
              <Icon size={14} strokeWidth={active ? 2.2 : 1.75} />
              <span className="flex-1 text-left">{label}</span>
              {view === 'offers' && metrics.recomendadas > 0 && (
                <span
                  className="badge text-2xs"
                  style={{
                    background: alpha(col.cream, 0.15),
                    color: col.cream,
                    borderColor: alpha(col.cream, 0.3),
                    padding: '0 5px',
                    minWidth: 18,
                    justifyContent: 'center',
                  }}
                >
                  {metrics.recomendadas > 9 ? '9+' : metrics.recomendadas}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Stats footer */}
      <div
        className="px-4 py-3 flex flex-col gap-1.5"
        style={{ borderTop: `1px solid ${alpha(col.border, 0.18)}` }}
      >
        <div className="flex justify-between items-center">
          <span className="text-2xs" style={{ color: col.fgMuted }}>Postuladas</span>
          <span className="text-2xs font-semibold" style={{ color: col.violet }}>{metrics.postuladas}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xs" style={{ color: col.fgMuted }}>Pendientes</span>
          <span className="text-2xs font-semibold" style={{ color: col.amber }}>{metrics.pendientes}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xs" style={{ color: col.fgMuted }}>Score prom.</span>
          <span className="text-2xs font-semibold" style={{ color: col.cream }}>
            {metrics.avgScore > 0 ? `${metrics.avgScore}` : '—'}
          </span>
        </div>
      </div>
    </aside>
  )
}
