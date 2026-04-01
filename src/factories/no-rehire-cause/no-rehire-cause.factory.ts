import type {
  NoRehireCauseCreateForm,
  NoRehireCausePagination,
  NoRehireCauseQueryParams,
  NoRehireCauseSortBy,
  NoRehireCauseTableRow,
} from '@/types'

export const noRehireCauseTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const noRehireCauseTableColumnIndex = {
  name: 0,
  status: 1,
}

export const noRehireCauseTableSortByColumn: Partial<Record<number, NoRehireCauseSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialNoRehireCauseRows: NoRehireCauseTableRow[] = []

export const initialNoRehireCausePagination: NoRehireCausePagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialNoRehireCauseQueryParams: NoRehireCauseQueryParams = {
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

export const initialCreateNoRehireCauseForm: NoRehireCauseCreateForm = {
  name: '',
  description: '',
  active: 'true',
}
