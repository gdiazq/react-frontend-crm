export interface UserRoleRaw {
  id: number
  name: string
}

export interface UserDetailRole {
  id: number
  name: string
  description: string
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

export interface UserDetail {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string | null
  emailVerified: boolean
  status: boolean
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  roles: UserDetailRole[]
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
  lastLogin: string
}

export interface UserDetailView {
  avatarUrl: string
  fullName: string
  initials: string
  usernameDisplay: string
  emailDisplay: string
  phoneNumberDisplay: string
  emailVerifiedLabel: string
  statusLabel: string
  accountNonExpiredLabel: string
  accountNonLockedLabel: string
  credentialsNonExpiredLabel: string
  roleNamesDisplay: string[]
  createdAtDisplay: string
  updatedAtDisplay: string
  lastLoginDisplay: string
}

export interface UserCreateForm {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  roleId: string
}

export interface UserCreatePayload {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  roleId: number
}

export interface UserCreateResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string | null
  emailVerified: boolean
  status: boolean
  roles: UserDetailRole[]
  avatarUrl?: string | null
  createdAt: string
}

export interface UserUpdatePayload {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  roleId: number
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
  name: string
  email: string
  status: string
  roleId: string
  sortBy: UsersSortBy
  sortDir: UsersSortDir
}
