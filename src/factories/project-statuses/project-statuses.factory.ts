import type {
  ProjectStatusCreateForm,
  ProjectStatusesPagination,
  ProjectStatusesQueryParams,
  ProjectStatusesSortBy,
  ProjectStatusTableRow,
} from '@/types'

export const projectStatusesTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const projectStatusesTableColumnIndex = {
  name: 0,
  status: 1,
}

export const projectStatusesTableSortByColumn: Partial<Record<number, ProjectStatusesSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialProjectStatusesRows: ProjectStatusTableRow[] = []

export const initialProjectStatusesPagination: ProjectStatusesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialProjectStatusesQueryParams: ProjectStatusesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  active: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export const initialCreateProjectStatusForm: ProjectStatusCreateForm = {
  name: '',
  description: '',
}
