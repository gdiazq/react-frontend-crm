import type { RequestTableRow, RequestsPagination, RequestsQueryParams } from '@/types'

export const requestsTableColumns: string[] = [
  'Identificacion',
  'Nombre',
  'Tipo solicitud',
  'Estado de aprobacion',
  'Requiere aprobacion',
  'Aprobador',
  'Fecha aprobacion',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const initialRequestsRows: RequestTableRow[] = []

export const initialRequestsPagination: RequestsPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  first: true,
  last: true,
}

export const initialRequestsQueryParams: RequestsQueryParams = {
  page: 0,
  size: 8,
}
