import type {
  ProjectTypeCreateForm,
  ProjectTypesPagination,
  ProjectTypesQueryParams,
  ProjectTypesSortBy,
  ProjectTypeTableRow,
} from '@/types'

export const projectTypesTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const projectTypesTableColumnIndex = {
  name: 0,
  status: 1,
}

export const projectTypesTableSortByColumn: Partial<Record<number, ProjectTypesSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialProjectTypesRows: ProjectTypeTableRow[] = []

export const initialProjectTypesPagination: ProjectTypesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialProjectTypesQueryParams: ProjectTypesQueryParams = {
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

export const initialCreateProjectTypeForm: ProjectTypeCreateForm = {
  name: '',
  description: '',
  active: 'true',
}
