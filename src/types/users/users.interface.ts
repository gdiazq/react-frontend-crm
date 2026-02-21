export interface UserRoleRaw {
  id: number
  name: string
}

export interface UserRaw {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  emailVerified: boolean
  status: boolean
  roles: UserRoleRaw[]
  avatarUrl?: string | null
  createdAt: string
  lastLogin: string
}

export type UsersSortBy =
  | 'username'
  | 'firstName'
  | 'email'
  | 'phoneNumber'
  | 'roles'
  | 'emailVerified'
  | 'enabled'
  | 'createdAt'
  | 'lastLogin'

export type UsersSortDir = 'asc' | 'desc'

export interface UserTableRow {
  id: string
  values: string[]
  status?: boolean
}

export interface UserPagedResponse {
  content: UserRaw[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface UsersPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface UsersQueryParams {
  page: number
  size: number
  search: string
  sortBy: UsersSortBy
  sortDir: UsersSortDir
}
