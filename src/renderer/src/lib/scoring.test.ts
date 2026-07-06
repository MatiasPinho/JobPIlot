import { describe, expect, it } from 'vitest'
import { classifyByScore, scoreOffer } from './scoring'
import type { JobOffer, UserProfile } from '../types'

const TEST_PROFILE: UserProfile = {
  targetRole: 'Frontend Developer',
  targetRoles: ['Frontend Developer'],
  personalInfo: {
    dni: '',
    email: '',
    phone: '',
    address: ''
  },
  mainStack: ['React', 'TypeScript', 'Angular', 'APIs REST', 'Jest', 'Design System', 'Scrum'],
  secondaryStack: [],
  targetSeniority: ['Junior', 'Semi Senior', 'SSR'],
  experienceYearsMin: 2,
  experienceYearsMax: 4,
  experience: '2+ anos',
  softSkills: ['Trabajo en equipo'],
  salaryCurrency: 'USD',
  salaryMin: 2000,
  salaryMax: undefined,
  salaryExpectation: 'USD 2000 como minimo',
  availability: ['Full-time'],
  preferredModality: ['Remoto', 'Hibrido'],
  preferredLocation: ['CABA', 'AMBA', 'Buenos Aires'],
  avoid: ['Soporte tecnico', 'Help Desk', 'Presencial', 'Call center', 'DevOps', 'Infraestructura'],
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
  it('da score alto para una oferta ideal de frontend remoto', () => {
    const offer = makeOffer({
      title: 'Frontend Developer SSR',
      description: `Buscamos un Frontend Developer. Stack: React, TypeScript, APIs REST.
        Modalidad: 100% remoto desde CABA/AMBA. 2+ anos de experiencia.
        Trabajo en equipo con Scrum. Design System y componentes reutilizables.`
    })

    const { score, positives } = scoreOffer(offer, TEST_PROFILE)

    expect(score).toBeGreaterThanOrEqual(70)
    expect(positives).toContain('React')
    expect(positives).toContain('TypeScript')
    expect(positives).toContain('modalidad')
  })

  it('penaliza ofertas de soporte presencial', () => {
    const offer = makeOffer({
      title: 'Tecnico de soporte help desk',
      description: 'Soporte tecnico presencial en empresa de CABA. Atencion de tickets.'
    })

    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)

    expect(score).toBeLessThan(40)
    expect(negatives).toContain('Soporte tecnico')
    expect(negatives).toContain('Presencial')
  })

  it('penaliza ofertas de infraestructura o devops', () => {
    const offer = makeOffer({
      title: 'DevOps Engineer',
      description: 'Infraestructura cloud con Kubernetes y Terraform. Presencial en Buenos Aires.'
    })

    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)

    expect(score).toBeLessThan(40)
    expect(negatives).toContain('DevOps')
  })

  it('no penaliza Semi Senior por una exclusion generica Senior', () => {
    const offer = makeOffer({
      title: 'Frontend Developer Semi Senior React',
      description: 'React, TypeScript, remoto para CABA. 2-3 anos de experiencia.'
    })

    const { score, positives, negatives } = scoreOffer(offer, {
      ...TEST_PROFILE,
      avoid: [...TEST_PROFILE.avoid, 'Senior']
    })

    expect(score).toBeGreaterThanOrEqual(65)
    expect(positives).toContain('seniority: semi senior')
    expect(negatives).not.toContain('Senior')
  })

  it('penaliza seniority demasiado alto para un perfil junior/ssr', () => {
    const offer = makeOffer({
      title: 'Senior Frontend Developer React',
      description: 'React, TypeScript, arquitectura frontend. 7+ anos de experiencia obligatoria.'
    })

    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)

    expect(score).toBeLessThan(65)
    expect(negatives).toContain('seniority alto: senior')
    expect(negatives).toContain('experiencia requerida: 7+ años')
  })

  it('usa el rango explicito de experiencia para penalizar requisitos demasiado altos', () => {
    const offer = makeOffer({
      title: 'Frontend Developer SSR React',
      description: 'React, TypeScript, remoto CABA. 4+ anos de experiencia obligatoria.'
    })

    const { negatives } = scoreOffer(offer, {
      ...TEST_PROFILE,
      experienceYearsMax: 3
    })

    expect(negatives).toContain('experiencia requerida: 4+ años')
  })

  it('penaliza ofertas por debajo del rango minimo de experiencia', () => {
    const offer = makeOffer({
      title: 'Frontend Developer React',
      description: 'React, TypeScript, remoto CABA. 0-1 anos de experiencia.'
    })

    const { negatives } = scoreOffer(offer, TEST_PROFILE)

    expect(negatives).toContain('experiencia por debajo del rango: 1 años')
  })

  it('penaliza salario publicado por debajo de la pretension', () => {
    const offer = makeOffer({
      title: 'Frontend Developer SSR React',
      description: 'React, TypeScript, remoto CABA. 2-3 anos de experiencia.',
      salary: 'USD 1200-1800'
    })

    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)

    expect(score).toBeLessThan(65)
    expect(negatives).toContain('salario debajo de pretensión')
  })

  it('reconoce salario compatible cuando el rango publicado alcanza la pretension', () => {
    const offer = makeOffer({
      title: 'Frontend Developer SSR React',
      description: 'React, TypeScript, remoto CABA. 2-3 anos de experiencia.',
      salary: 'USD 2000-2800'
    })

    const { positives } = scoreOffer(offer, TEST_PROFILE)

    expect(positives).toContain('salario compatible')
  })

  it('no trata Mid-Senior del portal como Senior real si los años son compatibles', () => {
    const offer = makeOffer({
      title: 'Frontend Developer React',
      description: 'LinkedIn seniority: Mid-Senior level. React, TypeScript, remoto CABA. 2-4 anos.'
    })

    const { score, negatives } = scoreOffer(offer, TEST_PROFILE)

    expect(score).toBeGreaterThanOrEqual(65)
    expect(negatives).not.toContain('seniority alto: senior')
  })

  it('no matchea un stack dentro de otra palabra', () => {
    const offer = makeOffer({
      title: 'Reaction time researcher',
      description: 'Estudio de tiempos de reaction en laboratorio. Sin tecnologia web.'
    })

    const { positives } = scoreOffer(offer, TEST_PROFILE)

    expect(positives).not.toContain('React')
  })

  it('sin perfil devuelve score neutro', () => {
    const offer = makeOffer({ title: 'React Developer' })

    expect(scoreOffer(offer).score).toBe(50)
  })

  it('mantiene el score entre 0 y 100', () => {
    const perfect = makeOffer({
      title: 'Frontend React TypeScript Angular',
      description: 'React TypeScript Angular remoto CABA APIs REST Jest Scrum Design System'
    })
    const bad = makeOffer({
      title: 'Soporte help desk',
      description: 'Soporte tecnico presencial Call center DevOps Infraestructura'
    })

    expect(scoreOffer(perfect, TEST_PROFILE).score).toBeLessThanOrEqual(100)
    expect(scoreOffer(bad, TEST_PROFILE).score).toBeGreaterThanOrEqual(0)
  })

  it('no usa datos personales ni texto del CV para puntuar', () => {
    const offer = makeOffer({
      title: 'Frontend React Developer',
      description: 'React, TypeScript, remoto para CABA.'
    })
    const base = scoreOffer(offer, TEST_PROFILE).score

    const withSensitiveData = scoreOffer(offer, {
      ...TEST_PROFILE,
      personalInfo: {
        dni: '12345678',
        email: 'persona@example.com',
        phone: '+54 11 5555-5555',
        address: 'Una direccion privada'
      },
      cvText: 'Angular Angular Angular Senior Senior Senior'
    }).score

    expect(withSensitiveData).toBe(base)
  })
})

describe('classifyByScore', () => {
  it('solo recomienda automaticamente; el resto queda para revision', () => {
    expect(classifyByScore(65)).toBe('recomendada')
    expect(classifyByScore(64)).toBe('detectada')
    expect(classifyByScore(35)).toBe('detectada')
    expect(classifyByScore(34)).toBe('detectada')
    expect(classifyByScore(0)).toBe('detectada')
  })
})
