import type { JobOffer, JobStatus, UserProfile } from '../types'

interface Rule {
  label: string
  points: number
  test: (text: string) => boolean
}

const POSITIVE: Rule[] = [
  { label: 'React', points: 15, test: (t) => /\breact\b/i.test(t) },
  { label: 'TypeScript', points: 12, test: (t) => /\btypescript\b|\bts\b/i.test(t) },
  { label: 'Angular', points: 12, test: (t) => /\bangular\b/i.test(t) },
  { label: 'Frontend', points: 10, test: (t) => /\bfrontend\b|\bfront-end\b|\bfront end\b/i.test(t) },
  { label: 'Remoto', points: 10, test: (t) => /\bremoto\b|\bremote\b|\bwfh\b|\bwork from home\b/i.test(t) },
  { label: 'Híbrido', points: 6, test: (t) => /\bh[ií]brido\b|\bhybrid\b/i.test(t) },
  { label: 'CABA/AMBA', points: 5, test: (t) => /\bcaba\b|\bbuenos aires\b|\bamba\b/i.test(t) },
  { label: 'APIs REST', points: 4, test: (t) => /\bapi\b|\brest\b|\brestful\b/i.test(t) },
  { label: 'Testing', points: 4, test: (t) => /\btesting\b|\bjest\b|\bvitest\b|\bcypress\b|\brtl\b|\bunit test/i.test(t) },
  { label: 'Scrum/Agile', points: 3, test: (t) => /\bscrum\b|\bagile\b|\b[aá]gil\b|\bsprint\b/i.test(t) },
  { label: 'Componentes/Design System', points: 4, test: (t) => /\bdesign system\b|\bcomponent\b|\bcomponente\b|\bui kit\b/i.test(t) },
  { label: 'Vue/Next', points: 5, test: (t) => /\bvue\.?js?\b|\bnuxt\b|\bnext\.?js?\b/i.test(t) },
  { label: 'Salario indicado', points: 3, test: (t) => /\bsalario\b|\bsueldo\b|\bsalary\b|\busd\b|\bars\b|\bcompensac/i.test(t) },
  { label: 'Beneficios', points: 2, test: (t) => /\bbeneficios\b|\bbenefits\b|\bosde\b|\bprepaga\b/i.test(t) },
  { label: 'SSR / Semi-Senior', points: 6, test: (t) => /\bssrr?\b|\bsemi.?senior\b|\bintermediate\b|\b2\+?\s*a[ñn]os?\b|\btre[s3]\s*a[ñn]/i.test(t) },
  { label: 'Git', points: 2, test: (t) => /\bgit\b|\bgithub\b|\bgitlab\b/i.test(t) },
]

const NEGATIVE: Rule[] = [
  { label: 'Seniority muy alto (5+ años)', points: -20, test: (t) => /\b[56789]\+?\s*a[ñn]os?\b|\bsenior\s+(?:de\s+)?[56789]\b/i.test(t) },
  { label: 'Presencial (sin híbrido)', points: -12, test: (t) => /\bpresencial\b/i.test(t) && !/h[ií]brido/i.test(t) },
  { label: 'Backend dominante', points: -15, test: (t) => /\bbackend\s+developer\b|\bbackend\s+engineer\b|\bfull.?stack.*backend\b/i.test(t) && !/frontend/i.test(t) },
  { label: 'Soporte / Help Desk', points: -25, test: (t) => /\bsoporte\b|\bhelp.?desk\b|\bmesa\s+de\s+ayuda\b|\bticket\b/i.test(t) },
  { label: 'Inglés avanzado excluyente', points: -12, test: (t) => /ingl[eé]s\s+avanzado\s+excluyente|advanced\s+english\s+required|english\s+(?:is\s+)?mandatory/i.test(t) },
  { label: 'Descripción muy pobre', points: -8, test: (t) => t.replace(/\s+/g, '').length < 150 },
  { label: 'Infraestructura / DevOps', points: -20, test: (t) => /\bdevops\b|\bsysadmin\b|\binfrastructura\b|\bkubernetes\b|\bterraform\b/i.test(t) && !/frontend/i.test(t) },
]

export interface ScoreBreakdown {
  score: number
  positives: string[]
  negatives: string[]
}

export function scoreOffer(offer: JobOffer, _profile?: UserProfile): ScoreBreakdown {
  const text = [offer.title, offer.company, offer.description, ...(offer.requirements ?? [])].join(' ')

  let score = 30
  const positives: string[] = []
  const negatives: string[] = []

  for (const rule of POSITIVE) {
    if (rule.test(text)) {
      score += rule.points
      positives.push(rule.label)
    }
  }

  for (const rule of NEGATIVE) {
    if (rule.test(text)) {
      score += rule.points
      negatives.push(rule.label)
    }
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    positives,
    negatives
  }
}

export function classifyByScore(
  score: number,
  thresholdRecommended = 65,
  thresholdReject = 35
): Extract<JobStatus, 'recomendada' | 'detectada' | 'rechazada'> {
  if (score >= thresholdRecommended) return 'recomendada'
  if (score >= thresholdReject) return 'detectada'
  return 'rechazada'
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
