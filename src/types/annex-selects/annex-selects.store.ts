import type { AnnexSelectOption } from './annex-selects'

export interface AnnexSelectsStore {
  employeeWithContractOptions: AnnexSelectOption[]
  annexTypeOptions: AnnexSelectOption[]
  loadingAnnexFormOptions: boolean
  annexFormOptionsErrorMessage: string | null
  errorBack: unknown | null
  getAnnexFormOptions: () => Promise<void>
  clearAnnexFormOptionsStatus: () => void
}
