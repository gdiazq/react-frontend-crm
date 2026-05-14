import { SortDirection } from '@/constant'
import type {
  LegalTerminationCauseCreateForm,
  LegalTerminationCausesPagination,
  LegalTerminationCausesQueryParams,
  LegalTerminationCausesSortBy,
  LegalTerminationCauseTableRow,
} from '@/types'

export const legalTerminationCausesTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const legalTerminationCausesTableColumnIndex = {
  name: 0,
  status: 1,
}

export const legalTerminationCausesTableSortByColumn: Partial<Record<number, LegalTerminationCausesSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialLegalTerminationCausesRows: LegalTerminationCauseTableRow[] = []

export const initialLegalTerminationCausesPagination: LegalTerminationCausesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialLegalTerminationCausesQueryParams: LegalTerminationCausesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  active: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}

export const initialCreateLegalTerminationCauseForm: LegalTerminationCauseCreateForm = {
  name: '',
  description: '',
}
