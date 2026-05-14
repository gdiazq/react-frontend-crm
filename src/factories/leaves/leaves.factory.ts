import { SortDirection } from '@/constant'
import type { LeaveCreateForm, LeavesPagination, LeavesQueryParams, LeavesSortBy, LeaveTableRow } from '@/types'

export const leavesTableColumns: string[] = [
  'Identificación', // 0
  'Trabajador',     // 1
  'Tipo permiso',   // 2
  'Inicio',         // 3
  'Fin',            // 4
  'Días',           // 5
  'Estado',         // 6
  'Creado',         // 7
  'Acciones',       // 8
]

export const leavesTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  leaveType: 2,
  status: 6,
}

export const leavesTableSortByColumn: Partial<Record<number, LeavesSortBy>> = {
  0: 'employeeIdentification',
  1: 'employeeFullName',
  2: 'leaveTypeName',
  3: 'startDate',
  4: 'endDate',
  5: 'totalDays',
  6: 'status',
  7: 'createdAt',
}

export const leaveStatusFilterOptions = [
  { label: 'Pendiente de revisión', value: 'Pendiente de revisión' },
  { label: 'Pendiente de aprobación', value: 'Pendiente de aprobación' },
  { label: 'Aprobado', value: 'Aprobado' },
  { label: 'Rechazado', value: 'Rechazado' },
]

export const initialLeavesRows: LeaveTableRow[] = []

export const initialLeavesPagination: LeavesPagination = {
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

export const initialLeavesQueryParams: LeavesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  status: '',
  leaveTypeId: '',
  employeeId: '',
  startFrom: '',
  startTo: '',
  endFrom: '',
  endTo: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}

export const initialCreateLeaveForm: LeaveCreateForm = {
  employeeId: '',
  leaveTypeId: '',
  startDate: '',
  endDate: '',
  halfDay: 'false',
  reason: '',
}

export const LEAVE_FILES_MAX_COUNT = 5
export const LEAVE_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024
