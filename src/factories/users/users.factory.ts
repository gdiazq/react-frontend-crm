import type { UserCreateForm, UserTableRow, UsersPagination, UsersQueryParams, UsersSortBy } from '@/types'

export const usersTableColumns: string[] = [
  'Usuario',       // 0
  'Nombre',        // 1
  'Email',         // 2
  'Telefono',      // 3
  'Roles',         // 4
  'Verificado',    // 5
  'Estado',        // 6
  'Creado',        // 7
  'Ultimo acceso', // 8
  'Acciones',      // 9
]

export const usersTableColumnIndex = {
  email: 2,
  status: 6,
}

export const usersTableSortByColumn: Partial<Record<number, UsersSortBy>> = {
  0: 'username',
  1: 'firstName',
  2: 'email',
  3: 'phoneNumber',
  4: 'roles',
  5: 'emailVerified',
  6: 'enabled',
  7: 'createdAt',
  8: 'lastLogin',
}

export const initialUsersRows: UserTableRow[] = []

export const initialUsersPagination: UsersPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialUsersQueryParams: UsersQueryParams = {
  page: 0,
  size: 8,
  search: '',
  name: '',
  email: '',
  status: '',
  roleId: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export const initialCreateUserForm: UserCreateForm = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  roleId: '',
}
