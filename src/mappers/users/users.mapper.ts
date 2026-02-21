import type {
  UserCreateForm,
  UserCreatePayload,
  UserDetail,
  UserDetailView,
  UserPagedResponse,
  UserRoleOption,
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
  return {
    page: result.number ?? 0,
    size: result.size ?? 8,
    totalElements: result.totalElements ?? 0,
    totalPages: result.totalPages ?? 0,
    first: result.first ?? true,
    last: result.last ?? true,
  }
}

export function mapperUsersQueryParams(result: UsersQueryParams): Record<string, number | string> {
  const search = result.search.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
    sortBy: result.sortBy || 'createdAt',
    sortDir: result.sortDir || 'desc',
  }

  if (search.length > 0) queryParams.search = search
  return queryParams
}

export function mapperCreateUserPayload(form: UserCreateForm): UserCreatePayload {
  const parsedRoleId = Number(form.roleId)
  const roleIds = Number.isInteger(parsedRoleId) && parsedRoleId > 0 ? [parsedRoleId] : []

  return {
    username: form.username.trim(),
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    roleIds,
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
    .map((role) => role.name?.trim() || '')
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

function toRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null) return value as Record<string, unknown>
  return null
}

function normalizeRoleOption(value: unknown): UserRoleOption | null {
  const record = toRecord(value)
  if (!record) return null

  const parsedId = Number(record.id)
  const name = typeof record.name === 'string' ? record.name.trim() : ''
  const description = typeof record.description === 'string' ? record.description.trim() : ''
  if (!Number.isInteger(parsedId) || parsedId <= 0 || name.length === 0) return null

  return { id: parsedId, name, description }
}

function resolveRoleOptionsSource(response: unknown): unknown[] {
  if (Array.isArray(response)) return response
  const responseRecord = toRecord(response)
  if (!responseRecord) return []

  if (Array.isArray(responseRecord.content)) return responseRecord.content
  if (Array.isArray(responseRecord.data)) return responseRecord.data

  const dataRecord = toRecord(responseRecord.data)
  if (!dataRecord) return []

  if (Array.isArray(dataRecord.content)) return dataRecord.content
  if (Array.isArray(dataRecord.items)) return dataRecord.items

  return []
}

export function mapperUserRoleOptions(response: unknown): UserRoleOption[] {
  const source = resolveRoleOptionsSource(response)
  return source
    .map((item) => normalizeRoleOption(item))
    .filter((item): item is UserRoleOption => item !== null)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
