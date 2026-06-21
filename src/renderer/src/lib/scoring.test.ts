import { describe, it, expect } from 'vitest'
import { scoreOffer, classifyByScore } from './scoring'
import type { JobOffer } from '../types'

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
  it('score alto para oferta ideal SSR React remota', () => {
    const offer = makeOffer({
      title: 'Frontend Developer SSR',
      description: `Buscamos un Frontend Developer SSR. Stack: React, TypeScript, APIs REST.
        Modalidad: 100% remoto desde CABA/AMBA. 2+ años de experiencia.
        Salario en USD. Trabajo en equipo ágil con scrum.
        Componentes reutilizables y design system.`
    })
    const { score, positives } = scoreOffer(offer)
    expect(score).toBeGreaterThanOrEqual(70)
    expect(positives).toContain('React')
    expect(positives).toContain('TypeScript')
    expect(positives).toContain('Remoto')
  })

  it('score bajo para oferta de soporte presencial', () => {
    const offer = makeOffer({
      title: 'Técnico de soporte help desk',
      description: 'Soporte técnico presencial en empresa de CABA. Atención de tickets y mesa de ayuda.'
    })
    const { score, negatives } = scoreOffer(offer)
    expect(score).toBeLessThan(40)
    expect(negatives).toContain('Soporte / Help Desk')
  })

  it('score bajo para devops sin frontend', () => {
    const offer = makeOffer({
      title: 'DevOps Engineer',
      description: 'Infraestructura cloud con Kubernetes, Terraform y AWS. Presencial en Buenos Aires.'
    })
    const { score } = scoreOffer(offer)
    expect(score).toBeLessThan(40)
  })

  it('penaliza seniority muy alto', () => {
    const offer = makeOffer({
      title: 'Senior Frontend Developer 7+ años',
      description: 'Buscamos frontend con React y 7+ años de experiencia obligatoria.'
    })
    const { negatives } = scoreOffer(offer)
    expect(negatives).toContain('Seniority muy alto (5+ años)')
  })

  it('score siempre entre 0 y 100', () => {
    const perfect = makeOffer({
      title: 'Frontend React TypeScript Angular SSR',
      description: 'React TypeScript Angular frontend remote remoto híbrido CABA AMBA REST API testing jest scrum design system components salario USD beneficios prepaga git github 2 años SSR semi-senior'
    })
    const bad = makeOffer({
      title: 'Soporte help desk',
      description: 'Soporte presencial infraestructura devops kubernetes terraform sysadmin 7+ años inglés avanzado excluyente'
    })
    expect(scoreOffer(perfect).score).toBeLessThanOrEqual(100)
    expect(scoreOffer(bad).score).toBeGreaterThanOrEqual(0)
  })
})

describe('classifyByScore', () => {
  it('clasifica correctamente según umbrales', () => {
    expect(classifyByScore(80)).toBe('recomendada')
    expect(classifyByScore(50)).toBe('detectada')
    expect(classifyByScore(20)).toBe('rechazada')
  })
})
