import type {
  UserCreateForm,
  UserCreatePayload,
  UserUpdatePayload,
  UserDetail,
  UserDetailView,
  UserFormSelectOption,
  UserPagedResponse,
  UserRaw,
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
  UsersAdvancedFilters,
  UsersFilterForm,
  UserTableRow,
  UsersPagination,
  UsersQueryParams,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString, appendParsedId } from '../shared/queryParams.mapper'
import messages from '@/messages/messages'
import { formatDate, formatDateTime, formatRoleLabel } from '@/utils'

export function mapperUserRoleSelectOptions(options: SelectRoleOption[]): UserFormSelectOption[] {
  return options.map((option) => ({ label: option.name, value: String(option.id) }))
}

export function mapperUserNameSelectOptions(options: SelectUserNameOption[]): UserFormSelectOption[] {
  return options.map((option) => ({ label: option.name, value: String(option.id) }))
}

export function mapperUserEmailSelectOptions(options: SelectUserEmailOption[]): UserFormSelectOption[] {
  return options.map((option) => ({ label: option.email, value: String(option.id) }))
}

export function mapperUserStatusSelectOptions(options: SelectStatusOption[]): UserFormSelectOption[] {
  return options.map((option) => ({ label: option.name, value: String(option.id) }))
}

export function mapperUserFiltersPayload(
  filters: UsersFilterForm,
  options: {
    names: SelectUserNameOption[]
    emails: SelectUserEmailOption[]
    statuses: SelectStatusOption[]
    roles: SelectRoleOption[]
  },
): UsersAdvancedFilters {
  const selectedNameRaw = options.names.find((option) => String(option.id) === filters.userNameId)?.name.trim() ?? ''
  const selectedName = selectedNameRaw.split(/\s+/)[0]?.toLowerCase() ?? ''
  const selectedEmail = options.emails.find((option) => String(option.id) === filters.userEmailId)?.email ?? ''
  const selectedStatus = options.statuses.find((option) => String(option.id) === filters.statusId)
  const selectedRoleId = options.roles.find((option) => String(option.id) === filters.roleId)?.id

  return {
    name: selectedName,
    email: selectedEmail,
    status: selectedStatus ? String(selectedStatus.id) : '',
    roleId: selectedRoleId ? String(selectedRoleId) : '',
  }
}

export function mapperUserDetailToForm(detail: UserDetail): UserCreateForm {
  return {
    username: detail.username,
    email: detail.email,
    firstName: detail.firstName,
    lastName: detail.lastName,
    phoneNumber: detail.phoneNumber ?? '',
    roleId: String(detail.roles[0]?.id ?? ''),
  }
}

export function mapperUserTableDisplayName(row: UserTableRow | null) {
  return row?.displayName || 'Usuario'
}

export function mapperUserRowStatus(row: UserTableRow | null) {
  return row?.status === true
}

export function mapperUserToggleSuccessMessage(row: UserTableRow, nextStatus: boolean) {
  const username = mapperUserTableDisplayName(row)
  const statusMessage = nextStatus
    ? messages.users.status.success.toggleEnabledSuccess
    : messages.users.status.success.toggleDisabledSuccess

  return `${username} ${statusMessage}`
}

export function mapperUsersRows(result: UserRaw[]): UserTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    displayName: item.username,
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
