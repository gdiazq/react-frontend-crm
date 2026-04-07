import type { ContractSelectOption } from '../contract-selects'

export interface SettlementSelectsStore {
  legalTerminationCauseOptions: ContractSelectOption[]
  legalTerminationCauseFilterOptions: ContractSelectOption[]
  qualityOfWorkFilterOptions: ContractSelectOption[]
  safetyComplianceFilterOptions: ContractSelectOption[]
  noRehireCauseFilterOptions: ContractSelectOption[]
  qualityOfWorkOptions: ContractSelectOption[]
  safetyComplianceOptions: ContractSelectOption[]
  noRehireCauseOptions: ContractSelectOption[]
  employeeWithContractOptions: ContractSelectOption[]
  contractsByEmployeeOptions: ContractSelectOption[]
  loadingFormOptions: boolean
  loadingFilterOptions: boolean
  loadingContractsByEmployee: boolean
  formOptionsErrorMessage: string | null
  filterOptionsErrorMessage: string | null
  contractsByEmployeeErrorMessage: string | null
  errorBack: unknown | null
  getFormOptions: () => Promise<void>
  getFilterOptions: () => Promise<void>
  getContractsByEmployee: (employeeId: number) => Promise<void>
  clearFormOptionsStatus: () => void
  clearFilterOptionsStatus: () => void
  clearContractsByEmployee: () => void
}
