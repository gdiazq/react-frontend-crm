import type {
  UserCreateForm,
  UserCreatePayload,
  UserUpdatePayload,
  UserDetail,
  UserDetailView,
  UserPagedResponse,
  UserRaw,
  UserTableRow,
  UsersPagination,
  UsersQueryParams,
} from '@/types'
import messages from '@/messages/messages'
import { formatDate, formatDateTime, formatRoleLabel } from '@/utils'

export function mapperUsersRows(result: UserRaw[]): UserTableRow[] {
  const noData = messages.users.ui.noData
  const noDate = messages.users.ui.noDate

  return result.map((item) => ({
    id: String(item.id),
    status: item.status,
    values: [
      item.username || noData,
      `${item.firstName || ''} ${item.lastName || ''}`.trim() || noData,
      item.email || noData,
      item.phoneNumber || noData,
      item.roles?.map((role) => formatRoleLabel(role.name)).join(', ') || noData,
      item.emailVerified ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
      item.status ? messages.users.ui.statusEnabled : messages.users.ui.statusDisabled,
      formatDate(item.createdAt, noDate),
      formatDate(item.lastLogin, noDate),
    ],
  }))
}

export function mapperUsersPagination(result: UserPagedResponse): UsersPagination {
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 8
  const totalElements = result.totalElements ?? result.total ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.active ?? 0
  const first = result.first ?? page === 0
  const last = result.last ?? page >= Math.max(totalPages - 1, 0)

  return {
    page,
    size,
    totalElements,
    totalPages,
    total,
    active,
    first,
    last,
  }
}

export function mapperUsersQueryParams(result: UsersQueryParams): Record<string, number | string> {
  const search = result.search.trim()
  const name = result.name.trim()
  const email = result.email.trim()
  const status = result.status.trim()
  const roleId = result.roleId.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
    sortBy: result.sortBy || 'createdAt',
    sortDir: result.sortDir || 'desc',
  }

  if (search.length > 0) queryParams.search = search
  if (name.length > 0) queryParams.name = name
  if (email.length > 0) queryParams.email = email
  if (status === 'true' || status === 'false') queryParams.status = status
  if (roleId.length > 0) {
    const parsedRoleId = Number(roleId)
    if (Number.isInteger(parsedRoleId) && parsedRoleId > 0) {
      queryParams.roleId = parsedRoleId
    }
  }
  return queryParams
}

export function mapperCreateUserPayload(form: UserCreateForm): UserCreatePayload {
  const roleId = Number(form.roleId)

  return {
    username: form.username.trim(),
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    roleId: Number.isInteger(roleId) && roleId > 0 ? roleId : 0,
  }
}

export function mapperUpdateUserPayload(
  userId: number,
  form: Omit<UserCreateForm, 'username'>,
): UserUpdatePayload {
  const roleId = Number(form.roleId)

  return {
    id: userId,
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    roleId: Number.isInteger(roleId) && roleId > 0 ? roleId : 0,
  }
}

export function mapperUserDetailView(detail: UserDetail | null): UserDetailView | null {
  if (!detail) return null

  const noData = messages.users.ui.noData
  const noDate = messages.users.ui.noDate
  
  const firstName = detail.firstName?.trim() || ''
  const lastName = detail.lastName?.trim() || ''
  const username = detail.username?.trim() || ''
  const email = detail.email?.trim() || ''
  const phoneNumber = detail.phoneNumber?.trim() || ''
  const roleNames = (detail.roles || [])
    .map((role) => formatRoleLabel(role.name?.trim() || ''))
    .filter((roleName) => roleName.length > 0)

  return {
    avatarUrl: detail.avatarUrl?.trim() || '',
    fullName: `${firstName} ${lastName}`.trim() || noData,
    initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase() || 'U',
    usernameDisplay: username.length > 0 ? `@${username}` : noData,
    emailDisplay: email || noData,
    phoneNumberDisplay: phoneNumber || noData,
    emailVerifiedLabel: detail.emailVerified ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    statusLabel: detail.status ? messages.users.ui.statusEnabled : messages.users.ui.statusDisabled,
    accountNonExpiredLabel: detail.accountNonExpired ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    accountNonLockedLabel: detail.accountNonLocked ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    credentialsNonExpiredLabel: detail.credentialsNonExpired ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    roleNamesDisplay: roleNames.length > 0 ? roleNames : [noData],
    createdAtDisplay: formatDateTime(detail.createdAt, noDate),
    updatedAtDisplay: formatDateTime(detail.updatedAt, noDate),
    lastLoginDisplay: formatDateTime(detail.lastLogin, noDate),
  }
}
