import type { RoleTableRow, RolesPagination, RolesQueryParams } from '@/types'

export const rolesTableColumns: string[] = [
  'Rol',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const initialRolesRows: RoleTableRow[] = []

export const initialRolesPagination: RolesPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
}

export const initialRolesQueryParams: RolesQueryParams = {
  page: 0,
  size: 8,
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
}
