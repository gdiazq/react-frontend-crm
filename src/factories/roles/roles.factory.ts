import type { RoleCreateForm, RoleTableRow, RolesPagination, RolesQueryParams, RolesSortBy } from '@/types'

export const rolesTableColumns: string[] = [
  'Rol',       // 0
  'Estado',    // 1
  'Creado',    // 2
  'Actualizado', // 3
  'Acciones',  // 4
]

export const rolesTableColumnIndex = {
  name: 0,
  status: 1,
}

export const rolesTableSortByColumn: Partial<Record<number, RolesSortBy>> = {
  0: 'name',
  1: 'enabled',
  2: 'createdAt',
  3: 'updatedAt',
}

export const initialRolesRows: RoleTableRow[] = []

export const initialRolesPagination: RolesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialRolesQueryParams: RolesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  status: '',
  sortBy: 'name',
  sortDir: 'asc',
}

export const initialCreateRoleForm: RoleCreateForm = {
  name: '',
  description: '',
}
