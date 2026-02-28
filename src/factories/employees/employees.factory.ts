import type { EmployeesPagination, EmployeesQueryParams, EmployeeTableRow } from '@/types'

export const employeesTableColumns: string[] = [
  'Identificacion',
  'Nombre',
  'Email',
  'Telefono',
  'Recontratable',
  'Estado',
  'Creado',
  'Actualizado',
]

export const initialEmployeesRows: EmployeeTableRow[] = []

export const initialEmployeesPagination: EmployeesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialEmployeesQueryParams: EmployeesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  active: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}
