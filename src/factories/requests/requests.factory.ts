import { SortDirection } from '@/constant'
import type { RequestTableRow, RequestsPagination, RequestsQueryParams, RequestsSortBy } from '@/types'

export const requestsTableColumns: string[] = [
  'Identificacion',       // 0
  'Nombre',               // 1
  'Tipo solicitud',       // 2
  'Operacion',            // 3
  'Estado de aprobacion', // 4
  'Aprobador',            // 5
  'Fecha aprobacion',     // 6
  'Creado',               // 7
  'Actualizado',          // 8
  'Acciones',             // 9
]

export const requestsTableColumnIndex = {
  name: 1,
  status: 4,
}

export const requestsTableSortByColumn: Partial<Record<number, RequestsSortBy>> = {
  0: 'identification',
  1: 'firstName',
  2: 'requestTypeName',
  3: 'action',
  4: 'statusName',
  5: 'approverFullName',
  6: 'approvalDate',
  7: 'createdAt',
  8: 'updatedAt',
}

export const initialRequestsRows: RequestTableRow[] = []

export const initialRequestsPagination: RequestsPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  pending: 0,
  numberOfElements: 0,
  first: true,
  last: true,
}

export const initialRequestsQueryParams: RequestsQueryParams = {
  page: 0,
  size: 8,
  search: '',
  statusId: '',
  idModule: '',
  createdFrom: '',
  createdTo: '',
  approvalFrom: '',
  approvalTo: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}
