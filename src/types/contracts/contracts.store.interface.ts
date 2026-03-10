import type {
  ContractCreatePayload,
  ContractTableRow,
  ContractsPagination,
  ContractsQueryParams,
} from './contracts.interface'

export interface ContractsStore {
  contractsRows: ContractTableRow[]
  pagination: ContractsPagination
  queryParams: ContractsQueryParams
  loadingContracts: boolean
  createContractSubmitting: boolean
  errorMessage: string | null
  createContractErrorMessage: string | null
  createContractSuccessMessage: string | null
  errorBack: unknown | null
  getContracts: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  mutationCreateContract: (payload: ContractCreatePayload, files?: File[]) => Promise<boolean>
  clearCreateContractStatus: () => void
  clearStatus: () => void
}
