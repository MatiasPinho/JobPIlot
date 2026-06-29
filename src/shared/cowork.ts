/**
 * Tipos de datos compartidos entre el main process y el renderer.
 * Must not import any Electron or browser-only APIs.
 */

export interface SharedProfile {
  targetRole: string
  personalInfo: {
    dni: string
    email: string
    phone: string
    address: string
  }
  mainStack: string[]
  secondaryStack: string[]
  experience: string
  softSkills: string[]
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
