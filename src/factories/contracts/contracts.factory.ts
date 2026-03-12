import type { ContractCreateForm, ContractsPagination, ContractsQueryParams, ContractTableRow, ContractsSortBy } from '@/types'

export const contractsTableColumns: string[] = [
  'Identificacion',  // 0
  'Trabajador',      // 1
  'Nombre contrato', // 2
  'Empresa',         // 3
  'Tipo contrato',   // 4
  'Estado contrato', // 5
  'Inicio',          // 6
  'Fin',             // 7
  'Estado',          // 8
  'Creado',          // 9
  'Acciones',        // 10
]

export const contractsTableColumnIndex = {
  name: 2,
  contractType: 4,
  contractStatus: 5,
  active: 8,
}

export const contractsTableSortByColumn: Partial<Record<number, ContractsSortBy>> = {
  0: 'employeeIdentification',
  1: 'employeeName',
  2: 'name',
  3: 'companyId',
  4: 'contractTypeId',
  5: 'contractStatusId',
  6: 'startDate',
  7: 'endDate',
  8: 'active',
  9: 'createdAt',
}

export const initialContractsRows: ContractTableRow[] = []

export const initialContractsPagination: ContractsPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialContractsQueryParams: ContractsQueryParams = {
  page: 0,
  size: 8,
  employeeId: '',
  createdFrom: '',
  createdTo: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
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
