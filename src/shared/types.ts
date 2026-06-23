/**
 * Types shared between main process, preload, and renderer.
 * Must not import Electron or browser-only APIs.
 */

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

// Minimal shape needed by the preload for typing — full types live in renderer
export interface ReadPdfResult {
  success: boolean
  text?: string
  filename?: string
  error?: string
}

export interface CustomPrompts {
  searchInstructions: string | null
  applicationInstructions: string | null
  searchMessage: string | null
  applicationMessage: string | null
}

export interface ServerStatus {
  mcpRunning: boolean
  tunnelRunning: boolean
  tunnelUrl: string | null
}

export interface IElectronAPI {
  getProfile: () => Promise<unknown>
  saveProfile: (profile: unknown) => Promise<void>
  getOffers: () => Promise<unknown[]>
  saveOffers: (offers: unknown[]) => Promise<void>
  getAnswers: () => Promise<unknown[]>
  saveAnswers: (answers: unknown[]) => Promise<void>
  getSettings: () => Promise<unknown>
  saveSettings: (settings: unknown) => Promise<void>

  selectFolder: () => Promise<string | null>
  getDefaultWorkFolder: () => Promise<string>
  selectPdf: () => Promise<ReadPdfResult>
  readPdfFromPath: (filePath: string) => Promise<ReadPdfResult>

  onDataChanged: (cb: (file: string) => void) => void
  offDataChanged: () => void

  getPrompts: () => Promise<CustomPrompts>
  savePrompts: (prompts: CustomPrompts) => Promise<void>

  getHelpRequests: () => Promise<unknown[]>
  resolveHelpRequest: (id: string) => Promise<{ ok: boolean }>

  exportData: () => Promise<{ ok: boolean; path?: string; error?: string }>
  importData: () => Promise<{ ok: boolean; error?: string }>

  serverStatus: () => Promise<ServerStatus>
  serverMcpStart: () => Promise<{ ok: boolean }>
  serverMcpStop: () => Promise<{ ok: boolean }>
  serverTunnelStart: () => Promise<{ ok: boolean }>
  serverTunnelStop: () => Promise<{ ok: boolean }>
  onMcpLog: (cb: (line: string) => void) => void
  offMcpLog: (cb: (line: string) => void) => void
  onTunnelLog: (cb: (line: string) => void) => void
  offTunnelLog: (cb: (line: string) => void) => void
}
