import type { ContractSelectOption } from './contract-selects.interface'

export interface ContractSelectsStore {
  employeeWithoutContractOptions: ContractSelectOption[]
  contractTypeOptions: ContractSelectOption[]
  safetyGroupOptions: ContractSelectOption[]
  companyOptions: ContractSelectOption[]
  zoneOptions: ContractSelectOption[]
  jobTitleOptions: ContractSelectOption[]
  siteOptions: ContractSelectOption[]
  laborUnionOptions: ContractSelectOption[]
  mealTypeOptions: ContractSelectOption[]
  transportTypeOptions: ContractSelectOption[]
  loadingFormOptions: boolean
  formOptionsErrorMessage: string | null
  errorBack: unknown | null
  getFormOptions: () => Promise<void>
  clearFormOptionsStatus: () => void
}
