import type { DashboardExample } from './dashboard-example'

export interface DashboardExampleStore {
  dashboard: DashboardExample
  loadingDashboard: boolean
  errorMessage: string
  getDashboard: () => Promise<void>
}
