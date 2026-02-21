import type { UserTableRow, UsersPagination, UsersQueryParams } from '@/types'

export const usersTableColumns: string[] = [
  'Usuario',
  'Nombre',
  'Email',
  'Telefono',
  'Roles',
  'Verificado',
  'Estado',
  'Creado',
  'Ultimo acceso',
  'Acciones',
]

export const initialUsersRows: UserTableRow[] = []

export const initialUsersPagination: UsersPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
}

export const initialUsersQueryParams: UsersQueryParams = {
  page: 0,
  size: 8,
  search: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}
