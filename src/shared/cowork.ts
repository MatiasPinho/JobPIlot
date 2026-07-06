/**
 * Tipos de datos compartidos entre el main process y el renderer.
 * Must not import any Electron or browser-only APIs.
 */

export interface SharedProfile {
  targetRole: string
  targetRoles: string[]
  personalInfo: {
    dni: string
    email: string
    phone: string
    address: string
  }
  mainStack: string[]
  secondaryStack: string[]
  targetSeniority: string[]
  experienceYearsMin?: number
  experienceYearsMax?: number
  experience: string
  softSkills: string[]
  salaryCurrency: string
  salaryMin?: number
  salaryMax?: number
  salaryExpectation: string
  availability: string[]
  preferredModality: string[]
  preferredLocation: string[]
  avoid: string[]
  cvPath?: string
  cvText?: string
  updatedAt: string
}

export interface SharedOffer {
  id: string
  title: string
  company: string
  portal: string
  link: string
  description: string
  requirements?: string[]
  modality?: string
  location?: string
  salary?: string
  status: string
  score: number
  notes?: string
}

export interface SharedSettings {
  workFolder: string
  portals: string[]
}
