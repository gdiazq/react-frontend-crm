import type {
  ContractCreatePayload,
  ContractDetail,
  ContractUpdatePayload,
  ContractsSortBy,
  ContractsSortDir,
  ContractTableRow,
  ContractsPagination,
  ContractsQueryParams,
} from './contracts'
import type { OperationKey, OperationStatus } from '../common'

export interface ContractsStore {
  contractsRows: ContractTableRow[]
  contractDetail: ContractDetail | null
  pagination: ContractsPagination
  queryParams: ContractsQueryParams
  loadingContracts: boolean
  loadingContractDetail: boolean
  loadingToggleStatus: boolean
  createContractSubmitting: boolean
  updateContractSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getContracts: () => Promise<void>
  getContractDetail: (contractId: string) => Promise<ContractDetail | null>
  clearContractDetail: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setEmployeeFilter: (employeeId: string) => void
  setStatusFilter: (statusId: string) => void
  setContractStatusFilter: (contractStatusId: string) => void
  setContractTypeFilter: (contractTypeId: string) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  setStartDateRange: (payload: { startDateFrom: string, startDateTo: string }) => void
  setEndDateRange: (payload: { endDateFrom: string, endDateTo: string }) => void
  setUpdatedDateRange: (payload: { updatedFrom: string, updatedTo: string }) => void
  clearEmployeeFilter: () => void
  clearStatusFilter: () => void
  clearContractStatusFilter: () => void
  clearContractTypeFilter: () => void
  clearCreatedDateRange: () => void
  clearStartDateRange: () => void
  clearEndDateRange: () => void
  clearUpdatedDateRange: () => void
  searchContracts: () => Promise<void>
  sortContracts: (sortBy: ContractsSortBy, sortDir: ContractsSortDir) => Promise<void>
  toggleContractStatus: (contractId: string, nextStatus: boolean) => Promise<boolean>
  createContract: (payload: ContractCreatePayload, files?: File[]) => Promise<boolean>
  updateContract: (payload: ContractUpdatePayload, files?: File[]) => Promise<boolean>
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
