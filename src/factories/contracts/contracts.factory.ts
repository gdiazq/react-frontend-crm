import type { ContractCreateForm, ContractsPagination, ContractsQueryParams, ContractTableRow, ContractsSortBy } from '@/types'

export const contractsTableColumns: string[] = [
  'Identificacion',  // 0
  'Trabajador',      // 1
  'Nombre contrato', // 2
  'Empresa',         // 3
  'Tipo contrato',   // 4
  'Inicio',          // 5
  'Fin',             // 6
  'Estado contrato', // 7
  'Creado',          // 8
  'Acciones',        // 9
]

export const contractsTableColumnIndex = {
  employeeName: 1,
  name: 2,
  contractType: 4,
  contractStatus: 7,
}

export const contractsTableSortByColumn: Partial<Record<number, ContractsSortBy>> = {
  0: 'employeeIdentification',
  1: 'employeeName',
  2: 'name',
  3: 'companyId',
  4: 'contractTypeId',
  5: 'startDate',
  6: 'endDate',
  7: 'contractStatusId',
  8: 'createdAt',
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
