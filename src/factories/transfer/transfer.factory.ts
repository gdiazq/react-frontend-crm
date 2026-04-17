import type {
  TransferCreateForm,
  TransferPagination,
  TransferQueryParams,
  TransferSortBy,
  TransferTableRow,
} from '@/types'

export const transferTableColumns: string[] = [
  'Empleado',
  'RUT',
  'Centro Origen',
  'Centro Destino',
  'Fecha Efectiva',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const transferTableColumnIndex = {
  employeeName: 0,
  status: 5,
}

export const transferTableSortByColumn: Partial<Record<number, TransferSortBy>> = {
  0: 'employeeFullName',
  4: 'effectiveDate',
  5: 'status',
  6: 'createdAt',
  7: 'updatedAt',
}

export const initialTransferRows: TransferTableRow[] = []

export const initialTransferPagination: TransferPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialTransferQueryParams: TransferQueryParams = {
  page: 0,
  size: 8,
  employeeId: '',
  status: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export const initialCreateTransferForm: TransferCreateForm = {
  employeeId: '',
  toCostCenter: '',
  effectiveDate: '',
  reason: '',
}

export const TRANSFER_FILES_MAX_COUNT = 5
export const TRANSFER_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024
