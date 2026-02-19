import { create } from 'zustand'
import axios from 'axios'
import { initialDashboardExample } from '@/factories'
import { mapperDashboardExample } from '@/mappers'
import messages from '@/messages/messages'
import type { DashboardExample, DashboardExampleRaw } from '@/types'

interface DashboardExampleStore {
  dashboard: DashboardExample
  loadingDashboard: boolean
  errorMessage: string
  getDashboard: () => Promise<void>
}

export const useStoreDashboardExample = create<DashboardExampleStore>()((set) => ({
  dashboard: { ...initialDashboardExample },
  loadingDashboard: false,
  errorMessage: '',

  getDashboard: async () => {
    try {
      set({ loadingDashboard: true, errorMessage: '' })
      const { data } = await axios.get<DashboardExampleRaw>('/db/dashboard/dashboard-example.mock.json')
      set({ dashboard: mapperDashboardExample(data) })
    } catch {
      set({ errorMessage: messages.dashboard.loadError })
    } finally {
      set({ loadingDashboard: false })
    }
  },
}))
