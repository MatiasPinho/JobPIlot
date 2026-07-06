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

const DEFAULT_TARGET_SENIORITY = ['Junior', 'Semi Senior', 'SSR']

const SENIORITY_PATTERNS: Record<string, RegExp[]> = {
  trainee: [/(^|[^a-z0-9])(trainee|pasante|internship|intern)([^a-z0-9]|$)/i],
  junior: [/(^|[^a-z0-9])(junior|jr\.?)([^a-z0-9]|$)/i],
  'semi senior': [
    /(^|[^a-z0-9])(semi[\s-]?senior|semi[\s-]?sr\.?|semisenior|ssr)([^a-z0-9]|$)/i
  ],
  ssr: [/(^|[^a-z0-9])(ssr|semi[\s-]?senior|semi[\s-]?sr\.?|semisenior)([^a-z0-9]|$)/i],
  mid: [/(^|[^a-z0-9])(mid[\s-]?level|mid|intermediate|semi[\s-]?senior|ssr)([^a-z0-9]|$)/i],
  lead: [/(^|[^a-z0-9])(lead|tech lead|team lead)([^a-z0-9]|$)/i],
  staff: [/(^|[^a-z0-9])staff([^a-z0-9]|$)/i],
  principal: [/(^|[^a-z0-9])principal([^a-z0-9]|$)/i]
}

const SENIORITY_MAX_YEARS: Record<string, number> = {
  trainee: 1,
  junior: 2,
  'semi senior': 4,
  ssr: 4,
  mid: 4,
  senior: 99,
  lead: 99,
  staff: 99,
  principal: 99
}

interface YearsRange {
  min: number
  max: number
}

interface SalaryRange {
  currency?: string
  min?: number
  max?: number
}

function normalizeSeniority(value: string): string {
  return value.trim().toLowerCase()
    .replace(/\./g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
}

function getTargetSeniorities(profile: UserProfile): string[] {
  const values = (profile.targetSeniority?.length ? profile.targetSeniority : DEFAULT_TARGET_SENIORITY)
    .map(normalizeSeniority)
  return [...new Set(values)]
}

function matchesSeniority(text: string, seniority: string): boolean {
  if (seniority === 'senior') return matchesStandaloneSenior(text)
  const patterns = SENIORITY_PATTERNS[seniority]
  return patterns ? patterns.some((pattern) => pattern.test(text)) : hasTerm(text, seniority)
}

function matchesStandaloneSenior(text: string): boolean {
  const seniorMatches = [...text.matchAll(/(^|[^a-z0-9])(senior|sr\.?)([^a-z0-9]|$)/gi)]
  return seniorMatches.some((match) => {
    const start = match.index ?? 0
    const prefix = text.slice(Math.max(0, start - 10), start + match[1].length).toLowerCase()
    return !/(semi[\s-]?|mid[\s-]?)$/.test(prefix)
  })
}

function requiredYearsRange(text: string): YearsRange | null {
  if (/(sin experiencia|no se requiere experiencia|without experience|no experience)/i.test(text)) {
    return { min: 0, max: 0 }
  }
  const matches = [...text.matchAll(/(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s*\+?\s*(?:años|anos|years|yrs)/gi)]
  if (matches.length === 0) return null
  const ranges = matches.map((match) => ({
    min: Number(match[1]),
    max: Number(match[2] ?? match[1])
  }))
  return {
    min: Math.min(...ranges.map((range) => range.min)),
    max: Math.max(...ranges.map((range) => range.max))
  }
}

function parseMoney(value: string): number | undefined {
  const compact = value.replace(/\s+/g, '')
  const normalized = compact.includes(',') && !compact.includes('.')
    ? compact.replace(',', '.')
    : compact.replace(/[.,]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseSalaryRange(value: string | undefined): SalaryRange {
  const text = value ?? ''
  const currencyMatch = text.match(/(USD|ARS|EUR|US\$|U\$S|\$)/i)
  const rawCurrency = currencyMatch?.[1]
  const currency = rawCurrency
    ? (rawCurrency === '$' ? 'ARS' : rawCurrency.replace(/^US\$|^U\$S$/i, 'USD').toUpperCase())
    : undefined
  const numbers = [...text.matchAll(/\d[\d.,]*/g)]
    .map((match) => parseMoney(match[0]))
    .filter((number): number is number => typeof number === 'number')
  return { currency, min: numbers[0], max: numbers[1] ?? numbers[0] }
}

function hasHighSenioritySignal(text: string): string | null {
  for (const level of ['lead', 'staff', 'principal', 'senior']) {
    if (matchesSeniority(text, level)) return level
  }
  return null
}

function isAvoidMatch(text: string, term: string): boolean {
  const normalized = normalizeSeniority(term)
  if (normalized === 'senior') return matchesSeniority(text, 'senior')
  return hasTerm(text, term)
}

function scoreSeniority(text: string, profile: UserProfile): {
  points: number
  positives: string[]
  negatives: string[]
} {
  const targets = getTargetSeniorities(profile)
  const positives: string[] = []
  const negatives: string[] = []

  const matchedTarget = targets.find((level) => matchesSeniority(text, level))
  if (matchedTarget) positives.push(`seniority: ${matchedTarget}`)

  const highSignal = hasHighSenioritySignal(text)
  const seniorityMaxYears = Math.max(...targets.map((level) => SENIORITY_MAX_YEARS[level] ?? 4))
  const maxAcceptedYears = typeof profile.experienceYearsMax === 'number'
    ? profile.experienceYearsMax
    : seniorityMaxYears
  const years = requiredYearsRange(text)

  if (highSignal && !targets.includes(highSignal)) {
    negatives.push(`seniority alto: ${highSignal}`)
  }
  if (years !== null && years.max > maxAcceptedYears) {
    negatives.push(`experiencia requerida: ${years.max}+ años`)
  }
  if (years !== null && typeof profile.experienceYearsMin === 'number' && years.max < profile.experienceYearsMin) {
    negatives.push(`experiencia por debajo del rango: ${years.max} años`)
  }

  return {
    points: (matchedTarget ? 10 : 0) - (negatives.length ? 22 : 0),
    positives,
    negatives
  }
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

  const seniority = scoreSeniority(text, profile)
  score += seniority.points
  positives.push(...seniority.positives)
  negatives.push(...seniority.negatives)

  const offeredSalary = parseSalaryRange(offer.salary)
  const sameCurrency = !offeredSalary.currency ||
    !profile.salaryCurrency ||
    offeredSalary.currency === profile.salaryCurrency.toUpperCase()
  if (typeof profile.salaryMin === 'number' && typeof offeredSalary.max === 'number' && sameCurrency) {
    if (offeredSalary.max < profile.salaryMin) {
      score -= 18
      negatives.push('salario debajo de pretensión')
    } else {
      score += 6
      positives.push('salario compatible')
    }
  }

  for (const bad of profile.avoid ?? []) if (isAvoidMatch(text, bad)) { score -= 18; negatives.push(bad) }

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
