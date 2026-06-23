import { Clock, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react'
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
        <div className="text-xl font-bold mt-0.5 tabular-nums" style={{ color: c }}>{value}</div>
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

function PipelineBar() {
  const metrics = useStore((s) => s.getDashboardMetrics())

  const stages = [
    { label: 'Detectadas',   count: metrics.total,        color: col.fgDim  },
    { label: 'Recomendadas', count: metrics.recomendadas, color: col.cream  },
    { label: 'Aprobadas',    count: metrics.aprobadas,    color: col.green  },
    { label: 'Postuladas',   count: metrics.postuladas,   color: col.violet },
  ]

  return (
    <div className="pipeline-bar reveal-up">
      {stages.map((stage, i) => (
        <div key={stage.label} className="pipeline-stage">
          {i > 0 && (
            <ArrowRight
              size={11}
              className="absolute"
              style={{ left: -7, top: '50%', transform: 'translateY(-50%)', color: col.dim, zIndex: 1 }}
            />
          )}
          <div className="pipeline-num" style={{ color: stage.color }}>
            {stage.count}
          </div>
          <div className="label" style={{ marginBottom: 0 }}>{stage.label}</div>
        </div>
      ))}
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
      <div className="flex items-end justify-between">
        <div>
          <p className="label" style={{ marginBottom: '0.2rem' }}>Resumen</p>
          <h1 className="page-title" style={{ color: col.fg }}>Dashboard</h1>
        </div>
        {metrics.recomendadas > 0 && (
          <button className="btn-primary reveal-up" onClick={() => setActiveView('offers')}>
            Revisar {metrics.recomendadas} recomendadas
          </button>
        )}
      </div>

      {/* Pipeline — the funnel at a glance */}
      <PipelineBar />

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Pendientes"    value={metrics.pendientes}  icon={Clock}       accent={col.amber} />
        <MetricCard label="Errores"       value={metrics.errores}     icon={AlertCircle} accent={col.red}   />
        <MetricCard
          label="Score promedio"
          value={metrics.avgScore > 0 ? `${Math.round(metrics.avgScore)}` : '—'}
          icon={TrendingUp}
          accent={metrics.avgScore > 0 ? scoreColor(metrics.avgScore) : col.fgMuted}
          sub={metrics.bestPortal ? `Mejor: ${metrics.bestPortal}` : undefined}
        />
      </div>

      {/* Quick actions + recent */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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

        <div className="card">
          <div className="section-label">Últimas detectadas</div>
          {recent.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-2xs" style={{ color: col.fgMuted }}>
                No hay ofertas aún. Usá Cowork Bridge para importar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-2.5 py-0.5">
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
