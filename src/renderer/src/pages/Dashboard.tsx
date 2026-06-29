import {
  AlertCircle,
  ArrowRight,
  Ban,
  Briefcase,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Globe2,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { col, alpha, scoreColor, statusCol } from '../lib/theme'
import type { DashboardMetrics, JobOffer, JobStatus } from '../types'

interface MetricCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  accent?: string
  sub?: string
}

function pct(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

function formatDate(value?: string): string {
  if (!value) return 'Sin datos'
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return 'Sin datos'
  return new Date(value).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

function sortByDateDesc(a?: string, b?: string): number {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime()
}

function MetricCard({ label, value, icon: Icon, accent, sub }: MetricCardProps) {
  const c = accent ?? col.fgDim
  return (
    <div className="card flex items-start justify-between gap-2 reveal-up">
      <div className="min-w-0">
        <div className="label">{label}</div>
        <div className="text-xl font-bold mt-0.5 tabular-nums" style={{ color: c }}>{value}</div>
        {sub && <div className="text-2xs mt-0.5 truncate" style={{ color: col.fgMuted }}>{sub}</div>}
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

function SmallStat({ label, value, accent = col.fg, sub }: {
  label: string
  value: number | string
  accent?: string
  sub?: string
}) {
  return (
    <div
      className="rounded-md border px-3 py-2 min-w-0"
      style={{ borderColor: alpha(col.border, 0.18), background: alpha(col.raised, 0.22) }}
    >
      <div className="label" style={{ marginBottom: 2 }}>{label}</div>
      <div className="text-sm font-bold tabular-nums truncate" style={{ color: accent }}>{value}</div>
      {sub && <div className="text-2xs truncate mt-0.5" style={{ color: col.fgMuted }}>{sub}</div>}
    </div>
  )
}

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-1.5">
      {Icon && <Icon size={12} style={{ color: col.fgMuted }} />}
      <div className="section-label" style={{ marginBottom: 0 }}>{children}</div>
    </div>
  )
}

function PipelineBar({ metrics }: { metrics: DashboardMetrics }) {
  const stages = [
    { label: 'Total',         count: metrics.total,        color: col.fgDim  },
    { label: 'Recomendadas',  count: metrics.recomendadas, color: col.cream  },
    { label: 'Aprobadas',     count: metrics.aprobadas,    color: col.green  },
    { label: 'Postuladas',    count: metrics.postuladas,   color: col.violet },
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

function WorkQueue({ approved, pendingManual, pendingTest, errors }: {
  approved: number
  pendingManual: number
  pendingTest: number
  errors: number
}) {
  return (
    <div className="card flex flex-col gap-3">
      <SectionTitle icon={Target}>Cola operativa</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <SmallStat label="Listas para postular" value={approved} accent={col.green} />
        <SmallStat label="Pendiente manual" value={pendingManual} accent={col.amber} />
        <SmallStat label="Pendiente test" value={pendingTest} accent={col.terracotta} />
        <SmallStat label="Con error" value={errors} accent={col.red} />
      </div>
    </div>
  )
}

function QualityPanel({ total, high, mid, low, avgScore }: {
  total: number
  high: number
  mid: number
  low: number
  avgScore: number
}) {
  const parts = [
    { label: 'Alta', count: high, color: col.green },
    { label: 'Media', count: mid, color: col.cream },
    { label: 'Baja', count: low, color: col.red },
  ]
  return (
    <div className="card flex flex-col gap-3">
      <SectionTitle icon={TrendingUp}>Calidad del pipeline</SectionTitle>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="label">Score promedio</div>
          <div className="text-xl font-bold tabular-nums" style={{ color: avgScore > 0 ? scoreColor(avgScore) : col.fgMuted }}>
            {avgScore > 0 ? avgScore : '-'}
          </div>
        </div>
        <div className="text-right">
          <div className="label">Ofertas con score</div>
          <div className="text-sm font-bold tabular-nums" style={{ color: col.fg }}>{total}</div>
        </div>
      </div>
      <div className="flex overflow-hidden rounded-full" style={{ height: 6, background: alpha(col.border, 0.22) }}>
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${pct(p.count, total)}%`, background: p.color }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {parts.map((p) => (
          <SmallStat key={p.label} label={p.label} value={p.count} accent={p.color} sub={`${pct(p.count, total)}%`} />
        ))}
      </div>
    </div>
  )
}

function StatusDistribution({ counts, total }: { counts: Record<JobStatus, number>; total: number }) {
  const rows: { status: JobStatus; label: string }[] = [
    { status: 'detectada', label: 'Detectadas' },
    { status: 'recomendada', label: 'Recomendadas' },
    { status: 'aprobada', label: 'Aprobadas' },
    { status: 'postulada', label: 'Postuladas' },
    { status: 'rechazada', label: 'Rechazadas' },
    { status: 'duplicada', label: 'Duplicadas' },
    { status: 'pendiente_manual', label: 'Pend. manual' },
    { status: 'pendiente_test', label: 'Pend. test' },
    { status: 'error', label: 'Errores' },
  ]

  return (
    <div className="card flex flex-col gap-3">
      <SectionTitle icon={Database}>Distribucion por estado</SectionTitle>
      <div className="flex flex-col gap-2">
        {rows.map(({ status, label }) => {
          const count = counts[status] ?? 0
          const c = statusCol[status] ?? statusCol.detectada
          return (
            <div key={status} className="grid grid-cols-[92px_1fr_38px] items-center gap-2">
              <span className="text-2xs truncate" style={{ color: c.text }}>{label}</span>
              <div className="rounded-full overflow-hidden" style={{ height: 5, background: alpha(col.border, 0.18) }}>
                <div style={{ width: `${pct(count, total)}%`, height: '100%', background: c.text, opacity: 0.85 }} />
              </div>
              <span className="text-2xs font-bold text-right tabular-nums" style={{ color: col.fg }}>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PortalPanel({ offers }: { offers: JobOffer[] }) {
  const rows = Object.entries(
    offers.reduce((acc, offer) => {
      const key = offer.portal || 'Sin portal'
      const item = acc[key] ?? { total: 0, applied: 0, avg: 0, scoreSum: 0 }
      item.total += 1
      item.scoreSum += offer.score || 0
      if (offer.status === 'postulada') item.applied += 1
      item.avg = Math.round(item.scoreSum / item.total)
      acc[key] = item
      return acc
    }, {} as Record<string, { total: number; applied: number; avg: number; scoreSum: number }>)
  )
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)

  return (
    <div className="card flex flex-col gap-3">
      <SectionTitle icon={Globe2}>Portales</SectionTitle>
      {rows.length === 0 ? (
        <p className="text-2xs" style={{ color: col.fgMuted }}>Sin ofertas cargadas.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(([portal, data]) => (
            <div key={portal} className="grid grid-cols-[1fr_42px_42px_42px] items-center gap-2">
              <span className="text-xs truncate font-medium" style={{ color: col.fg }}>{portal}</span>
              <span className="text-2xs text-right tabular-nums" style={{ color: col.fgMuted }}>{data.total} total</span>
              <span className="text-2xs text-right tabular-nums" style={{ color: col.violet }}>{data.applied} post.</span>
              <span className="text-2xs text-right tabular-nums font-bold" style={{ color: scoreColor(data.avg) }}>{data.avg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OfferList({ title, offers, empty, icon }: {
  title: string
  offers: JobOffer[]
  empty: string
  icon: React.ElementType
}) {
  return (
    <div className="card">
      <SectionTitle icon={icon}>{title}</SectionTitle>
      {offers.length === 0 ? (
        <div className="py-5">
          <p className="text-2xs" style={{ color: col.fgMuted }}>{empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-3">
          {offers.map((o) => (
            <div key={o.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2.5 py-0.5">
              <div className="min-w-0">
                <div className="text-xs truncate font-medium" style={{ color: col.fg }}>{o.title}</div>
                <div className="text-2xs truncate" style={{ color: col.fgMuted }}>
                  {o.company} - {o.portal} - {formatDate(o.appliedAt ?? o.detectedAt)}
                </div>
              </div>
              <ScoreBar score={o.score} size="sm" />
              <StatusBadge status={o.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Dashboard() {
  const metrics       = useStore((s) => s.getDashboardMetrics())
  const offers        = useStore((s) => s.offers)
  const profile       = useStore((s) => s.profile)
  const settings      = useStore((s) => s.settings)
  const helpRequests  = useStore((s) => s.helpRequests)
  const setActiveView = useStore((s) => s.setActiveView)

  const counts = offers.reduce((acc, offer) => {
    acc[offer.status] = (acc[offer.status] ?? 0) + 1
    return acc
  }, {} as Record<JobStatus, number>)

  const pendingManual = counts.pendiente_manual ?? 0
  const pendingTest = counts.pendiente_test ?? 0
  const scored = offers.filter((o) => o.score > 0)
  const highScore = scored.filter((o) => o.score >= 70).length
  const midScore = scored.filter((o) => o.score >= 45 && o.score < 70).length
  const lowScore = scored.filter((o) => o.score > 0 && o.score < 45).length
  const appliedPortal = Object.entries(
    offers
      .filter((o) => o.status === 'postulada')
      .reduce((acc, o) => ({ ...acc, [o.portal]: (acc[o.portal] ?? 0) + 1 }), {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0]
  const latestOffer = [...offers].sort((a, b) => sortByDateDesc(a.detectedAt, b.detectedAt))[0]
  const latestApplied = [...offers].filter((o) => o.appliedAt).sort((a, b) => sortByDateDesc(a.appliedAt, b.appliedAt))[0]
  const pendingHelp = helpRequests.filter((h) => !h.resolved).length

  const recent = [...offers]
    .sort((a, b) => sortByDateDesc(a.detectedAt, b.detectedAt))
    .slice(0, 6)

  const bestMatches = [...offers]
    .filter((o) => !['rechazada', 'duplicada', 'error'].includes(o.status))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const personalInfoCount = Object.values(profile.personalInfo ?? {}).filter(Boolean).length
  const profileItems = [
    { label: 'CV', ok: !!profile.cvPath },
    { label: 'Texto CV', ok: !!profile.cvText },
    { label: 'Stack', ok: profile.mainStack.length > 0 },
    { label: 'Portales', ok: settings.portals.length > 0 },
    { label: 'Filtros', ok: profile.avoid.length > 0 },
    { label: 'Datos personales', ok: personalInfoCount > 0 },
  ]
  const readyItems = profileItems.filter((item) => item.ok).length

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label" style={{ marginBottom: '0.2rem' }}>Resumen</p>
          <h1 className="page-title" style={{ color: col.fg }}>Dashboard</h1>
        </div>
        <div className="flex gap-2">
          {metrics.aprobadas > 0 && (
            <button className="btn-primary reveal-up" onClick={() => setActiveView('bridge')}>
              Postular {metrics.aprobadas} aprobadas
            </button>
          )}
          <button className="btn-secondary reveal-up" onClick={() => setActiveView('offers')}>
            Revisar ofertas
          </button>
        </div>
      </div>

      <PipelineBar metrics={metrics} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          label="Pendientes"
          value={metrics.pendientes}
          icon={Clock}
          accent={col.amber}
          sub={`${pendingManual} manual / ${pendingTest} test`}
        />
        <MetricCard label="Errores" value={metrics.errores} icon={AlertCircle} accent={col.red} />
        <MetricCard
          label="Score promedio"
          value={metrics.avgScore > 0 ? `${Math.round(metrics.avgScore)}` : '-'}
          icon={TrendingUp}
          accent={metrics.avgScore > 0 ? scoreColor(metrics.avgScore) : col.fgMuted}
          sub={`${highScore} altas / ${midScore} medias / ${lowScore} bajas`}
        />
        <MetricCard
          label="Portal con mas postuladas"
          value={appliedPortal ? appliedPortal[0] : '-'}
          icon={Globe2}
          accent={appliedPortal ? col.violet : col.fgMuted}
          sub={appliedPortal ? `${appliedPortal[1]} postulaciones` : 'Sin postulaciones'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr_0.9fr] gap-4">
        <div className="card flex flex-col gap-3">
          <SectionTitle icon={Briefcase}>Lectura rapida</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <SmallStat label="Tasa postulacion" value={`${pct(metrics.postuladas, metrics.total)}%`} accent={col.violet} />
            <SmallStat label="Aprobadas vivas" value={metrics.aprobadas} accent={col.green} />
            <SmallStat label="Rechazadas" value={metrics.rechazadas} accent={col.fgMuted} />
            <SmallStat label="Duplicadas" value={metrics.duplicadas} accent={col.muted} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <SmallStat label="Ultima detectada" value={formatDate(latestOffer?.detectedAt)} sub={latestOffer?.company ?? 'Sin ofertas'} />
            <SmallStat label="Ultima postulada" value={formatDate(latestApplied?.appliedAt)} sub={latestApplied?.company ?? 'Sin postulaciones'} />
            <SmallStat label="Ayudas abiertas" value={pendingHelp} accent={pendingHelp ? col.amber : col.green} />
          </div>
        </div>

        <WorkQueue
          approved={metrics.aprobadas}
          pendingManual={pendingManual}
          pendingTest={pendingTest}
          errors={metrics.errores}
        />

        <div className="card flex flex-col gap-3">
          <SectionTitle icon={UserCheck}>Perfil operativo</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <SmallStat label="Completitud" value={`${readyItems}/${profileItems.length}`} accent={readyItems === profileItems.length ? col.green : col.amber} />
            <SmallStat label="Portales" value={settings.portals.length} accent={col.cream} />
            <SmallStat label="Stack" value={profile.mainStack.length} accent={col.cream} />
            <SmallStat label="Filtros" value={profile.avoid.length} accent={col.red} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profileItems.map((item) => (
              <span
                key={item.label}
                className="badge"
                style={{
                  color: item.ok ? col.green : col.fgMuted,
                  borderColor: item.ok ? alpha(col.green, 0.28) : alpha(col.border, 0.22),
                  background: item.ok ? alpha(col.green, 0.08) : alpha(col.border, 0.06)
                }}
              >
                {item.ok ? 'ok' : 'falta'} {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <QualityPanel
          total={scored.length}
          high={highScore}
          mid={midScore}
          low={lowScore}
          avgScore={metrics.avgScore}
        />
        <StatusDistribution counts={counts} total={metrics.total} />
        <PortalPanel offers={offers} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <OfferList
          title="Mejores matches activos"
          icon={ShieldCheck}
          offers={bestMatches}
          empty="No hay matches activos todavia."
        />
        <OfferList
          title="Ultimas detectadas"
          icon={FileText}
          offers={recent}
          empty="No hay ofertas aun. Usa Cowork Bridge para buscar."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        <button className="btn-primary" onClick={() => setActiveView('offers')}>
          <CheckCircle2 size={13} /> Revisar y aprobar
        </button>
        <button className="btn-secondary" onClick={() => setActiveView('bridge')}>
          <Send size={13} /> Ir a Cowork
        </button>
        <button className="btn-secondary" onClick={() => setActiveView('tracker')}>
          <Database size={13} /> Ver tracker
        </button>
        <button className="btn-secondary" onClick={() => setActiveView('profile')}>
          <Ban size={13} /> Ajustar filtros
        </button>
      </div>
    </div>
  )
}
