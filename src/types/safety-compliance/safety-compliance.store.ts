import type {
  SafetyComplianceCreatePayload,
  SafetyComplianceDetail,
  SafetyCompliancePagination,
  SafetyComplianceQueryParams,
  SafetyComplianceRaw,
  SafetyComplianceSortBy,
  SafetyComplianceSortDir,
  SafetyComplianceTableRow,
  SafetyComplianceUpdatePayload,
} from './safety-compliance'
import type { OperationKey, OperationStatus } from '../common'

export interface SafetyComplianceStore {
  safetyComplianceRaw: SafetyComplianceRaw[]
  safetyComplianceDetail: SafetyComplianceDetail | null
  safetyComplianceRows: SafetyComplianceTableRow[]
  pagination: SafetyCompliancePagination
  queryParams: SafetyComplianceQueryParams
  loadingSafetyCompliance: boolean
  loadingSafetyComplianceDetail: boolean
  createSafetyComplianceSubmitting: boolean
  updateSafetyComplianceSubmitting: boolean
  loadingToggleStatus: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getSafetyCompliance: () => Promise<void>
  getSafetyComplianceDetail: (id: string) => Promise<SafetyComplianceDetail | null>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setActiveFilter: (active: string) => void
  setCreatedDateRange: (value: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (value: { updatedFrom: string, updatedTo: string }) => void
  clearActiveFilter: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchSafetyCompliance: () => Promise<void>
  sortSafetyCompliance: (sortBy: SafetyComplianceSortBy, sortDir: SafetyComplianceSortDir) => Promise<void>
  createSafetyCompliance: (payload: SafetyComplianceCreatePayload) => Promise<boolean>
  updateSafetyCompliance: (payload: SafetyComplianceUpdatePayload) => Promise<boolean>
  toggleSafetyComplianceStatus: (id: string, nextStatus: boolean) => Promise<boolean>
  clearSafetyComplianceDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
