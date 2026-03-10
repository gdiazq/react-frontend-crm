import type {
  ContractCreatePayload,
  ContractsSortBy,
  ContractsSortDir,
  ContractTableRow,
  ContractsPagination,
  ContractsQueryParams,
} from './contracts.interface'

export interface ContractsStore {
  contractsRows: ContractTableRow[]
  pagination: ContractsPagination
  queryParams: ContractsQueryParams
  loadingContracts: boolean
  loadingToggleStatus: boolean
  createContractSubmitting: boolean
  errorMessage: string | null
  createContractErrorMessage: string | null
  createContractSuccessMessage: string | null
  errorBack: unknown | null
  getContracts: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  sortContracts: (sortBy: ContractsSortBy, sortDir: ContractsSortDir) => Promise<void>
  mutationToggleContractStatus: (contractId: string, nextStatus: boolean) => Promise<boolean>
  mutationCreateContract: (payload: ContractCreatePayload, files?: File[]) => Promise<boolean>
  clearCreateContractStatus: () => void
  clearStatus: () => void
}
