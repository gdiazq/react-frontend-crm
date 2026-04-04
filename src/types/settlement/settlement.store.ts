import type { OperationKey, OperationStatus } from '../common'
import type {
  SettlementCreatePayload,
  SettlementDetail,
  SettlementPagination,
  SettlementQueryParams,
  SettlementRaw,
  SettlementSortBy,
  SettlementSortDir,
  SettlementTableRow,
  SettlementUpdatePayload,
} from './settlement'

export interface SettlementStore {
  settlementRaw: SettlementRaw[]
  settlementDetail: SettlementDetail | null
  settlementRows: SettlementTableRow[]
  pagination: SettlementPagination
  queryParams: SettlementQueryParams
  loadingSettlements: boolean
  loadingSettlementDetail: boolean
  createSettlementSubmitting: boolean
  updateSettlementSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>

  getSettlements: () => Promise<void>
  getSettlementDetail: (id: string) => Promise<SettlementDetail | null>
  goToPage: (page: number) => Promise<void>
  setSearch: (value: string) => void
  setStatusFilter: (status: string) => void
  setEmployeeIdFilter: (employeeId: string) => void
  setLegalTerminationCauseIdFilter: (causeId: string) => void
  setRehireEligibleFilter: (rehireEligible: string) => void
  setEndDateRange: (range: { endDateFrom: string; endDateTo: string }) => void
  setCreatedDateRange: (range: { createdFrom: string; createdTo: string }) => void
  clearStatusFilter: () => void
  clearEmployeeIdFilter: () => void
  clearLegalTerminationCauseIdFilter: () => void
  clearRehireEligibleFilter: () => void
  clearEndDateRange: () => void
  clearCreatedDateRange: () => void
  searchSettlements: () => Promise<void>
  sortSettlements: (sortBy: SettlementSortBy, sortDir: SettlementSortDir) => Promise<void>
  clearSettlementDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  createSettlement: (payload: SettlementCreatePayload, files?: File[]) => Promise<boolean>
  updateSettlement: (payload: SettlementUpdatePayload, files?: File[]) => Promise<boolean>
}
