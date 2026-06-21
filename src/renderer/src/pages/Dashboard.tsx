import { Briefcase, CheckCircle2, Star, Send, Clock, AlertCircle, Copy, TrendingUp } from 'lucide-react'
import { useStore } from '../store/useStore'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { col, alpha, scoreColor } from '../lib/theme'

interface MetricCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  accent?: string
  sub?: string
}

function MetricCard({ label, value, icon: Icon, accent, sub }: MetricCardProps) {
  const c = accent ?? col.fgDim
  return (
    <div className="card flex items-start justify-between gap-2 reveal-up">
      <div className="min-w-0">
        <div className="label">{label}</div>
        <div className="text-xl font-bold mt-0.5" style={{ color: c }}>{value}</div>
        {sub && <div className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>{sub}</div>}
      </div>
      <div
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md"
        style={{ background: alpha(c, 0.1) }}
      >
        <Icon size={15} style={{ color: c }} strokeWidth={1.75} />
      </div>
    </div>
  )
}

export function Dashboard() {
  const metrics      = useStore((s) => s.getDashboardMetrics())
  const offers       = useStore((s) => s.offers)
  const setActiveView = useStore((s) => s.setActiveView)

  const recent = [...offers]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .slice(0, 6)

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Dashboard</h1>
        <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>Resumen de tu búsqueda laboral</p>
      </div>

      {/* Metrics row 1 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard label="Total ofertas"  value={metrics.total}        icon={Briefcase}   />
        <MetricCard label="Recomendadas"   value={metrics.recomendadas} icon={Star}         accent={col.cream} />
        <MetricCard label="Aprobadas"      value={metrics.aprobadas}    icon={CheckCircle2} accent={col.green} />
        <MetricCard label="Postuladas"     value={metrics.postuladas}   icon={Send}         accent={col.violet} />
      </div>

      {/* Metrics row 2 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard label="Pendientes"     value={metrics.pendientes}   icon={Clock}        accent={col.amber} />
        <MetricCard label="Errores"        value={metrics.errores}      icon={AlertCircle}  accent={col.red} />
        <MetricCard label="Duplicadas"     value={metrics.duplicadas}   icon={Copy}         accent={col.fgMuted} />
        <MetricCard
          label="Score promedio"
          value={metrics.avgScore > 0 ? `${Math.round(metrics.avgScore)}` : '—'}
          icon={TrendingUp}
          accent={metrics.avgScore > 0 ? scoreColor(metrics.avgScore) : col.fgMuted}
          sub={metrics.bestPortal ? `Mejor: ${metrics.bestPortal}` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="card">
          <div className="section-label">Acciones rápidas</div>
          <div className="flex flex-col gap-2">
            <button className="btn-primary" onClick={() => setActiveView('offers')}>
              Ver ofertas recomendadas
              {metrics.recomendadas > 0 && (
                <span
                  className="ml-auto text-2xs font-bold rounded px-1.5 py-0.5"
                  style={{ background: alpha(col.base, 0.3), color: col.base }}
                >
                  {metrics.recomendadas}
                </span>
              )}
            </button>
            <button className="btn-secondary" onClick={() => setActiveView('bridge')}>
              Ir a Cowork Bridge
            </button>
            <button className="btn-secondary" onClick={() => setActiveView('tracker')}>
              Ver tracker de postulaciones
            </button>
          </div>
        </div>

        {/* Recent offers */}
        <div className="card">
          <div className="section-label">Últimas detectadas</div>
          {recent.length === 0 ? (
            <p className="text-2xs text-center py-4" style={{ color: col.fgMuted }}>
              No hay ofertas aún. Usá Cowork Bridge para importar.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-2.5 py-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate font-medium" style={{ color: col.fg }}>{o.title}</div>
                    <div className="text-2xs truncate" style={{ color: col.fgMuted }}>
                      {o.company} · {o.portal}
                    </div>
                  </div>
                  <ScoreBar score={o.score} size="sm" />
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
