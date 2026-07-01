import type { JobOffer, JobStatus, UserProfile } from '../types'

export interface ScoreBreakdown {
  score: number
  positives: string[]
  negatives: string[]
}

// Busca un término como palabra completa (evita que "react" matchee "reaction").
// Escapa caracteres especiales para soportar tags como "Node.js" o "C++".
function hasTerm(text: string, term: string): boolean {
  const t = term.trim().toLowerCase()
  if (t.length < 2) return false
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text)
}

// Misma fórmula que el MCP server (mcp/server-http.ts): una oferta debe tener
// el mismo score sin importar si la agregó Cowork o se importó a mano.
export function scoreOffer(offer: JobOffer, profile?: UserProfile): ScoreBreakdown {
  if (!profile) return { score: 50, positives: [], negatives: [] }
  const text = [offer.title, offer.description, ...(offer.requirements ?? [])].join(' ').toLowerCase()

  let score = 42
  const positives: string[] = []
  const negatives: string[] = []

  let mainPts = 0
  for (const tech of profile.mainStack ?? []) if (hasTerm(text, tech)) { mainPts += 8; positives.push(tech) }
  score += Math.min(mainPts, 30)

  if ((profile.preferredModality ?? []).some((m) => hasTerm(text, m))) { score += 6; positives.push('modalidad') }
  if ((profile.preferredLocation ?? []).some((l) => hasTerm(text, l))) { score += 6; positives.push('ubicación') }

  for (const bad of profile.avoid ?? []) if (hasTerm(text, bad)) { score -= 18; negatives.push(bad) }

  return { score: Math.max(0, Math.min(100, Math.round(score))), positives, negatives }
}

const RECOMMENDED_SCORE = 65

export function classifyByScore(score: number): Extract<JobStatus, 'recomendada' | 'detectada'> {
  if (score >= RECOMMENDED_SCORE) return 'recomendada'
  return 'detectada'
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

export function scoreBgColor(score: number): string {
  if (score >= 70) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}
