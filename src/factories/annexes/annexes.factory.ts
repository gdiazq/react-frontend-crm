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
  'Contrato',       // 3
  'Fecha',          // 4
  'Estado',         // 5
  'Creado',         // 6
  'Actualizado',    // 7
  'Acciones',       // 8
]

export const annexesTableColumnIndex = {
  identification: 0,
  employeeName: 1,
  annexType: 2,
  status: 5,
}

export const annexesTableSortByColumn: Partial<Record<number, AnnexesSortBy>> = {
  0: 'identification',
  1: 'firstName',
  4: 'date',
  5: 'status',
  6: 'createdAt',
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
