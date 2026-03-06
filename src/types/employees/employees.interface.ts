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

export interface EmployeeUpdatePayload {
  id: number
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
  expatId: number | null
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
  statusId: number
  active: boolean
  rehireEligible: boolean
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

interface EmployeeNamedRef {
  id: number
  name: string
}

export interface EmployeeDetail {
  id: number
  userId?: number | null
  identification: string
  identificationType?: EmployeeNamedRef | null
  firstName: string
  paternalLastName: string
  maternalLastName: string
  birthDate?: string | null
  gender?: EmployeeNamedRef | null
  maritalStatus?: EmployeeNamedRef | null
  educationLevel?: EmployeeNamedRef | null
  driverLicense?: EmployeeNamedRef | null
  profession?: EmployeeNamedRef | null
  personalEmail?: string | null
  corporateEmail: string
  phone?: string | null
  phone2?: string | null
  emergencyContactName?: string | null
  emergencyContactRelationship?: EmployeeNamedRef | null
  emergencyContactPhone?: string | null
  emergencyContactPhone2?: string | null
  streetName?: string | null
  streetNumber?: string | null
  postalCode?: string | null
  department?: string | null
  village?: string | null
  block?: string | null
  region?: EmployeeNamedRef | null
  city?: EmployeeNamedRef | null
  commune?: EmployeeNamedRef | null
  expat?: EmployeeNamedRef | null
  nationality?: EmployeeNamedRef | null
  familyAllowanceTier?: EmployeeNamedRef | null
  retirementStatus?: EmployeeNamedRef | null
  isapreFun?: string | null
  pensionStatus?: EmployeeNamedRef | null
  afp?: EmployeeNamedRef | null
  healthInsurance?: EmployeeNamedRef | null
  healthInsuranceTariff?: EmployeeNamedRef | null
  healthInsuranceUF?: string | null
  healthInsurancePesos?: string | null
  paymentMethod?: EmployeeNamedRef | null
  bank?: EmployeeNamedRef | null
  bankAccount?: string | null
  status?: EmployeeNamedRef | null
  clothingSize?: string | null
  shoeSize?: string | null
  pantSize?: string | null
  active: boolean
  rehireEligible: boolean
  createdAt: string
  updatedAt: string
  username?: string | null
  userEmail?: string | null
  userEnabled?: boolean | null
  requestId?: number | null
}

export interface EmployeeDetailView {
  id: string
  fullName: string
  active: boolean
  statusName: string
  rehireEligible: boolean
  identification: string
  identificationType: string
  birthDate: string
  gender: string
  maritalStatus: string
  educationLevel: string
  driverLicense: string
  profession: string
  nationality: string
  expat: string
  personalEmail: string
  corporateEmail: string
  phone: string
  phone2: string
  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactPhone: string
  emergencyContactPhone2: string
  streetName: string
  streetNumber: string
  postalCode: string
  department: string
  village: string
  block: string
  region: string
  commune: string
  city: string
  familyAllowanceTier: string
  retirementStatus: string
  isapreFun: string
  pensionStatus: string
  afp: string
  healthInsurance: string
  healthInsuranceTariff: string
  healthInsuranceUF: string
  healthInsurancePesos: string
  paymentMethod: string
  bank: string
  bankAccount: string
  clothingSize: string
  shoeSize: string
  pantSize: string
  username: string
  userEmail: string
  userEnabled: string
  requestId: string
  createdAtDisplay: string
  updatedAtDisplay: string
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
  statusId: string
  createdFrom: string
  createdTo: string
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
