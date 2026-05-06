import type {
  ProjectAssignmentTableRow,
  ProjectAssignmentsPagination,
  ProjectAssignmentsQueryParams,
  ProjectAssignmentsSortBy,
} from '@/types'

export const projectAssignmentsTableColumns: string[] = [
  'Identificación',
  'Trabajador',
  'Centro costo',
  'Proyecto',
  'Rol',
  'Asignación',
  'Inicio',
  'Fin',
  'Estado',
  'Acciones',
]

export const projectAssignmentsTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  costCenter: 2,
  projectName: 3,
  role: 4,
  allocation: 5,
  startDate: 6,
  endDate: 7,
  status: 8,
}

export const projectAssignmentsTableSortByColumn: Partial<Record<number, ProjectAssignmentsSortBy>> = {
  0: 'employeeIdentification',
  1: 'employeeFullName',
  2: 'costCenter',
  3: 'projectName',
  4: 'roleOnProject',
  5: 'allocationPercent',
  6: 'startDate',
  7: 'endDate',
  8: 'active',
}

export const projectAssignmentActiveFilterOptions = [
  { label: 'Todos', value: '' },
  { label: 'Activos', value: 'true' },
  { label: 'Inactivos', value: 'false' },
]

export const initialProjectAssignmentsRows: ProjectAssignmentTableRow[] = []

export const initialProjectAssignmentsPagination: ProjectAssignmentsPagination = {
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

export const initialProjectAssignmentsQueryParams: ProjectAssignmentsQueryParams = {
  page: 0,
  size: 8,
  search: '',
  employeeId: '',
  costCenter: '',
  active: '',
  dateFrom: '',
  dateTo: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'startDate',
  sortDir: 'desc',
}
