import { create } from 'zustand'
import { mapperEmployeeSelectOptions } from '@/mappers'
import messages from '@/messages/messages'
import { employeeSelectsService } from '@/services'
import type { EmployeeSelectsStore } from '@/types'

export const useStoreEmployeeSelects = create<EmployeeSelectsStore>()((set) => ({
  identificationTypeOptions: [],
  genderOptions: [],
  maritalStatusOptions: [],
  educationLevelOptions: [],
  driverLicenseOptions: [],
  professionOptions: [],
  nationalityOptions: [],
  expatOptions: [],
  emergencyContactRelationshipOptions: [],
  regionOptions: [],
  communeOptions: [],
  cityOptions: [],
  familyAllowanceTierOptions: [],
  retirementStatusOptions: [],
  pensionStatusOptions: [],
  afpOptions: [],
  healthInsuranceOptions: [],
  healthInsuranceTariffOptions: [],
  paymentMethodOptions: [],
  bankOptions: [],
  loadingFormOptions: false,
  loadingCommuneOptions: false,
  loadingCityOptions: false,
  formOptionsErrorMessage: null,
  communeOptionsErrorMessage: null,
  cityOptionsErrorMessage: null,
  errorBack: null,

  getFormOptions: async () => {
    try {
      set({
        loadingFormOptions: true,
        formOptionsErrorMessage: null,
        errorBack: null,
      })

      const [
        identificationTypes,
        genders,
        maritalStatuses,
        educationLevels,
        driverLicenses,
        professions,
        nationalities,
        expats,
        emergencyRelationships,
        regions,
        familyAllowanceTiers,
        retirementStatuses,
        pensionStatuses,
        afps,
        healthInsurances,
        healthInsuranceTariffs,
        paymentMethods,
        banks,
      ] = await Promise.all([
        employeeSelectsService.getIdentificationTypeOptions(),
        employeeSelectsService.getGenderOptions(),
        employeeSelectsService.getMaritalStatusOptions(),
        employeeSelectsService.getEducationLevelOptions(),
        employeeSelectsService.getDriverLicenseOptions(),
        employeeSelectsService.getProfessionOptions(),
        employeeSelectsService.getNationalityOptions(),
        employeeSelectsService.getExpatOptions(),
        employeeSelectsService.getEmergencyContactRelationshipOptions(),
        employeeSelectsService.getRegionOptions(),
        employeeSelectsService.getFamilyAllowanceTierOptions(),
        employeeSelectsService.getRetirementStatusOptions(),
        employeeSelectsService.getPensionStatusOptions(),
        employeeSelectsService.getAfpOptions(),
        employeeSelectsService.getHealthInsuranceOptions(),
        employeeSelectsService.getHealthInsuranceTariffOptions(),
        employeeSelectsService.getPaymentMethodOptions(),
        employeeSelectsService.getBankOptions(),
      ])

      set({
        identificationTypeOptions: mapperEmployeeSelectOptions(identificationTypes),
        genderOptions: mapperEmployeeSelectOptions(genders),
        maritalStatusOptions: mapperEmployeeSelectOptions(maritalStatuses),
        educationLevelOptions: mapperEmployeeSelectOptions(educationLevels),
        driverLicenseOptions: mapperEmployeeSelectOptions(driverLicenses),
        professionOptions: mapperEmployeeSelectOptions(professions),
        nationalityOptions: mapperEmployeeSelectOptions(nationalities),
        expatOptions: mapperEmployeeSelectOptions(expats),
        emergencyContactRelationshipOptions: mapperEmployeeSelectOptions(emergencyRelationships),
        regionOptions: mapperEmployeeSelectOptions(regions),
        familyAllowanceTierOptions: mapperEmployeeSelectOptions(familyAllowanceTiers),
        retirementStatusOptions: mapperEmployeeSelectOptions(retirementStatuses),
        pensionStatusOptions: mapperEmployeeSelectOptions(pensionStatuses),
        afpOptions: mapperEmployeeSelectOptions(afps),
        healthInsuranceOptions: mapperEmployeeSelectOptions(healthInsurances),
        healthInsuranceTariffOptions: mapperEmployeeSelectOptions(healthInsuranceTariffs),
        paymentMethodOptions: mapperEmployeeSelectOptions(paymentMethods),
        bankOptions: mapperEmployeeSelectOptions(banks),
      })
    } catch (error) {
      if (employeeSelectsService.isAxiosError(error)) {
        set({
          formOptionsErrorMessage: error.response?.data?.message || messages.employees.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({
          formOptionsErrorMessage: messages.employees.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingFormOptions: false })
    }
  },

  getCommuneOptions: async (regionId: number) => {
    try {
      set({
        loadingCommuneOptions: true,
        communeOptionsErrorMessage: null,
        cityOptions: [],
        cityOptionsErrorMessage: null,
      })
      const data = await employeeSelectsService.getCommuneOptions(regionId)
      set({ communeOptions: mapperEmployeeSelectOptions(data) })
    } catch (error) {
      if (employeeSelectsService.isAxiosError(error)) {
        set({
          communeOptionsErrorMessage: error.response?.data?.message || messages.employees.status.errors.loadCommuneOptionsError,
          errorBack: error,
        })
      } else {
        set({
          communeOptionsErrorMessage: messages.employees.status.errors.loadCommuneOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingCommuneOptions: false })
    }
  },

  getCityOptions: async (communeId: number) => {
    try {
      set({
        loadingCityOptions: true,
        cityOptionsErrorMessage: null,
      })
      const data = await employeeSelectsService.getCityOptions(communeId)
      set({ cityOptions: mapperEmployeeSelectOptions(data) })
    } catch (error) {
      if (employeeSelectsService.isAxiosError(error)) {
        set({
          cityOptionsErrorMessage: error.response?.data?.message || messages.employees.status.errors.loadCityOptionsError,
          errorBack: error,
        })
      } else {
        set({
          cityOptionsErrorMessage: messages.employees.status.errors.loadCityOptionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingCityOptions: false })
    }
  },

  clearFormOptionsStatus: () => {
    set({ formOptionsErrorMessage: null })
  },

  clearCommuneOptionsStatus: () => {
    set({ communeOptionsErrorMessage: null })
  },

  clearCityOptionsStatus: () => {
    set({ cityOptionsErrorMessage: null })
  },

  resetLocationOptions: () => {
    set({
      communeOptions: [],
      cityOptions: [],
      communeOptionsErrorMessage: null,
      cityOptionsErrorMessage: null,
    })
  },
}))
