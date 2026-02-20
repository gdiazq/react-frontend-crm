import axios from 'axios'
import type { DashboardExampleRaw } from '@/types'

export const dashboardService = {
  fetchDashboardExample: async () => {
    const { data } = await axios.get<DashboardExampleRaw>('/db/dashboard/dashboard-example.mock.json')
    return data
  },
}
