import type {
  SettlementPagination,
  SettlementQueryParams,
  SettlementSortBy,
  SettlementTableRow,
} from '@/types'

export const settlementTableColumns: string[] = [
  'Identificacion',
  'Empleado',
  'Fecha fin',
  'Causa terminacion',
  'Calidad trabajo',
  'Estado',
  'Recontratable',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const settlementTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  endDate: 2,
  legalCause: 3,
  qualityOfWork: 4,
  status: 5,
  rehire: 6,
  createdAt: 7,
  updatedAt: 8,
}

export const settlementTableSortByColumn: Partial<Record<number, SettlementSortBy>> = {
  1: 'employeeFullName',
  2: 'endDate',
  3: 'legalTerminationCauseName',
  4: 'qualityOfWorkName',
  5: 'status',
  6: 'rehireEligible',
  7: 'createdAt',
  8: 'updatedAt',
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
