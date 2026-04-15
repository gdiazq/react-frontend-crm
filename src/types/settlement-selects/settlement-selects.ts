import type { ContractSelectOption } from '../contract-selects'

export interface SettlementQuizQuestionGroupItem {
  id: number
  name: string
}

export interface SettlementQuizQuestionGroup {
  groupId: number
  groupName: string
  questions: SettlementQuizQuestionGroupItem[]
}

export interface SettlementSelectsStore {
  quizQuestionGroupOptions: ContractSelectOption[]
  terminationQuizQuestionGroups: SettlementQuizQuestionGroup[]
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
  loadingTerminationQuizQuestionGroups: boolean
  loadingEmployeeWithContractOptions: boolean
  loadingFormOptions: boolean
  loadingFilterOptions: boolean
  loadingContractsByEmployee: boolean
  quizQuestionGroupOptionsErrorMessage: string | null
  terminationQuizQuestionGroupsErrorMessage: string | null
  employeeWithContractOptionsErrorMessage: string | null
  formOptionsErrorMessage: string | null
  filterOptionsErrorMessage: string | null
  contractsByEmployeeErrorMessage: string | null
  errorBack: unknown | null
  getQuizQuestionGroupOptions: () => Promise<void>
  getTerminationQuizQuestionGroups: (employeeId: number) => Promise<void>
  getEmployeeWithContractOptions: () => Promise<void>
  getFormOptions: () => Promise<void>
  getFilterOptions: () => Promise<void>
  getContractsByEmployee: (employeeId: number) => Promise<void>
  clearQuizQuestionGroupOptionsStatus: () => void
  clearTerminationQuizQuestionGroups: () => void
  clearTerminationQuizQuestionGroupsStatus: () => void
  clearEmployeeWithContractOptionsStatus: () => void
  clearFormOptionsStatus: () => void
  clearFilterOptionsStatus: () => void
  clearContractsByEmployee: () => void
}
