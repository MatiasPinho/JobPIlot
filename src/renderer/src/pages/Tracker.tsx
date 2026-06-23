import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useStore } from '../store/useStore'
import { StatusBadge } from '../components/ui/StatusBadge'
import { col, alpha, scoreColor } from '../lib/theme'
import type { JobStatus } from '../types'

const TRACKED_STATUSES: JobStatus[] = ['aprobada', 'postulada', 'pendiente_manual', 'pendiente_test', 'error']

export function Tracker() {
  const offers      = useStore((s) => s.offers)
  const updateOffer = useStore((s) => s.updateOffer)

  const [editId, setEditId]     = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState('')

  const tracked = offers
    .filter((o) => TRACKED_STATUSES.includes(o.status) || o.appliedAt)
    .sort((a, b) => {
      const ta = a.appliedAt ?? a.detectedAt
      const tb = b.appliedAt ?? b.detectedAt
      return new Date(tb).getTime() - new Date(ta).getTime()
    })

  const startEdit = (id: string, notes: string) => { setEditId(id); setEditNotes(notes) }
  const saveEdit  = (id: string) => { updateOffer(id, { notes: editNotes }); setEditId(null) }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${alpha(col.border, 0.2)}` }}
      >
        <div>
          <p className="label" style={{ marginBottom: '0.2rem' }}>Seguimiento</p>
          <h1 className="page-title" style={{ color: col.fg }}>Tracker</h1>
          <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
            {tracked.length} postulaciones en seguimiento
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {tracked.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-2xs" style={{ color: col.fgMuted }}>
              No hay postulaciones en seguimiento todavía. Aprobá ofertas y postulate con Cowork Bridge.
            </p>
          </div>
        ) : (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: `1px solid ${alpha(col.border, 0.2)}` }}
          >
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    {['Oferta', 'Empresa', 'Portal', 'Sc.', 'Estado', 'Fecha', 'Resultado', 'Notas'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tracked.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div className="flex items-center gap-1">
                          <span className="font-medium max-w-[180px] truncate" style={{ color: col.fg }} title={o.title}>
                            {o.title}
                          </span>
                          {o.link && (
                            <a href={o.link} target="_blank" rel="noreferrer"
                               className="opacity-30 hover:opacity-70 transition-opacity" style={{ color: col.fg }}>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap">{o.company}</td>
                      <td className="whitespace-nowrap">{o.portal}</td>
                      <td className="whitespace-nowrap">
                        <span className="font-bold tabular-nums text-2xs" style={{ color: scoreColor(o.score) }}>
                          {o.score}
                        </span>
                      </td>
                      <td className="whitespace-nowrap">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="whitespace-nowrap">
                        {o.appliedAt
                          ? new Date(o.appliedAt).toLocaleDateString('es-AR')
                          : new Date(o.detectedAt).toLocaleDateString('es-AR')}
                      </td>
                      <td className="max-w-[140px]">
                        {o.result
                          ? <span className="truncate block" title={o.result} style={{ color: col.fgDim }}>{o.result}</span>
                          : <span style={{ color: col.dim }}>—</span>
                        }
                      </td>
                      <td>
                        {editId === o.id ? (
                          <div className="flex gap-1">
                            <input
                              className="input"
                              style={{ width: 112, minHeight: 24, padding: '2px 6px' }}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(o.id)}
                            />
                            <button onClick={() => saveEdit(o.id)} className="btn-mini" style={{ color: col.green }}>✓</button>
                            <button onClick={() => setEditId(null)} className="btn-mini">✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(o.id, o.notes ?? '')}
                            className="text-2xs max-w-[120px] truncate block transition-colors"
                            style={{ color: o.notes ? col.fgMuted : col.dim, background: 'none', border: 'none', cursor: 'pointer' }}
                            title={o.notes || 'Click para editar'}
                          >
                            {o.notes || <span style={{ fontStyle: 'italic' }}>Agregar nota</span>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
