import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Check, X, Info } from 'lucide-react'
import { useStore } from '../store/useStore'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { col, alpha, scoreColor } from '../lib/theme'
import type { JobOffer, JobStatus } from '../types'

const STATUS_FILTERS: { label: string; value: JobStatus | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Recomendadas', value: 'recomendada' },
  { label: 'Aprobadas', value: 'aprobada' },
  { label: 'Detectadas', value: 'detectada' },
  { label: 'Rechazadas', value: 'rechazada' },
  { label: 'Postuladas', value: 'postulada' },
  { label: 'Pendientes', value: 'pendiente_manual' },
  { label: 'Errores', value: 'error' },
  { label: 'Duplicadas', value: 'duplicada' },
]

const STRIP_CLASS: Record<string, string> = {
  high: 'row-strip-high',
  mid:  'row-strip-mid',
  low:  'row-strip-low',
}

function scoreClass(score: number): string {
  if (score >= 65) return STRIP_CLASS.high
  if (score >= 35) return STRIP_CLASS.mid
  return STRIP_CLASS.low
}

function OfferCard({ offer }: { offer: JobOffer }) {
  const [expanded, setExpanded] = useState(false)
  const approveOffer = useStore((s) => s.approveOffer)
  const rejectOffer  = useStore((s) => s.rejectOffer)
  const updateOffer  = useStore((s) => s.updateOffer)

  const canApprove = ['recomendada', 'detectada'].includes(offer.status)
  const canReject  = ['recomendada', 'detectada', 'aprobada'].includes(offer.status)

  return (
    <div
      className={`card overflow-hidden ${scoreClass(offer.score)}`}
      style={{ padding: 0 }}
    >
      {/* Header row */}
      <div
        className="flex items-start gap-3 px-4 py-3 cursor-pointer"
        style={{ transition: 'background 0.12s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = alpha(col.raised, 0.7))}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: col.fg }}>{offer.title}</span>
            <StatusBadge status={offer.status} />
          </div>
          <div className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
            {offer.company} · {offer.portal} · {new Date(offer.detectedAt).toLocaleDateString('es-AR')}
            {offer.modality && ` · ${offer.modality}`}
            {offer.location && ` · ${offer.location}`}
          </div>
          {offer.salary && (
            <div className="text-2xs mt-0.5 font-medium" style={{ color: col.green }}>{offer.salary}</div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreBar score={offer.score} size="sm" />
          {expanded
            ? <ChevronUp size={13} style={{ color: col.fgMuted }} />
            : <ChevronDown size={13} style={{ color: col.fgMuted }} />
          }
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-3 flex flex-col gap-3 animate-fade-in"
          style={{ borderTop: `1px solid ${alpha(col.border, 0.2)}` }}
        >
          {/* Score breakdown */}
          {offer.scoreBreakdown && (
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="label" style={{ color: col.green }}>Positivos</div>
                <div className="flex flex-wrap gap-1">
                  {offer.scoreBreakdown.positives.length > 0
                    ? offer.scoreBreakdown.positives.map((p) => (
                        <span key={p} className="tag" style={{ color: col.green, borderColor: alpha(col.green, 0.3) }}>{p}</span>
                      ))
                    : <span style={{ color: col.fgMuted }} className="text-2xs">—</span>
                  }
                </div>
              </div>
              <div className="flex-1">
                <div className="label" style={{ color: col.red }}>Negativos</div>
                <div className="flex flex-wrap gap-1">
                  {offer.scoreBreakdown.negatives.length > 0
                    ? offer.scoreBreakdown.negatives.map((n) => (
                        <span key={n} className="tag" style={{ color: col.red, borderColor: alpha(col.red, 0.3) }}>{n}</span>
                      ))
                    : <span style={{ color: col.fgMuted }} className="text-2xs">—</span>
                  }
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <div className="label">Descripción</div>
            <p className="text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap" style={{ color: col.fgDim }}>
              {offer.description}
            </p>
          </div>

          {/* Requirements */}
          {offer.requirements && offer.requirements.length > 0 && (
            <div>
              <div className="label">Requisitos</div>
              <div className="flex flex-wrap gap-1">
                {offer.requirements.map((r) => (
                  <span key={r} className="tag">{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <div className="label">Notas</div>
            <textarea
              className="input"
              rows={2}
              value={offer.notes ?? ''}
              onChange={(e) => updateOffer(offer.id, { notes: e.target.value })}
              placeholder="Agrega notas sobre esta oferta..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {canApprove && (
              <button className="btn-primary" style={{ minHeight: 28, padding: '0 0.75rem', fontSize: 'var(--text-2xs)' }}
                onClick={() => approveOffer(offer.id)}>
                <Check size={12} /> Aprobar
              </button>
            )}
            {canReject && (
              <button className="btn-danger" style={{ minHeight: 28, padding: '0 0.75rem', fontSize: 'var(--text-2xs)' }}
                onClick={() => rejectOffer(offer.id)}>
                <X size={12} /> Rechazar
              </button>
            )}
            {offer.status === 'aprobada' && (
              <button className="btn-secondary" style={{ minHeight: 28, padding: '0 0.75rem', fontSize: 'var(--text-2xs)' }}
                onClick={() => updateOffer(offer.id, { status: 'recomendada' })}>
                Desaprobar
              </button>
            )}
            {offer.link && (
              <a
                href={offer.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-mini ml-auto"
              >
                <ExternalLink size={11} /> Ver oferta
              </a>
            )}
            {offer.duplicateOf && (
              <span className="text-2xs flex items-center gap-1 ml-auto" style={{ color: col.fgMuted }}>
                <Info size={11} /> Duplicada de {offer.duplicateOf}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function Offers() {
  const offers                 = useStore((s) => s.offers)
  const bulkApproveRecommended = useStore((s) => s.bulkApproveRecommended)
  const metrics                = useStore((s) => s.getDashboardMetrics())
  const setActiveView          = useStore((s) => s.setActiveView)

  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')
  const [sortBy, setSortBy]             = useState<'score' | 'date'>('score')
  const [showFilters, setShowFilters]   = useState(true)

  const filtered = offers
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)
    .sort((a, b) =>
      sortBy === 'score'
        ? b.score - a.score
        : new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    )

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${alpha(col.border, 0.2)}` }}
      >
        <div>
          <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Ofertas</h1>
          <p className="text-2xs" style={{ color: col.fgMuted }}>
            {offers.length} total · {metrics.recomendadas} recomendadas · {metrics.aprobadas} aprobadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {metrics.recomendadas > 0 && (
            <button className="btn-primary" onClick={bulkApproveRecommended}>
              <Check size={12} />
              Aprobar recomendadas ({metrics.recomendadas})
            </button>
          )}
          <button className="btn-secondary" onClick={() => setActiveView('bridge')}>
            Importar
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        {/* Status filters */}
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {STATUS_FILTERS.map(({ label, value }) => {
            const active = statusFilter === value
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className="btn-mini"
                style={active
                  ? { background: alpha(col.cream, 0.12), color: col.cream, borderColor: alpha(col.cream, 0.3) }
                  : undefined
                }
              >
                {label}
              </button>
            )
          })}
        </div>
        {/* Sort */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {(['score', 'date'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="btn-mini"
              style={sortBy === s ? { color: col.cream, borderColor: alpha(col.cream, 0.3) } : undefined}
            >
              {s === 'score' ? 'Score' : 'Fecha'}
            </button>
          ))}
        </div>
      </div>

      {/* Offer list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-2xs" style={{ color: col.fgMuted }}>
              {offers.length === 0
                ? 'No hay ofertas todavía. Usá Cowork Bridge para importar.'
                : 'No hay ofertas con ese filtro.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((o) => <OfferCard key={o.id} offer={o} />)}
          </div>
        )}
      </div>
    </div>
  )
}
