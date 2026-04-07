import { create } from 'zustand'
import { mapperContractSelectOptions } from '@/mappers'
import messages from '@/messages/messages'
import { settlementSelectsService } from '@/services'
import type { SettlementSelectsStore } from '@/types'

export const useStoreSettlementSelects = create<SettlementSelectsStore>()((set) => ({
  legalTerminationCauseOptions: [],
  legalTerminationCauseFilterOptions: [],
  qualityOfWorkFilterOptions: [],
  safetyComplianceFilterOptions: [],
  noRehireCauseFilterOptions: [],
  qualityOfWorkOptions: [],
  safetyComplianceOptions: [],
  noRehireCauseOptions: [],
  employeeWithContractOptions: [],
  contractsByEmployeeOptions: [],
  loadingFormOptions: false,
  loadingFilterOptions: false,
  loadingContractsByEmployee: false,
  formOptionsErrorMessage: null,
  filterOptionsErrorMessage: null,
  contractsByEmployeeErrorMessage: null,
  errorBack: null,

  getFormOptions: async () => {
    try {
      set({ loadingFormOptions: true, formOptionsErrorMessage: null, errorBack: null })

      const [
        legalTerminationCauses,
        qualityOfWork,
        safetyCompliance,
        noRehireCauses,
        employeesWithContract,
      ] = await Promise.all([
        settlementSelectsService.getLegalTerminationCauseOptions(),
        settlementSelectsService.getQualityOfWorkOptions(),
        settlementSelectsService.getSafetyComplianceOptions(),
        settlementSelectsService.getNoRehireCauseOptions(),
        settlementSelectsService.getEmployeeWithContractOptions(),
      ])

      set({
        legalTerminationCauseOptions: mapperContractSelectOptions(legalTerminationCauses),
        qualityOfWorkOptions: mapperContractSelectOptions(qualityOfWork),
        safetyComplianceOptions: mapperContractSelectOptions(safetyCompliance),
        noRehireCauseOptions: mapperContractSelectOptions(noRehireCauses),
        employeeWithContractOptions: mapperContractSelectOptions(employeesWithContract),
      })
    } catch (error) {
      if (settlementSelectsService.isAxiosError(error)) {
        set({
          formOptionsErrorMessage: error.response?.data?.message || messages.settlement.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({
          formOptionsErrorMessage: messages.settlement.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingFormOptions: false })
    }
  },

  getContractsByEmployee: async (employeeId: number) => {
    try {
      set({ loadingContractsByEmployee: true, contractsByEmployeeErrorMessage: null })
      const contracts = await settlementSelectsService.getContractsByEmployeeOptions(employeeId)
      set({ contractsByEmployeeOptions: mapperContractSelectOptions(contracts) })
    } catch (error) {
      if (settlementSelectsService.isAxiosError(error)) {
        set({
          contractsByEmployeeErrorMessage: error.response?.data?.message || messages.settlement.status.errors.loadFormOptionsError,
        })
      } else {
        set({ contractsByEmployeeErrorMessage: messages.settlement.status.errors.loadFormOptionsError })
      }
      set({ contractsByEmployeeOptions: [] })
    } finally {
      set({ loadingContractsByEmployee: false })
    }
  },

  clearFormOptionsStatus: () => {
    set({ formOptionsErrorMessage: null })
  },

  getFilterOptions: async () => {
    try {
      set({ loadingFilterOptions: true, filterOptionsErrorMessage: null, errorBack: null })
      const [
        legalTerminationCauses,
        qualityOfWork,
        safetyCompliance,
        noRehireCauses,
      ] = await Promise.all([
        settlementSelectsService.getLegalTerminationCauseOptions(),
        settlementSelectsService.getQualityOfWorkOptions(),
        settlementSelectsService.getSafetyComplianceOptions(),
        settlementSelectsService.getNoRehireCauseOptions(),
      ])
      set({
        legalTerminationCauseFilterOptions: mapperContractSelectOptions(legalTerminationCauses),
        qualityOfWorkFilterOptions: mapperContractSelectOptions(qualityOfWork),
        safetyComplianceFilterOptions: mapperContractSelectOptions(safetyCompliance),
        noRehireCauseFilterOptions: mapperContractSelectOptions(noRehireCauses),
      })
    } catch (error) {
      if (settlementSelectsService.isAxiosError(error)) {
        set({
          filterOptionsErrorMessage: error.response?.data?.message || messages.settlement.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({
          filterOptionsErrorMessage: messages.settlement.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingFilterOptions: false })
    }
  },

  clearFilterOptionsStatus: () => {
    set({ filterOptionsErrorMessage: null })
  },

  clearContractsByEmployee: () => {
    set({ contractsByEmployeeOptions: [], contractsByEmployeeErrorMessage: null })
  },
}))
