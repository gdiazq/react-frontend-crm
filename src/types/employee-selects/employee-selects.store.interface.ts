import type { EmployeeSelectOption } from './employee-selects.interface'

export interface EmployeeSelectsStore {
  identificationTypeOptions: EmployeeSelectOption[]
  genderOptions: EmployeeSelectOption[]
  maritalStatusOptions: EmployeeSelectOption[]
  educationLevelOptions: EmployeeSelectOption[]
  driverLicenseOptions: EmployeeSelectOption[]
  professionOptions: EmployeeSelectOption[]
  nationalityOptions: EmployeeSelectOption[]
  expatOptions: EmployeeSelectOption[]
  emergencyContactRelationshipOptions: EmployeeSelectOption[]
  regionOptions: EmployeeSelectOption[]
  communeOptions: EmployeeSelectOption[]
  cityOptions: EmployeeSelectOption[]
  familyAllowanceTierOptions: EmployeeSelectOption[]
  retirementStatusOptions: EmployeeSelectOption[]
  pensionStatusOptions: EmployeeSelectOption[]
  afpOptions: EmployeeSelectOption[]
  healthInsuranceOptions: EmployeeSelectOption[]
  healthInsuranceTariffOptions: EmployeeSelectOption[]
  paymentMethodOptions: EmployeeSelectOption[]
  bankOptions: EmployeeSelectOption[]
  approvalEmployeeStatusOptions: EmployeeSelectOption[]
  hrRequestTypeOptions: EmployeeSelectOption[]
  loadingFormOptions: boolean
  loadingCommuneOptions: boolean
  loadingCityOptions: boolean
  loadingApprovalEmployeeStatusOptions: boolean
  loadingHrRequestTypeOptions: boolean
  formOptionsErrorMessage: string | null
  communeOptionsErrorMessage: string | null
  cityOptionsErrorMessage: string | null
  approvalEmployeeStatusOptionsErrorMessage: string | null
  hrRequestTypeOptionsErrorMessage: string | null
  errorBack: unknown | null
  getFormOptions: () => Promise<void>
  getCommuneOptions: (regionId: number) => Promise<void>
  getCityOptions: (communeId: number) => Promise<void>
  getApprovalEmployeeStatusOptions: () => Promise<void>
  getHrRequestTypeOptions: () => Promise<void>
  clearFormOptionsStatus: () => void
  clearCommuneOptionsStatus: () => void
  clearCityOptionsStatus: () => void
  clearApprovalEmployeeStatusOptionsStatus: () => void
  clearHrRequestTypeOptionsStatus: () => void
  resetLocationOptions: () => void
}
