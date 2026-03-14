import type {
  ProjectSpecialtyCreateForm,
  ProjectSpecialtiesPagination,
  ProjectSpecialtiesQueryParams,
  ProjectSpecialtiesSortBy,
  ProjectSpecialtyTableRow,
} from '@/types'

export const projectSpecialtiesTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const projectSpecialtiesTableColumnIndex = {
  name: 0,
  status: 1,
}

export const projectSpecialtiesTableSortByColumn: Partial<Record<number, ProjectSpecialtiesSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialProjectSpecialtiesRows: ProjectSpecialtyTableRow[] = []

export const initialProjectSpecialtiesPagination: ProjectSpecialtiesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialProjectSpecialtiesQueryParams: ProjectSpecialtiesQueryParams = {
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

export const initialCreateProjectSpecialtyForm: ProjectSpecialtyCreateForm = {
  name: '',
  description: '',
}
