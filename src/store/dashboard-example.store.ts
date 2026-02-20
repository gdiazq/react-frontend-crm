import { create } from 'zustand'
import { dashboardService } from '@/services'
import { initialDashboardExample } from '@/factories'
import { mapperDashboardExample } from '@/mappers'
import messages from '@/messages/messages'
import type { DashboardExampleStore } from '@/types'

export const useStoreDashboardExample = create<DashboardExampleStore>()((set) => ({
  dashboard: { ...initialDashboardExample },
  loadingDashboard: false,
  errorMessage: '',

  getDashboard: async () => {
    try {
      set({ loadingDashboard: true, errorMessage: '' })
      const data = await dashboardService.fetchDashboardExample()
      set({ dashboard: mapperDashboardExample(data) })
    } catch {
      set({ errorMessage: messages.dashboard.status.errors.loadError })
    } finally {
      set({ loadingDashboard: false })
    }
  },
}))
