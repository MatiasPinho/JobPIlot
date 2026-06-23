/**
 * Mock implementation of window.api for browser-only preview mode.
 * Only active when running outside Electron (no contextBridge available).
 */
import type { ElectronAPI, UserProfile, JobOffer, FrequentAnswer, AppSettings, HelpRequest } from '../types'
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './mockData'

const store = {
  profile: DEFAULT_PROFILE as UserProfile,
  offers: [] as JobOffer[],
  answers: [] as FrequentAnswer[],
  settings: DEFAULT_SETTINGS as AppSettings,
  prompts: { searchInstructions: null, applicationInstructions: null, searchMessage: null, applicationMessage: null },
  help: [] as HelpRequest[]
}

export const mockApi: ElectronAPI = {
  getProfile: async () => store.profile,
  saveProfile: async (p) => { store.profile = p },
  getOffers: async () => store.offers,
  saveOffers: async (o) => { store.offers = o },
  getAnswers: async () => store.answers,
  saveAnswers: async (a) => { store.answers = a },
  getSettings: async () => store.settings,
  saveSettings: async (s) => { store.settings = s },

  selectFolder: async () => null,
  getDefaultWorkFolder: async () => '~/Documents/JobPilot/cowork',
  selectPdf: async () => ({ success: false, error: 'Solo disponible en la app de escritorio' }),
  readPdfFromPath: async () => ({ success: false, error: 'Solo disponible en la app de escritorio' }),

  onDataChanged: () => {},
  offDataChanged: () => {},

  getPrompts: async () => store.prompts,
  savePrompts: async (p) => { store.prompts = p },

  getHelpRequests: async () => store.help,
  resolveHelpRequest: async (id) => {
    store.help = store.help.map((h) => (h.id === id ? { ...h, resolved: true } : h))
    return { ok: true }
  },

  serverStatus: async () => ({ mcpRunning: false, tunnelRunning: false, tunnelUrl: null }),
  serverMcpStart: async () => ({ ok: false }),
  serverMcpStop: async () => ({ ok: false }),
  serverTunnelStart: async () => ({ ok: false }),
  serverTunnelStop: async () => ({ ok: false }),
  onMcpLog: () => {},
  offMcpLog: () => {},
  onTunnelLog: () => {},
  offTunnelLog: () => {}
}

export function installMockApiIfNeeded(): void {
  if (typeof window !== 'undefined' && !window.api) {
    ;(window as Window & { api: ElectronAPI }).api = mockApi
  }
}
