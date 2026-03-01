export interface EmployeeRaw {
  id: number
  identification: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  corporateEmail: string
  phone?: string | null
  statusName: string
  active: boolean
  rehireEligible: boolean
  createdAt: string
  updatedAt: string
}

export interface EmployeeCreateForm {
  identification: string
  identificationTypeId: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  birthDate: string
  genderId: string
  maritalStatusId: string
  educationLevelId: string
  driverLicenseId: string
  professionId: string
  personalEmail: string
  corporateEmail: string
  phone: string
  phone2: string
  emergencyContactName: string
  emergencyContactRelationshipId: string
  emergencyContactPhone: string
  emergencyContactPhone2: string
  streetName: string
  streetNumber: string
  postalCode: string
  department: string
  village: string
  block: string
  regionId: string
  communeId: string
  cityId: string
  expatId: string
  nationalityId: string
  familyAllowanceTierId: string
  retirementStatusId: string
  isapreFun: string
  pensionStatusId: string
  afpId: string
  healthInsuranceId: string
  healthInsuranceTariffId: string
  healthInsuranceUF: string
  healthInsurancePesos: string
  paymentMethodId: string
  bankId: string
  bankAccount: string
  clothingSize: string
  shoeSize: string
  pantSize: string
}

export interface EmployeeCreatePayload {
  identification: string
  identificationTypeId: number
  firstName: string
  paternalLastName: string
  maternalLastName: string
  birthDate: string
  genderId: number
  maritalStatusId: number
  educationLevelId: number
  driverLicenseId: number
  professionId: number
  personalEmail: string
  corporateEmail: string
  phone: string
  phone2: string | null
  emergencyContactName: string
  emergencyContactRelationshipId: number
  emergencyContactPhone: string
  emergencyContactPhone2: string | null
  streetName: string
  streetNumber: string
  postalCode: string
  department: string | null
  village: string | null
  block: string | null
  regionId: number
  communeId: number
  cityId: number
  expatId: number
  nationalityId: number
  familyAllowanceTierId: number
  retirementStatusId: number
  isapreFun: string | null
  pensionStatusId: number
  afpId: number
  healthInsuranceId: number
  healthInsuranceTariffId: number | null
  healthInsuranceUF: number | null
  healthInsurancePesos: number | null
  paymentMethodId: number
  bankId: number
  bankAccount: string
  clothingSize: string
  shoeSize: string
  pantSize: string
}

export interface EmployeeCreateResponse {
  id: number
  identification: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  corporateEmail: string
  active: boolean
  createdAt: string
}

export interface EmployeeTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type EmployeesSortBy =
  | 'identification'
  | 'firstName'
  | 'corporateEmail'
  | 'phone'
  | 'statusName'
  | 'rehireEligible'
  | 'active'
  | 'createdAt'
  | 'updatedAt'

export type EmployeesSortDir = 'asc' | 'desc'

export interface EmployeesPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface EmployeesQueryParams {
  page: number
  size: number
  search: string
  active: string
  sortBy: EmployeesSortBy
  sortDir: EmployeesSortDir
}

export interface EmployeePagedResponse {
  content: EmployeeRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  first?: boolean
  last?: boolean
}
