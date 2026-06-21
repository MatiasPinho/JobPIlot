/** Mirror of BugLens theme.ts — col tokens + alpha utility */

function v(name: string): string {
  return `rgb(var(--c-${name}))`
}

export const col = {
  base:          v('base'),
  surface:       v('surface'),
  raised:        v('raised'),
  code:          v('code'),
  dim:           v('dim'),
  muted:         v('muted'),
  border:        v('border'),
  fgMuted:       v('fg-muted'),
  fgDim:         v('fg-dim'),
  fg:            v('fg'),
  cream:         v('cream'),
  warm:          v('warm'),
  red:           v('red'),
  amber:         v('amber'),
  green:         v('green'),
  terracotta:    v('terracotta'),
  gray:          v('gray'),
  done:          v('done'),
  amberDeep:     v('amber-deep'),
  amberStrip:    v('amber-strip'),
  violet:        v('violet'),
  creamPressed:  v('cream-pressed'),
  raisedPressed: v('raised-pressed'),
} as const

export type ColKey = keyof typeof col

export function alpha(color: string, a: number): string {
  return color.replace(/\)\s*$/, ` / ${a})`)
}

// JobPilot-specific status → color mapping (matches JobStatus)
export const statusCol = {
  detectada:        { text: col.fgDim,      bg: alpha(col.fgDim, 0.08),      border: alpha(col.fgDim, 0.22) },
  recomendada:      { text: col.cream,      bg: alpha(col.cream, 0.10),      border: alpha(col.cream, 0.28) },
  aprobada:         { text: col.green,      bg: alpha(col.green, 0.10),      border: alpha(col.green, 0.30) },
  rechazada:        { text: col.fgMuted,    bg: alpha(col.fgMuted, 0.06),    border: alpha(col.fgMuted, 0.18) },
  postulada:        { text: col.violet,     bg: alpha(col.violet, 0.10),     border: alpha(col.violet, 0.28) },
  pendiente_manual: { text: col.amber,      bg: alpha(col.amberDeep, 0.10),  border: alpha(col.amberDeep, 0.30) },
  pendiente_test:   { text: col.terracotta, bg: alpha(col.terracotta, 0.08), border: alpha(col.terracotta, 0.26) },
  error:            { text: col.red,        bg: alpha(col.red, 0.10),        border: alpha(col.red, 0.30) },
  duplicada:        { text: col.muted,      bg: alpha(col.muted, 0.06),      border: alpha(col.muted, 0.18) },
} as const

export const scoreCol = {
  high: col.green,
  mid:  col.cream,
  low:  col.red,
} as const

export function scoreColor(score: number): string {
  if (score >= 70) return scoreCol.high
  if (score >= 45) return scoreCol.mid
  return scoreCol.low
}
