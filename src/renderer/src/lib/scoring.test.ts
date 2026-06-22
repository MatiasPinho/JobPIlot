import { describe, it, expect } from 'vitest'
import { scoreOffer, classifyByScore } from './scoring'
import type { JobOffer, UserProfile } from '../types'

const TEST_PROFILE: UserProfile = {
  targetRole: 'Frontend Developer',
  mainStack: ['React', 'TypeScript', 'Angular'],
  secondaryStack: ['APIs REST', 'Jest', 'Design System', 'Scrum'],
  experience: '2+ años',
  preferredModality: ['Remoto', 'Híbrido'],
  preferredLocation: ['CABA', 'AMBA', 'Buenos Aires'],
  avoid: ['Soporte técnico', 'Help Desk', 'Presencial', 'Call center', 'DevOps', 'Infraestructura'],
  updatedAt: new Date().toISOString()
}

function makeOffer(partial: Partial<JobOffer>): JobOffer {
  return {
    id: 'test',
    title: '',
    company: 'Empresa',
    portal: 'LinkedIn',
    link: 'https://example.com',
    description: '',
    status: 'detectada',
    score: 0,
    detectedAt: new Date().toISOString(),
    ...partial
  }
}

describe('scoreOffer', () => {
  it('score alto para oferta ideal React remota', () => {
    const offer = makeOffer({
      title: 'Frontend Developer SSR',
      description: `Buscamos un Frontend Developer. Stack: React, TypeScript, APIs REST.
        Modalidad: 100% remoto desde CABA/AMBA. 2+ años de experiencia.
        Trabajo en equipo con Scrum. Design System y componentes reutilizables.`
    })
    const { score, positives } = scoreOffer(offer, TEST_PROFILE)
    expect(score).toBeGreaterThanOrEqual(70)
    expect(positives).toContain('React')
    expect(positives).toContain('TypeScript')
    expect(positives).toContain('modalidad')
    expect(positives).toContain('ubicación')
  })

  it('score bajo para soporte presencial (avoid)', () => {
    const offer = makeOffer({
      title: 'Técnico de soporte help desk',
      description: 'Soporte técnico presencial en empresa de CABA. Atención de tickets.'
    })
    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)
    expect(score).toBeLessThan(40)
    expect(negatives).toContain('Soporte técnico')
    expect(negatives).toContain('Presencial')
  })

  it('score bajo para devops (avoid)', () => {
    const offer = makeOffer({
      title: 'DevOps Engineer',
      description: 'Infraestructura cloud con Kubernetes y Terraform. Presencial en Buenos Aires.'
    })
    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)
    expect(score).toBeLessThan(40)
    expect(negatives).toContain('DevOps')
  })

  it('word-boundary: "react" no matchea dentro de otra palabra', () => {
    const offer = makeOffer({
      title: 'Reaction time researcher',
      description: 'Estudio de tiempos de reaction en laboratorio. Sin tecnología web.'
    })
    const { positives } = scoreOffer(offer, TEST_PROFILE)
    expect(positives).not.toContain('React')
  })

  it('sin perfil devuelve score neutro', () => {
    const offer = makeOffer({ title: 'React Developer' })
    expect(scoreOffer(offer).score).toBe(50)
  })

  it('score siempre entre 0 y 100', () => {
    const perfect = makeOffer({
      title: 'Frontend React TypeScript Angular',
      description: 'React TypeScript Angular remoto CABA APIs REST Jest Scrum Design System'
    })
    const bad = makeOffer({
      title: 'Soporte help desk',
      description: 'Soporte técnico presencial Call center DevOps Infraestructura'
    })
    expect(scoreOffer(perfect, TEST_PROFILE).score).toBeLessThanOrEqual(100)
    expect(scoreOffer(bad, TEST_PROFILE).score).toBeGreaterThanOrEqual(0)
  })
})

describe('classifyByScore', () => {
  it('clasifica correctamente según umbrales', () => {
    expect(classifyByScore(80)).toBe('recomendada')
    expect(classifyByScore(50)).toBe('detectada')
    expect(classifyByScore(20)).toBe('rechazada')
  })
})
