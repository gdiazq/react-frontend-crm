import type { ContractCreateForm, ContractsPagination, ContractsQueryParams, ContractTableRow } from '@/types'

export const contractsTableColumns: string[] = [
  'Nombre contrato',
  'Tipo contrato',
  'Empresa',
  'Inicio',
  'Fin',
  'Estado',
  'Creado',
  'Acciones',
]

export const initialContractsRows: ContractTableRow[] = []

export const initialContractsPagination: ContractsPagination = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialContractsQueryParams: ContractsQueryParams = {
  page: 0,
  size: 10,
  employeeId: '',
  createdFrom: '',
  createdTo: '',
}

export const initialCreateContractForm: ContractCreateForm = {
  employeeId: '',
  name: '',
  contractNumber: '',
  contractTypeId: '',
  safetyGroupId: '',
  contractDetail: '',
  baseSalary: '',
  agreedSalary: '',
  companyId: '',
  zoneId: '',
  jobTitleId: '',
  siteId: '',
  laborUnionId: '',
  weeklyWorkHours: '',
  workDays: '',
  startDate: '',
  endDate: '',
  mealTypeId: '',
  transportTypeId: '',
}
