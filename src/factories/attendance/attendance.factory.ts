import type {
  AttendanceCreateForm,
  AttendanceMarkCreateForm,
  AttendancePagination,
  AttendanceQueryParams,
  AttendanceSortBy,
  AttendanceTableRow,
} from '@/types'

export const attendanceTableColumns: string[] = [
  'Identificación', // 0
  'Trabajador',     // 1
  'Centro costo',   // 2
  'Proyecto',       // 3
  'Fecha',          // 4
  'Entrada',        // 5
  'Salida',         // 6
  'Horas',          // 7
  'Estado',         // 8
  'Acciones',       // 9
]

export const attendanceTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  costCenter: 2,
  projectName: 3,
  date: 4,
  status: 8,
}

export const attendanceTableSortByColumn: Partial<Record<number, AttendanceSortBy>> = {
  0: 'employeeIdentification',
  1: 'employeeFullName',
  2: 'costCenter',
  3: 'projectName',
  4: 'date',
  5: 'checkInTime',
  6: 'checkOutTime',
  7: 'totalHours',
  8: 'statusName',
}

export const initialAttendanceRows: AttendanceTableRow[] = []

export const initialAttendancePagination: AttendancePagination = {
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

export const initialAttendanceQueryParams: AttendanceQueryParams = {
  page: 0,
  size: 8,
  search: '',
  employeeId: '',
  costCenter: '',
  statusId: '',
  dateFrom: '',
  dateTo: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'date',
  sortDir: 'desc',
}

export const initialCreateAttendanceForm: AttendanceCreateForm = {
  employeeId: '',
  costCenter: '',
  date: '',
  checkInTime: '',
  checkOutTime: '',
  statusId: '',
  notes: '',
}

export const initialAttendanceMarkForm: AttendanceMarkCreateForm = {
  markType: '',
  employeeId: '',
  statusId: '',
  costCenter: '',
  date: '',
  markTime: '',
  notes: '',
}
