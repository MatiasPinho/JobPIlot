export type JobStatus =
  | 'detectada'
  | 'recomendada'
  | 'aprobada'
  | 'rechazada'
  | 'postulada'
  | 'pendiente_manual'
  | 'pendiente_test'
  | 'error'
  | 'duplicada'

export type View =
  | 'dashboard'
  | 'profile'
  | 'offers'
  | 'tracker'
  | 'answers'
  | 'bridge'
  | 'instructions'
  | 'settings'

export interface UserProfile {
  targetRole: string
  mainStack: string[]
  secondaryStack: string[]
  experience: string
  preferredModality: string[]
  preferredLocation: string[]
  avoid: string[]
  cvPath?: string
  updatedAt: string
}

export interface FrequentAnswer {
  id: string
  question: string
  answer: string
  tags: string[]
  createdAt: string
}

export interface JobOffer {
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
  status: JobStatus
  score: number
  scoreBreakdown?: { positives: string[]; negatives: string[] }
  detectedAt: string
  appliedAt?: string
  result?: string
  notes?: string
  nextAction?: string
  duplicateOf?: string
}

export interface AppSettings {
  workFolder: string
  scoreThresholdRecommended: number
  scoreThresholdReject: number
  portals: string[]
}

export interface DashboardMetrics {
  total: number
  recomendadas: number
  aprobadas: number
  postuladas: number
  pendientes: number
  errores: number
  duplicadas: number
  rechazadas: number
  avgScore: number
  bestPortal: string
}

// ---- IPC API (contextBridge) ----

export interface ElectronAPI {
  getProfile: () => Promise<UserProfile | null>
  saveProfile: (profile: UserProfile) => Promise<void>
  getOffers: () => Promise<JobOffer[]>
  saveOffers: (offers: JobOffer[]) => Promise<void>
  getAnswers: () => Promise<FrequentAnswer[]>
  saveAnswers: (answers: FrequentAnswer[]) => Promise<void>
  getSettings: () => Promise<AppSettings>
  saveSettings: (settings: AppSettings) => Promise<void>

  selectFolder: () => Promise<string | null>
  getDefaultWorkFolder: () => Promise<string>
  selectPdf: () => Promise<{ success: boolean; text?: string; filename?: string; error?: string }>
  readPdfFromPath: (filePath: string) => Promise<{ success: boolean; text?: string; filename?: string; error?: string }>

  onDataChanged: (cb: (file: string) => void) => void
  offDataChanged: () => void

  getPrompts: () => Promise<{ searchInstructions: string | null; applicationInstructions: string | null; searchMessage: string | null; applicationMessage: string | null }>
  savePrompts: (p: { searchInstructions: string | null; applicationInstructions: string | null; searchMessage: string | null; applicationMessage: string | null }) => Promise<void>

  serverStatus: () => Promise<{ mcpRunning: boolean; tunnelRunning: boolean; tunnelUrl: string | null }>
  serverMcpStart: () => Promise<{ ok: boolean }>
  serverMcpStop: () => Promise<{ ok: boolean }>
  serverTunnelStart: () => Promise<{ ok: boolean }>
  serverTunnelStop: () => Promise<{ ok: boolean }>
  onMcpLog: (cb: (line: string) => void) => void
  offMcpLog: (cb: (line: string) => void) => void
  onTunnelLog: (cb: (line: string) => void) => void
  offTunnelLog: (cb: (line: string) => void) => void
}
