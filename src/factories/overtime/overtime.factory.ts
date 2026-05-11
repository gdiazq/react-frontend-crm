import type { OvertimeCreateForm, OvertimePagination, OvertimeQueryParams, OvertimeSortBy, OvertimeTableRow } from '@/types'

export const overtimeTableColumns: string[] = [
  'Trabajador',     // 0
  'Centro costo',   // 1
  'Proyecto',       // 2
  'Tipo',           // 3
  'Recargo',        // 4
  'Fecha',          // 5
  'Inicio',         // 6
  'Término',        // 7
  'Horas',          // 8
  'Estado',         // 9
  'Acciones',       // 10
]

export const overtimeTableColumnIndex = {
  employeeName: 0,
  costCenter: 1,
  projectName: 2,
  overtimeTypeName: 3,
  status: 9,
}

export const overtimeTableSortByColumn: Partial<Record<number, OvertimeSortBy>> = {
  0: 'employeeName',
  1: 'costCenter',
  2: 'projectName',
  3: 'overtimeTypeName',
  5: 'date',
  6: 'startTime',
  7: 'endTime',
  8: 'hours',
  9: 'currentStatusName',
}

export const initialOvertimeRows: OvertimeTableRow[] = []

export const initialOvertimePagination: OvertimePagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  pending: 0,
  first: true,
  last: true,
}

export const initialOvertimeQueryParams: OvertimeQueryParams = {
  page: 0,
  size: 8,
  search: '',
  employeeId: '',
  costCenter: '',
  statusId: '',
  dateFrom: '',
  dateTo: '',
  overtimeTypeId: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export const initialOvertimeForm: OvertimeCreateForm = {
  employeeId: '',
  overtimeTypeId: '',
  date: '',
  startTime: '',
  endTime: '',
  reason: '',
}
