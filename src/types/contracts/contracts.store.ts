import type {
  ContractCreatePayload,
  ContractDetail,
  ContractUpdatePayload,
  ContractsSortBy,
  ContractsSortDir,
  ContractTableRow,
  ContractsPagination,
  ContractsQueryParams,
} from './contracts.interface'

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
  errorMessage: string | null
  detailErrorMessage: string | null
  createContractErrorMessage: string | null
  createContractSuccessMessage: string | null
  updateContractErrorMessage: string | null
  updateContractSuccessMessage: string | null
  errorBack: unknown | null
  getContracts: () => Promise<void>
  getContractDetail: (contractId: string) => Promise<ContractDetail | null>
  clearContractDetail: () => void
  clearDetailError: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  sortContracts: (sortBy: ContractsSortBy, sortDir: ContractsSortDir) => Promise<void>
  toggleContractStatus: (contractId: string, nextStatus: boolean) => Promise<boolean>
  createContract: (payload: ContractCreatePayload, files?: File[]) => Promise<boolean>
  updateContract: (payload: ContractUpdatePayload, files?: File[]) => Promise<boolean>
  clearCreateContractStatus: () => void
  clearUpdateContractStatus: () => void
  clearStatus: () => void
}
