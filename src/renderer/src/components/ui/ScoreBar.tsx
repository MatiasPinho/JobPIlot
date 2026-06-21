import { alpha, scoreColor, col } from '../../lib/theme'

interface Props {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ScoreBar({ score, showLabel = true, size = 'md' }: Props) {
  const h    = size === 'sm' ? 3 : 4
  const c    = scoreColor(score)
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: h, background: alpha(col.border, 0.25), minWidth: size === 'sm' ? 56 : 80 }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: c, opacity: 0.85 }}
        />
      </div>
      {showLabel && (
        <span className="text-2xs font-bold w-6 text-right tabular-nums" style={{ color: c }}>
          {score}
        </span>
      )}
    </div>
  )
}
