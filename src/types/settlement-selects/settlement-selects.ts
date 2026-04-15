import type { ContractSelectOption } from '../contract-selects'

export interface SettlementSelectsStore {
  quizQuestionGroupOptions: ContractSelectOption[]
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
  loadingQuizQuestionGroupOptions: boolean
  loadingFormOptions: boolean
  loadingFilterOptions: boolean
  loadingContractsByEmployee: boolean
  quizQuestionGroupOptionsErrorMessage: string | null
  formOptionsErrorMessage: string | null
  filterOptionsErrorMessage: string | null
  contractsByEmployeeErrorMessage: string | null
  errorBack: unknown | null
  getQuizQuestionGroupOptions: () => Promise<void>
  getFormOptions: () => Promise<void>
  getFilterOptions: () => Promise<void>
  getContractsByEmployee: (employeeId: number) => Promise<void>
  clearQuizQuestionGroupOptionsStatus: () => void
  clearFormOptionsStatus: () => void
  clearFilterOptionsStatus: () => void
  clearContractsByEmployee: () => void
}
