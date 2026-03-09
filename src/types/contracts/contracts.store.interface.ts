import type { ContractTableRow, ContractsPagination, ContractsQueryParams } from './contracts.interface'

export interface ContractsStore {
  contractsRows: ContractTableRow[]
  pagination: ContractsPagination
  queryParams: ContractsQueryParams
  loadingContracts: boolean
  errorMessage: string | null
  errorBack: unknown | null
  getContracts: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  clearStatus: () => void
}
