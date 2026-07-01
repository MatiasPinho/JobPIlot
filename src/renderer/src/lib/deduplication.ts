import type { JobOffer } from '../types'

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const path = u.pathname.toLowerCase().replace(/\/$/, '')
    const indeedId = u.searchParams.get('jk')
    if (host.includes('indeed.') && indeedId) return `${host}/viewjob?jk=${indeedId.toLowerCase()}`
    const linkedInId = u.searchParams.get('currentJobId') ?? u.searchParams.get('jobId')
    if (host.includes('linkedin.') && linkedInId) return `${host}/jobs/view/${linkedInId.toLowerCase()}`
    const linkedInPathId = path.match(/\/jobs\/view\/(\d+)/)?.[1]
    if (host.includes('linkedin.') && linkedInPathId) return `${host}/jobs/view/${linkedInPathId}`
    u.search = ''
    u.hash = ''
    return `${host}${u.pathname.toLowerCase().replace(/\/$/, '')}`
  } catch {
    return url.toLowerCase().trim()
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleSimilarity(a: string, b: string): number {
  const na = normalizeTitle(a)
  const nb = normalizeTitle(b)
  if (na === nb) return 1
  const wordsA = new Set(na.split(' ').filter((w) => w.length > 3))
  const wordsB = new Set(nb.split(' ').filter((w) => w.length > 3))
  if (wordsA.size === 0 || wordsB.size === 0) return 0
  let shared = 0
  for (const w of wordsA) if (wordsB.has(w)) shared++
  return shared / Math.max(wordsA.size, wordsB.size)
}

export interface DeduplicationResult {
  unique: JobOffer[]
  duplicates: JobOffer[]
  pairs: Array<{ original: string; duplicate: string }>
}

export function detectDuplicates(
  incoming: JobOffer[],
  existing: JobOffer[]
): DeduplicationResult {
  const all = [...existing]
  const unique: JobOffer[] = []
  const duplicates: JobOffer[] = []
  const pairs: Array<{ original: string; duplicate: string }> = []

  for (const offer of incoming) {
    const urlNorm = normalizeUrl(offer.link)
    const companyNorm = offer.company.toLowerCase().trim()

    let duplicateOf: string | undefined

    // 1. Exact URL match
    for (const existing of all) {
      if (normalizeUrl(existing.link) === urlNorm) {
        duplicateOf = existing.id
        break
      }
    }

    // 2. Same company + very similar title
    if (!duplicateOf) {
      for (const ex of all) {
        if (
          ex.company.toLowerCase().trim() === companyNorm &&
          titleSimilarity(ex.title, offer.title) >= 0.75
        ) {
          duplicateOf = ex.id
          break
        }
      }
    }

    if (duplicateOf) {
      duplicates.push({ ...offer, status: 'duplicada', duplicateOf })
      pairs.push({ original: duplicateOf, duplicate: offer.id })
    } else {
      unique.push(offer)
      all.push(offer)
    }
  }

  return { unique, duplicates, pairs }
}
