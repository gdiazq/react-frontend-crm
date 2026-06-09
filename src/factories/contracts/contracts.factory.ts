import { SortDirection } from '@/constant'
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
  'Actualizado',     // 9
  'Acciones',        // 10
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
  9: 'updatedAt',
}

export const initialContractsRows: ContractTableRow[] = []

export const CONTRACT_FILES_MAX_COUNT = 5
export const CONTRACT_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024

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
  search: '',
  employeeId: '',
  statusId: '',
  contractStatusId: '',
  contractTypeId: '',
  createdFrom: '',
  createdTo: '',
  startDateFrom: '',
  startDateTo: '',
  endDateFrom: '',
  endDateTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}

export const initialCreateContractForm: ContractCreateForm = {
  employeeId: '',
  costCenter: '',
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
