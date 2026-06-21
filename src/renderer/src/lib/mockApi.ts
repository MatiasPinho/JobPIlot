/**
 * Mock implementation of window.api for browser-only preview mode.
 * Only active when running outside Electron (no contextBridge available).
 */
import type { ElectronAPI } from '../types'
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './mockData'

const store: Record<string, unknown> = {
  profile: DEFAULT_PROFILE,
  offers: [],
  answers: [],
  settings: DEFAULT_SETTINGS
}

export const mockApi: ElectronAPI = {
  getProfile: async () => store.profile as ReturnType<ElectronAPI['getProfile']> extends Promise<infer T> ? T : never,
  saveProfile: async (p) => { store.profile = p },
  getOffers: async () => (store.offers ?? []) as ReturnType<ElectronAPI['getOffers']> extends Promise<infer T> ? T : never,
  saveOffers: async (o) => { store.offers = o },
  getAnswers: async () => (store.answers ?? []) as ReturnType<ElectronAPI['getAnswers']> extends Promise<infer T> ? T : never,
  saveAnswers: async (a) => { store.answers = a },
  getSettings: async () => (store.settings ?? DEFAULT_SETTINGS) as ReturnType<ElectronAPI['getSettings']> extends Promise<infer T> ? T : never,
  saveSettings: async (s) => { store.settings = s },

  selectFolder: async () => null,
  getDefaultWorkFolder: async () => '~/Documents/JobPilot/cowork'
}

export function installMockApiIfNeeded(): void {
  if (typeof window !== 'undefined' && !window.api) {
    (window as Window & { api: ElectronAPI }).api = mockApi
  }
}
