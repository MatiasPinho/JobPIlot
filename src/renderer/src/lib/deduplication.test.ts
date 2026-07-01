import { describe, expect, it } from 'vitest'
import { detectDuplicates } from './deduplication'
import type { JobOffer } from '../types'

function makeOffer(partial: Partial<JobOffer>): JobOffer {
  return {
    id: 'offer',
    title: 'Frontend Developer',
    company: 'Empresa',
    portal: 'LinkedIn',
    link: 'https://example.com/jobs/1',
    description: '',
    status: 'detectada',
    score: 0,
    detectedAt: new Date().toISOString(),
    ...partial
  }
}

describe('detectDuplicates', () => {
  it('detecta duplicados por URL aunque cambien query, hash o slash final', () => {
    const existing = [makeOffer({ id: 'original', link: 'https://example.com/jobs/123?utm=linkedin#top' })]
    const incoming = [makeOffer({ id: 'copy', link: 'https://example.com/jobs/123/' })]

    const result = detectDuplicates(incoming, existing)

    expect(result.unique).toHaveLength(0)
    expect(result.duplicates).toHaveLength(1)
    expect(result.duplicates[0].status).toBe('duplicada')
    expect(result.duplicates[0].duplicateOf).toBe('original')
    expect(result.pairs).toEqual([{ original: 'original', duplicate: 'copy' }])
  })

  it('detecta duplicados por misma empresa y titulo muy similar', () => {
    const existing = [makeOffer({ id: 'original', company: 'ACME', title: 'Frontend React Developer SSR' })]
    const incoming = [makeOffer({ id: 'copy', company: 'acme ', title: 'Frontend React Developer SSR - Remoto', link: 'https://other.com/1' })]

    const result = detectDuplicates(incoming, existing)

    expect(result.unique).toHaveLength(0)
    expect(result.duplicates[0].duplicateOf).toBe('original')
  })

  it('no marca como duplicadas ofertas distintas de Indeed que comparten /viewjob', () => {
    const existing = [
      makeOffer({
        id: 'talent-connect',
        link: 'https://ar.indeed.com/viewjob?jk=8951e6d6778af00d',
        title: 'Frontend Developer SSR',
        company: 'Talent Connect'
      })
    ]
    const incoming = [
      makeOffer({
        id: 'belo',
        link: 'https://ar.indeed.com/viewjob?jk=02c09ea0bd85821b',
        title: 'SSR Full Stack Developer',
        company: 'belo'
      }),
      makeOffer({
        id: 'web',
        link: 'https://ar.indeed.com/viewjob?jk=48c58b7b0ceadac6',
        title: 'Desarrollador Fullstack SSR',
        company: 'Web:'
      })
    ]

    const result = detectDuplicates(incoming, existing)

    expect(result.unique.map((offer) => offer.id)).toEqual(['belo', 'web'])
    expect(result.duplicates).toHaveLength(0)
  })

  it('mantiene ofertas distintas como unicas', () => {
    const existing = [makeOffer({ id: 'original', company: 'ACME', title: 'Frontend Developer' })]
    const incoming = [makeOffer({ id: 'new', company: 'Globant', title: 'Angular Developer', link: 'https://jobs.com/angular' })]

    const result = detectDuplicates(incoming, existing)

    expect(result.unique).toHaveLength(1)
    expect(result.duplicates).toHaveLength(0)
  })

  it('compara cada oferta nueva contra las nuevas ya aceptadas', () => {
    const incoming = [
      makeOffer({ id: 'first', link: 'https://jobs.com/frontend', title: 'Frontend Developer', company: 'ACME' }),
      makeOffer({ id: 'second', link: 'https://jobs.com/frontend?ref=copy', title: 'Frontend Developer', company: 'ACME' })
    ]

    const result = detectDuplicates(incoming, [])

    expect(result.unique.map((offer) => offer.id)).toEqual(['first'])
    expect(result.duplicates[0].duplicateOf).toBe('first')
  })
})
