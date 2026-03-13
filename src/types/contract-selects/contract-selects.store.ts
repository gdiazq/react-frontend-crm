import type { ContractSelectOption } from './contract-selects'

export interface ContractSelectsStore {
  employeeWithoutContractOptions: ContractSelectOption[]
  contractTypeFilterOptions: ContractSelectOption[]
  contractStatusFilterOptions: ContractSelectOption[]
  contractTypeOptions: ContractSelectOption[]
  safetyGroupOptions: ContractSelectOption[]
  companyOptions: ContractSelectOption[]
  zoneOptions: ContractSelectOption[]
  jobTitleOptions: ContractSelectOption[]
  siteOptions: ContractSelectOption[]
  laborUnionOptions: ContractSelectOption[]
  mealTypeOptions: ContractSelectOption[]
  transportTypeOptions: ContractSelectOption[]
  loadingContractFilterOptions: boolean
  loadingFormOptions: boolean
  contractFilterOptionsErrorMessage: string | null
  formOptionsErrorMessage: string | null
  errorBack: unknown | null
  getContractFilterOptions: () => Promise<void>
  getFormOptions: () => Promise<void>
  clearContractFilterOptionsStatus: () => void
  clearFormOptionsStatus: () => void
}
