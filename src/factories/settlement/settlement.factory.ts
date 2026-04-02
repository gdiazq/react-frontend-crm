import type {
  SettlementPagination,
  SettlementQueryParams,
  SettlementSortBy,
  SettlementTableRow,
} from '@/types'

export const settlementTableColumns: string[] = [
  'Identificacion',
  'Empleado',
  'Estado',
  'Fecha fin',
  'Causa terminacion',
  'Recontratable',
  'Creado',
  'Acciones',
]

export const settlementTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  status: 2,
  endDate: 3,
  legalCause: 4,
  rehire: 5,
  createdAt: 6,
}

export const settlementTableSortByColumn: Partial<Record<number, SettlementSortBy>> = {
  1: 'employeeFullName',
  2: 'status',
  3: 'endDate',
  4: 'legalTerminationCauseName',
  5: 'rehireEligible',
  6: 'createdAt',
}

export const initialSettlementRows: SettlementTableRow[] = []

export const initialSettlementPagination: SettlementPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialSettlementQueryParams: SettlementQueryParams = {
  page: 0,
  size: 8,
  search: '',
  status: '',
  employeeId: '',
  legalTerminationCauseId: '',
  rehireEligible: '',
  endDateFrom: '',
  endDateTo: '',
  createdFrom: '',
  createdTo: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}
