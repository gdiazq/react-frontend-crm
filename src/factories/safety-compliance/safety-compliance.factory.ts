import type {
  SafetyComplianceCreateForm,
  SafetyCompliancePagination,
  SafetyComplianceQueryParams,
  SafetyComplianceSortBy,
  SafetyComplianceTableRow,
} from '@/types'

export const safetyComplianceTableColumns: string[] = [
  'Nombre',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const safetyComplianceTableColumnIndex = {
  name: 0,
  status: 1,
}

export const safetyComplianceTableSortByColumn: Partial<Record<number, SafetyComplianceSortBy>> = {
  0: 'name',
  1: 'active',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialSafetyComplianceRows: SafetyComplianceTableRow[] = []

export const initialSafetyCompliancePagination: SafetyCompliancePagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialSafetyComplianceQueryParams: SafetyComplianceQueryParams = {
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

export const initialCreateSafetyComplianceForm: SafetyComplianceCreateForm = {
  name: '',
  description: '',
  active: 'true',
}
