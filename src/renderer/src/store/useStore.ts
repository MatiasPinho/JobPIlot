import { create } from 'zustand'
import type {
  UserProfile,
  JobOffer,
  JobStatus,
  AppSettings,
  View,
  DashboardMetrics,
  HelpRequest
} from '../types'
import { scoreOffer, classifyByScore } from '../lib/scoring'
import { detectDuplicates } from '../lib/deduplication'
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from '../lib/mockData'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface AppState {
  // Data
  profile: UserProfile
  offers: JobOffer[]
  settings: AppSettings

  // UI
  activeView: View
  loading: boolean
  notification: Notification | null
  helpRequests: HelpRequest[]

  // Data setters (persist via IPC)
  setProfile: (profile: UserProfile) => Promise<void>
  setOffers: (offers: JobOffer[]) => Promise<void>
  setSettings: (settings: AppSettings) => Promise<void>

  // Offer actions
  updateOffer: (id: string, updates: Partial<JobOffer>) => Promise<void>
  approveOffer: (id: string) => Promise<void>
  rejectOffer: (id: string) => Promise<void>
  markOfferApplied: (id: string) => Promise<void>
  bulkApproveRecommended: () => Promise<void>

  // Import
  importOffers: (raw: unknown[]) => void

  // UI actions
  setActiveView: (view: View) => void
  setLoading: (loading: boolean) => void
  showNotification: (type: Notification['type'], message: string) => void
  clearNotification: () => void

  // Computed
  getDashboardMetrics: () => DashboardMetrics
  getApprovedOffers: () => JobOffer[]

  // Help requests
  reloadHelpRequests: () => Promise<void>
  resolveHelpRequest: (id: string) => Promise<void>

  // Bootstrap
  loadFromStorage: () => Promise<void>
  reloadOffers: () => Promise<void>
}

async function persist<T>(key: string, data: T): Promise<void> {
  try {
    if (key === 'profile') await window.api.saveProfile(data as UserProfile)
    else if (key === 'offers') await window.api.saveOffers(data as JobOffer[])
    else if (key === 'settings') await window.api.saveSettings(data as AppSettings)
  } catch (err) {
    console.error(`Error persisting ${key}:`, err)
  }
}

export const useStore = create<AppState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  offers: [],
  settings: DEFAULT_SETTINGS,
  activeView: 'dashboard',
  loading: false,
  notification: null,
  helpRequests: [],

  setProfile: async (profile) => {
    set({ profile })
    await persist('profile', profile)
  },

  setOffers: async (offers) => {
    set({ offers })
    await persist('offers', offers)
  },

  setSettings: async (settings) => {
    set({ settings })
    await persist('settings', settings)
  },

  updateOffer: async (id, updates) => {
    const offers = get().offers.map((o) => (o.id === id ? { ...o, ...updates } : o))
    set({ offers })
    await persist('offers', offers)
  },

  approveOffer: async (id) => {
    await get().updateOffer(id, { status: 'aprobada' })
  },

  rejectOffer: async (id) => {
    await get().updateOffer(id, { status: 'rechazada' })
  },

  markOfferApplied: async (id) => {
    const offer = get().offers.find((o) => o.id === id)
    if (!offer || offer.status === 'postulada' || offer.status === 'duplicada') return

    await get().updateOffer(id, {
      status: 'postulada',
      appliedAt: new Date().toISOString(),
      result: 'Marcada manualmente como postulada desde JobPilot',
      nextAction: undefined
    })
    get().showNotification('success', `Postulación registrada: ${offer.title}`)
  },

  bulkApproveRecommended: async () => {
    const { settings } = get()
    const offers = get().offers.map((o) =>
      o.status === 'recomendada' ? { ...o, status: 'aprobada' as JobStatus } : o
    )
    set({ offers })
    await persist('offers', offers)
    const count = offers.filter((o) => o.status === 'aprobada').length
    get().showNotification('success', `${count} ofertas aprobadas`)
    // silence settings warning
    void settings
  },

  importOffers: (raw) => {
    const { profile, offers: existing } = get()

    const parsed: JobOffer[] = raw
      .filter((r): r is Record<string, unknown> => typeof r === 'object' && r !== null)
      .map((r, idx) => {
        const id = (r.id as string) || `imported-${Date.now()}-${idx}`
        const offer: JobOffer = {
          id,
          title: String(r.title ?? 'Sin título'),
          company: String(r.company ?? 'Empresa desconocida'),
          portal: String(r.portal ?? 'Desconocido'),
          link: String(r.link ?? ''),
          description: String(r.description ?? ''),
          requirements: Array.isArray(r.requirements)
            ? (r.requirements as string[])
            : [],
          modality: r.modality ? String(r.modality) : undefined,
          location: r.location ? String(r.location) : undefined,
          salary: r.salary ? String(r.salary) : undefined,
          status: 'detectada',
          score: 0,
          detectedAt: new Date().toISOString()
        }
        const { score, positives, negatives } = scoreOffer(offer, profile)
        offer.score = score
        offer.scoreBreakdown = { positives, negatives }
        offer.status = classifyByScore(score)
        return offer
      })

    const { unique, duplicates } = detectDuplicates(parsed, existing)
    const allOffers = [...existing, ...unique, ...duplicates]

    set({ offers: allOffers })
    persist('offers', allOffers)

    get().showNotification(
      'success',
      `${unique.length} oferta(s) importada(s), ${duplicates.length} duplicada(s) detectada(s)`
    )
  },

  setActiveView: (activeView) => set({ activeView }),

  setLoading: (loading) => set({ loading }),

  showNotification: (type, message) => {
    const id = Date.now().toString()
    set({ notification: { id, type, message } })
    setTimeout(() => {
      if (get().notification?.id === id) set({ notification: null })
    }, 4000)
  },

  clearNotification: () => set({ notification: null }),

  getDashboardMetrics: () => {
    const { offers } = get()
    const counts = offers.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    const portalCounts = offers
      .filter((o) => o.status === 'postulada')
      .reduce((acc, o) => {
        acc[o.portal] = (acc[o.portal] ?? 0) + 1
        return acc
      }, {} as Record<string, number>)
    const bestPortal = Object.entries(portalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
    const scored = offers.filter((o) => o.score > 0)
    const avgScore = scored.length ? Math.round(scored.reduce((s, o) => s + o.score, 0) / scored.length) : 0

    return {
      total: offers.length,
      recomendadas: counts['recomendada'] ?? 0,
      aprobadas: counts['aprobada'] ?? 0,
      postuladas: counts['postulada'] ?? 0,
      pendientes: (counts['pendiente_manual'] ?? 0) + (counts['pendiente_test'] ?? 0),
      errores: counts['error'] ?? 0,
      duplicadas: counts['duplicada'] ?? 0,
      rechazadas: counts['rechazada'] ?? 0,
      avgScore,
      bestPortal
    }
  },

  getApprovedOffers: () => get().offers.filter((o) => o.status === 'aprobada'),

  loadFromStorage: async () => {
    try {
      const [profile, offers, settings, helpRequests] = await Promise.all([
        window.api.getProfile(),
        window.api.getOffers(),
        window.api.getSettings(),
        window.api.getHelpRequests()
      ])

      const defaultFolder = await window.api.getDefaultWorkFolder()

      const loadedProfile = {
        ...DEFAULT_PROFILE,
        ...(profile ?? {}),
        personalInfo: {
          ...DEFAULT_PROFILE.personalInfo,
          ...(profile?.personalInfo ?? {})
        }
      }

      set({
        profile: loadedProfile,
        offers: offers ?? [],
        settings: { ...(settings ?? DEFAULT_SETTINGS), workFolder: settings?.workFolder || defaultFolder },
        helpRequests: helpRequests ?? []
      })
    } catch (err) {
      console.error('Error loading from storage:', err)
    }
  },

  // Recarga ofertas desde disco SIN re-persistir (las escribió el MCP server)
  reloadOffers: async () => {
    try {
      const offers = await window.api.getOffers()
      set({ offers: offers ?? [] })
    } catch (err) {
      console.error('Error reloading offers:', err)
    }
  },

  reloadHelpRequests: async () => {
    try {
      const list = await window.api.getHelpRequests()
      set({ helpRequests: list ?? [] })
    } catch (err) {
      console.error('Error reloading help requests:', err)
    }
  },

  resolveHelpRequest: async (id) => {
    await window.api.resolveHelpRequest(id)
    set((s) => ({ helpRequests: s.helpRequests.map((h) => (h.id === id ? { ...h, resolved: true } : h)) }))
  }
}))
