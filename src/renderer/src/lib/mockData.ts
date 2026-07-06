import type { JobOffer, UserProfile, AppSettings } from '../types'

export const DEFAULT_AVOID_FILTERS = [
  'MLM',
  'Ventas a comisión pura sin sueldo base',
  'Inversión inicial',
  'Reviews negativos visibles',
  'Zona muy alejada no remota',
  'Inglés superior a B1',
  'Senior 5+ años',
  'Lead',
  'Staff',
  'Principal',
  'G&L GROUP'
]

export const DEFAULT_STACK: string[] = []
export const DEFAULT_SOFT_SKILLS = ['Trabajo en equipo', 'Comunicación con clientes y equipos técnicos', 'Adaptabilidad']
export const DEFAULT_TARGET_SENIORITY = ['Junior', 'Semi Senior', 'SSR']

export function parseTargetRoles(value: string | undefined): string[] {
  return (value ?? '')
    .split(/[,;\n/]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function parseDecimal(value: string): number | undefined {
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseMoney(value: string): number | undefined {
  const compact = value.replace(/\s+/g, '')
  const normalized = compact.includes(',') && !compact.includes('.')
    ? compact.replace(',', '.')
    : compact.replace(/[.,]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function parseExperienceYears(value: string | undefined): { min?: number; max?: number } {
  const text = value ?? ''
  const match = text.match(/(\d{1,2}(?:[,.]\d+)?)\s*(?:\+|[-\u2013]\s*(\d{1,2}(?:[,.]\d+)?))?/)
  if (!match) return {}

  return {
    min: parseDecimal(match[1]),
    max: match[2] ? parseDecimal(match[2]) : undefined
  }
}

export function parseSalaryExpectation(value: string | undefined): { currency: string; min?: number; max?: number } {
  const text = value ?? ''
  const currencyMatch = text.match(/(USD|ARS|EUR|US\$|U\$S|\$)/i)
  const rawCurrency = currencyMatch?.[1] ?? 'USD'
  const currency = rawCurrency === '$' ? 'ARS' : rawCurrency.replace(/^US\$|^U\$S$/i, 'USD').toUpperCase()
  const numbers = [...text.matchAll(/\d[\d.,]*/g)]
    .map((match) => parseMoney(match[0]))
    .filter((number): number is number => typeof number === 'number')

  return { currency, min: numbers[0], max: numbers[1] }
}

export function formatExperienceYearsRange(profile: Pick<UserProfile, 'experienceYearsMin' | 'experienceYearsMax' | 'experience'>): string {
  const min = profile.experienceYearsMin
  const max = profile.experienceYearsMax
  if (typeof min === 'number' && typeof max === 'number') return min === max ? `${min} años` : `${min}-${max} años`
  if (typeof min === 'number') return `${min}+ años`
  if (typeof max === 'number') return `hasta ${max} años`
  return profile.experience?.trim() || 'No definido'
}

export function formatSalaryRange(profile: Pick<UserProfile, 'salaryCurrency' | 'salaryMin' | 'salaryMax' | 'salaryExpectation'>): string {
  const parsed = parseSalaryExpectation(profile.salaryExpectation)
  const currency = profile.salaryCurrency || parsed.currency || 'USD'
  const min = profile.salaryMin
  const max = profile.salaryMax
  if (typeof min === 'number' && typeof max === 'number') return min === max ? `${currency} ${min}` : `${currency} ${min}-${max}`
  if (typeof min === 'number') return `${currency} ${min} como mínimo`
  if (typeof max === 'number') return `hasta ${currency} ${max}`
  return profile.salaryExpectation?.trim() || 'No definido'
}

/** Perfil base — el usuario completa identidad/stack y conserva filtros seguros */
export const DEFAULT_PROFILE: UserProfile = {
  targetRole: '',
  targetRoles: [],
  personalInfo: {
    dni: '',
    email: '',
    phone: '',
    address: ''
  },
  mainStack: [...DEFAULT_STACK],
  secondaryStack: [],
  targetSeniority: [...DEFAULT_TARGET_SENIORITY],
  experienceYearsMin: undefined,
  experienceYearsMax: undefined,
  experience: '',
  softSkills: [...DEFAULT_SOFT_SKILLS],
  salaryCurrency: 'USD',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryExpectation: '',
  availability: ['Full-time'],
  preferredModality: [],
  preferredLocation: [],
  avoid: [...DEFAULT_AVOID_FILTERS],
  updatedAt: new Date().toISOString()
}

/** Perfil de ejemplo — solo para el botón "Cargar datos de prueba" en Settings */
export const MOCK_PROFILE: UserProfile = {
  targetRole: 'Frontend Developer SSR',
  targetRoles: ['Frontend Developer', 'React Developer', 'Angular Developer'],
  personalInfo: {
    dni: '',
    email: '',
    phone: '',
    address: ''
  },
  mainStack: ['React', 'TypeScript', 'Angular', 'APIs REST', 'Jest / React Testing Library'],
  secondaryStack: [],
  targetSeniority: [...DEFAULT_TARGET_SENIORITY],
  experienceYearsMin: 2,
  experienceYearsMax: 4,
  experience: '2+ años de experiencia en desarrollo frontend',
  softSkills: [...DEFAULT_SOFT_SKILLS],
  salaryCurrency: 'USD',
  salaryMin: 2000,
  salaryMax: 2800,
  salaryExpectation: 'USD 2000 como mínimo',
  availability: ['Full-time'],
  preferredModality: ['Remoto', 'Híbrido'],
  preferredLocation: ['CABA', 'AMBA'],
  avoid: [
    'Soporte puro / Help Desk',
    'Backend dominante',
    'Presencial fuera de CABA/AMBA',
    'Senior 5+ años obligatorio',
    'Inglés avanzado excluyente',
    ...DEFAULT_AVOID_FILTERS
  ],
  updatedAt: new Date().toISOString()
}

export const DEFAULT_SETTINGS: AppSettings = {
  workFolder: '',
  portals: ['LinkedIn', 'Bumeran', 'Zonajobs', 'GetOnBoard', 'Computrabajo']
}

export const MOCK_OFFERS: JobOffer[] = [
  {
    id: 'offer-1',
    title: 'Frontend Developer SSR - React + TypeScript',
    company: 'Mercado Libre',
    portal: 'LinkedIn',
    link: 'https://www.linkedin.com/jobs/view/frontend-ssr-1',
    description: `Buscamos un Frontend Developer Semi-Senior para sumarse a nuestro equipo de productos.
Stack: React, TypeScript, componentes reutilizables.
Modalidad: 100% remoto desde CABA/AMBA.
Salario: USD 2000-2800.
Experiencia requerida: 2-3 años.
Participación activa en ceremonias Scrum. Testing con Jest.
Beneficios: OSDE 410, bonos, home office allowance.`,
    requirements: ['React', 'TypeScript', '2+ años de experiencia', 'Jest/Testing', 'Scrum'],
    modality: 'Remoto',
    location: 'CABA',
    salary: 'USD 2000-2800',
    status: 'recomendada',
    score: 88,
    scoreBreakdown: {
      positives: ['React', 'TypeScript', 'Frontend', 'Remoto', 'CABA/AMBA', 'Testing', 'Scrum', 'Salario indicado', 'Beneficios', 'SSR / Semi-Senior'],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'offer-2',
    title: 'Angular Developer SSR',
    company: 'Accenture',
    portal: 'GetOnBoard',
    link: 'https://getonboard.com/jobs/angular-ssr-2',
    description: `Posición de Angular Developer Semi Senior para proyecto bancario enterprise.
Stack principal: Angular 17+, TypeScript, RxJS.
Secundario: APIs REST, testing unitario, diseño de componentes.
Modalidad: Híbrido (3 días oficina, 2 remoto) - CABA.
Rango salarial: ARS + bonos. 2-4 años de experiencia en Angular.
Metodología Scrum. Beneficios prepaga y capacitaciones.`,
    requirements: ['Angular', 'TypeScript', 'RxJS', '2-4 años', 'APIs REST'],
    modality: 'Híbrido',
    location: 'CABA',
    status: 'recomendada',
    score: 79,
    scoreBreakdown: {
      positives: ['TypeScript', 'Angular', 'Frontend', 'Híbrido', 'CABA/AMBA', 'APIs REST', 'Testing', 'Scrum', 'Componentes/Design System', 'SSR / Semi-Senior'],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'offer-3',
    title: 'React Developer - Startup Fintech',
    company: 'Ualá',
    portal: 'Bumeran',
    link: 'https://bumeran.com.ar/empleos/react-3',
    description: `Startup fintech en crecimiento busca React Developer.
Trabajarás en el desarrollo de la app web con React y Redux.
Modalidad remota, equipo distribuido.
Experiencia: 1-3 años. Stack: React, TypeScript, Redux.
No se requiere inglés avanzado.`,
    requirements: ['React', 'Redux', 'TypeScript'],
    modality: 'Remoto',
    location: 'Buenos Aires',
    status: 'aprobada',
    score: 72,
    scoreBreakdown: {
      positives: ['React', 'TypeScript', 'Frontend', 'Remoto', 'CABA/AMBA'],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'offer-4',
    title: 'Técnico de Soporte IT - Help Desk',
    company: 'Telecom Argentina',
    portal: 'Computrabajo',
    link: 'https://computrabajo.com.ar/soporte-4',
    description: `Buscamos Técnico de Soporte para atención de tickets y mesa de ayuda.
Presencial en oficinas de Palermo. Help desk nivel 1 y 2.
No se requiere experiencia en desarrollo de software.`,
    requirements: ['Soporte técnico', 'Windows', 'Office'],
    modality: 'Presencial',
    location: 'Palermo, CABA',
    status: 'rechazada',
    score: 8,
    scoreBreakdown: {
      positives: ['CABA/AMBA'],
      negatives: ['Soporte / Help Desk', 'Presencial (sin híbrido)', 'Descripción muy pobre']
    },
    detectedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'offer-5',
    title: 'Senior Frontend Developer - 7 años exp.',
    company: 'GlobalTech',
    portal: 'LinkedIn',
    link: 'https://linkedin.com/jobs/senior-5',
    description: `Posición Senior para liderazgo técnico en equipo de frontend.
React, TypeScript, arquitectura frontend. 7+ años de experiencia obligatoria.
Inglés avanzado excluyente. Presencial en CABA 5 días.`,
    requirements: ['React', 'TypeScript', '7+ años', 'Inglés avanzado excluyente'],
    modality: 'Presencial',
    location: 'CABA',
    status: 'rechazada',
    score: 22,
    scoreBreakdown: {
      positives: ['React', 'TypeScript', 'Frontend', 'CABA/AMBA'],
      negatives: ['Seniority muy alto (5+ años)', 'Presencial (sin híbrido)', 'Inglés avanzado excluyente']
    },
    detectedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'offer-6',
    title: 'Frontend Developer React - DUPLICADA',
    company: 'Mercado Libre',
    portal: 'Zonajobs',
    link: 'https://zonajobs.com.ar/meli-frontend-dup',
    description: `Buscamos Frontend Developer React para equipo de productos. Modalidad remota.
TypeScript, componentes, 2-3 años de experiencia.`,
    requirements: ['React', 'TypeScript'],
    modality: 'Remoto',
    location: 'CABA',
    status: 'duplicada',
    score: 75,
    duplicateOf: 'offer-1',
    detectedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'offer-7',
    title: 'React Frontend Developer SSR',
    company: 'Naranja X',
    portal: 'GetOnBoard',
    link: 'https://getonboard.com/jobs/naranjax-7',
    description: `Naranja X busca un Frontend Developer para trabajar en nuestra plataforma fintech.
React, TypeScript, design system propio. Modalidad remota desde Argentina.
2-4 años de experiencia. Salario USD competitivo + beneficios.
Testing con React Testing Library. APIs REST. Scrum/Kanban.`,
    requirements: ['React', 'TypeScript', 'Testing', 'APIs REST'],
    modality: 'Remoto',
    location: 'Argentina',
    status: 'postulada',
    score: 85,
    scoreBreakdown: {
      positives: ['React', 'TypeScript', 'Frontend', 'Remoto', 'APIs REST', 'Testing', 'Scrum/Agile', 'Componentes/Design System', 'Salario indicado', 'Beneficios'],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    result: 'Postulación enviada correctamente. En espera de respuesta.',
    nextAction: 'Hacer seguimiento en 5 días'
  },
  {
    id: 'offer-8',
    title: 'Frontend Developer - Vue.js',
    company: 'Despegar',
    portal: 'LinkedIn',
    link: 'https://linkedin.com/jobs/despegar-8',
    description: `Despegar busca Frontend Developer con Vue.js y TypeScript.
Trabajo remoto desde CABA. APIs REST, testing, componentes.
2-3 años de experiencia. Stack: Vue 3, Nuxt, TypeScript.`,
    requirements: ['Vue.js', 'TypeScript', 'Nuxt'],
    modality: 'Remoto',
    location: 'CABA',
    status: 'detectada',
    score: 58,
    scoreBreakdown: {
      positives: ['TypeScript', 'Frontend', 'Remoto', 'CABA/AMBA', 'Vue/Next', 'APIs REST'],
      negatives: []
    },
    detectedAt: new Date().toISOString()
  }
]
