import { create } from 'zustand'
import { mapperContractSelectOptions } from '@/mappers'
import messages from '@/messages/messages'
import { contractSelectsService } from '@/services'
import type { ContractSelectsStore } from '@/types'

export const useStoreContractSelects = create<ContractSelectsStore>()((set) => ({
  employeeWithoutContractOptions: [],
  contractTypeFilterOptions: [],
  contractStatusFilterOptions: [],
  contractTypeOptions: [],
  safetyGroupOptions: [],
  companyOptions: [],
  zoneOptions: [],
  jobTitleOptions: [],
  siteOptions: [],
  laborUnionOptions: [],
  mealTypeOptions: [],
  transportTypeOptions: [],
  loadingContractFilterOptions: false,
  loadingFormOptions: false,
  contractFilterOptionsErrorMessage: null,
  formOptionsErrorMessage: null,
  errorBack: null,

  getContractFilterOptions: async () => {
    try {
      set({
        loadingContractFilterOptions: true,
        contractFilterOptionsErrorMessage: null,
        errorBack: null,
      })

      const [contractTypes, contractStatuses] = await Promise.all([
        contractSelectsService.getContractTypeOptions(),
        contractSelectsService.getContractStatusOptions(),
      ])

      set({
        contractTypeFilterOptions: mapperContractSelectOptions(contractTypes),
        contractStatusFilterOptions: mapperContractSelectOptions(contractStatuses),
      })
    } catch (error) {
      if (contractSelectsService.isAxiosError(error)) {
        set({
          contractFilterOptionsErrorMessage: error.response?.data?.message || messages.contracts.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({
          contractFilterOptionsErrorMessage: messages.contracts.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingContractFilterOptions: false })
    }
  },

  getFormOptions: async () => {
    try {
      set({
        loadingFormOptions: true,
        formOptionsErrorMessage: null,
        errorBack: null,
      })

      const [
        employeesWithoutContract,
        contractTypes,
        safetyGroups,
        companies,
        zones,
        jobTitles,
        sites,
        laborUnions,
        mealTypes,
        transportTypes,
      ] = await Promise.all([
        contractSelectsService.getEmployeeWithoutContractOptions(),
        contractSelectsService.getContractTypeOptions(),
        contractSelectsService.getSafetyGroupOptions(),
        contractSelectsService.getCompanyOptions(),
        contractSelectsService.getZoneOptions(),
        contractSelectsService.getJobTitleOptions(),
        contractSelectsService.getSiteOptions(),
        contractSelectsService.getLaborUnionOptions(),
        contractSelectsService.getMealTypeOptions(),
        contractSelectsService.getTransportTypeOptions(),
      ])

      set({
        employeeWithoutContractOptions: mapperContractSelectOptions(employeesWithoutContract),
        contractTypeOptions: mapperContractSelectOptions(contractTypes),
        safetyGroupOptions: mapperContractSelectOptions(safetyGroups),
        companyOptions: mapperContractSelectOptions(companies),
        zoneOptions: mapperContractSelectOptions(zones),
        jobTitleOptions: mapperContractSelectOptions(jobTitles),
        siteOptions: mapperContractSelectOptions(sites),
        laborUnionOptions: mapperContractSelectOptions(laborUnions),
        mealTypeOptions: mapperContractSelectOptions(mealTypes),
        transportTypeOptions: mapperContractSelectOptions(transportTypes),
      })
    } catch (error) {
      if (contractSelectsService.isAxiosError(error)) {
        set({
          formOptionsErrorMessage: error.response?.data?.message || messages.contracts.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({
          formOptionsErrorMessage: messages.contracts.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingFormOptions: false })
    }
  },

  clearFormOptionsStatus: () => {
    set({ formOptionsErrorMessage: null })
  },

  clearContractFilterOptionsStatus: () => {
    set({ contractFilterOptionsErrorMessage: null })
  },
}))
