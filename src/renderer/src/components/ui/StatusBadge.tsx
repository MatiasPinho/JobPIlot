import { statusCol } from '../../lib/theme'
import type { JobStatus } from '../../types'

const LABELS: Record<JobStatus, string> = {
  detectada:        'detectada',
  recomendada:      'recomendada',
  aprobada:         'aprobada',
  rechazada:        'rechazada',
  postulada:        'postulada',
  pendiente_manual: 'pend. manual',
  pendiente_test:   'pend. test',
  error:            'error',
  duplicada:        'duplicada',
}

export function StatusBadge({ status }: { status: JobStatus }) {
  const c = statusCol[status] ?? statusCol.detectada
  return (
    <span
      className="badge"
      style={{ color: c.text, background: c.bg, borderColor: c.border }}
    >
      {LABELS[status]}
    </span>
  )
}
