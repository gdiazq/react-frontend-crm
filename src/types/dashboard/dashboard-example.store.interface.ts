import type { DashboardExample } from './dashboard-example.interface'

export interface DashboardExampleStore {
  dashboard: DashboardExample
  loadingDashboard: boolean
  errorMessage: string
  getDashboard: () => Promise<void>
}
