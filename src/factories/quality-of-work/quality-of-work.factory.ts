import type {
  QualityOfWorkCreateForm,
  QualityOfWorkPagination,
  QualityOfWorkQueryParams,
  QualityOfWorkSortBy,
  QualityOfWorkTableRow,
} from '@/types'

export const qualityOfWorkTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const qualityOfWorkTableColumnIndex = {
  name: 0,
  status: 1,
}

export const qualityOfWorkTableSortByColumn: Partial<Record<number, QualityOfWorkSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialQualityOfWorkRows: QualityOfWorkTableRow[] = []

export const initialQualityOfWorkPagination: QualityOfWorkPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialQualityOfWorkQueryParams: QualityOfWorkQueryParams = {
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

export const initialCreateQualityOfWorkForm: QualityOfWorkCreateForm = {
  name: '',
  description: '',
  active: 'true',
}
