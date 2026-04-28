import type {
  AnnexCreateForm,
  AnnexTableRow,
  AnnexesPagination,
  AnnexesQueryParams,
  AnnexesSortBy,
} from '@/types'

export const annexesTableColumns: string[] = [
  'Identificacion', // 0
  'Trabajador',     // 1
  'Tipo anexo',     // 2
  'Fecha',          // 3
  'Estado',         // 4
  'Creado',         // 5
  'Actualizado',    // 6
  'Acciones',       // 7
]

export const annexesTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  annexType: 2,
  status: 4,
}

export const annexesTableSortByColumn: Partial<Record<number, AnnexesSortBy>> = {
  0: 'identification',
  1: 'firstName',
  3: 'date',
  4: 'status',
  5: 'createdAt',
}

export const initialAnnexesRows: AnnexTableRow[] = []

export const initialAnnexesPagination: AnnexesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialAnnexesQueryParams: AnnexesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  status: '',
  annexTypeId: '',
  contractId: '',
  dateFrom: '',
  dateTo: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export const initialCreateAnnexForm: AnnexCreateForm = {
  employeeId: '',
  annexTypeId: '',
  date: '',
  description: '',
}

export const ANNEX_FILES_MAX_COUNT = 5
export const ANNEX_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024
