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
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString, appendParsedId } from '../shared/queryParams.mapper'
import messages from '@/messages/messages'
import { formatDate, formatDateTime, formatRoleLabel } from '@/utils'

export function mapperUsersRows(result: UserRaw[]): UserTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    status: item.status,
    values: [
      item.username,
      `${item.firstName} ${item.lastName}`.trim(),
      item.email,
      item.phoneNumber,
      item.roles.map((role) => formatRoleLabel(role.name)).join(', '),
      item.emailVerified ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
      item.status ? messages.users.ui.statusEnabled : messages.users.ui.statusDisabled,
      formatDate(item.createdAt),
      formatDate(item.lastLogin),
    ],
  }))
}

export function mapperUsersPagination(result: UserPagedResponse): UsersPagination {
  return mapperPagination(result)
}

export function mapperUsersQueryParams(result: UsersQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendString(params, 'name', result.name)
  appendString(params, 'email', result.email)
  appendBooleanString(params, 'status', result.status)
  appendParsedId(params, 'roleId', result.roleId)
  return params
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

  const firstName = detail.firstName.trim()
  const lastName = detail.lastName.trim()

  return {
    avatarUrl: detail.avatarUrl ?? '',
    fullName: `${firstName} ${lastName}`.trim(),
    initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
    usernameDisplay: `@${detail.username.trim()}`,
    emailDisplay: detail.email,
    phoneNumberDisplay: detail.phoneNumber ?? '',
    emailVerifiedLabel: detail.emailVerified ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    statusLabel: detail.status ? messages.users.ui.statusEnabled : messages.users.ui.statusDisabled,
    accountNonExpiredLabel: detail.accountNonExpired ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    accountNonLockedLabel: detail.accountNonLocked ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    credentialsNonExpiredLabel: detail.credentialsNonExpired ? messages.users.ui.emailVerifiedYes : messages.users.ui.emailVerifiedNo,
    roleNamesDisplay: detail.roles.map((role) => formatRoleLabel(role.name)),
    createdAtDisplay: formatDateTime(detail.createdAt),
    updatedAtDisplay: formatDateTime(detail.updatedAt),
    lastLoginDisplay: formatDateTime(detail.lastLogin),
  }
}
