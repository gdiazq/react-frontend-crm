import { SortDirection } from '@/constant'
import type { EmployeeCreateForm, EmployeesPagination, EmployeesQueryParams, EmployeeTableRow, EmployeesSortBy } from '@/types'

export const employeesTableColumns: string[] = [
  'Identificacion',       // 0
  'Nombre',               // 1
  'Email',                // 2
  'Telefono',             // 3
  'Estado de aprobacion', // 4
  'Contrato',             // 5
  'Estado',               // 6
  'Creado',               // 7
  'Actualizado',          // 8
  'Acciones',             // 9
]

export const employeesTableColumnIndex = {
  name: 1,
  approvalStatus: 4,
  contract: 5,
  active: 6,
}

export const employeesTableSortByColumn: Partial<Record<number, EmployeesSortBy>> = {
  0: 'identification',
  1: 'firstName',
  2: 'corporateEmail',
  3: 'phone',
  4: 'statusName',
  5: 'hasContract',
  6: 'active',
  7: 'createdAt',
  8: 'updatedAt',
}

export const initialEmployeesRows: EmployeeTableRow[] = []

export const initialEmployeesPagination: EmployeesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialEmployeesQueryParams: EmployeesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  active: '',
  statusId: '',
  createdFrom: '',
  createdTo: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}

export const initialCreateEmployeeForm: EmployeeCreateForm = {
  costCenter: '',
  identification: '',
  identificationTypeId: '',
  firstName: '',
  paternalLastName: '',
  maternalLastName: '',
  birthDate: '',
  genderId: '',
  maritalStatusId: '',
  educationLevelId: '',
  driverLicenseId: '',
  professionId: '',
  personalEmail: '',
  corporateEmail: '',
  phone: '',
  phone2: '',
  emergencyContactName: '',
  emergencyContactRelationshipId: '',
  emergencyContactPhone: '',
  emergencyContactPhone2: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  department: '',
  village: '',
  block: '',
  regionId: '',
  communeId: '',
  cityId: '',
  expatId: '',
  nationalityId: '',
  familyAllowanceTierId: '',
  retirementStatusId: '',
  isapreFun: '',
  pensionStatusId: '',
  afpId: '',
  healthInsuranceId: '',
  healthInsuranceTariffId: '',
  healthInsuranceUF: '',
  healthInsurancePesos: '',
  paymentMethodId: '',
  bankId: '',
  bankAccount: '',
  clothingSize: '',
  shoeSize: '',
  pantSize: '',
}
