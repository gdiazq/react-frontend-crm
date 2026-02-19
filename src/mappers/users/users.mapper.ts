import type {
  UserPagedResponse,
  UserRaw,
  UserTableRow,
  UsersPagination,
  UsersQueryParams,
} from '@/types'
import messages from '@/messages/messages'
import { formatDate, formatRoleLabel } from '@/utils'

export function mapperUsersRows(result: UserRaw[]): UserTableRow[] {
  const noData = messages.users.noData
  const noDate = messages.users.noDate

  return result.map((item) => ({
    id: String(item.id),
    status: item.status,
    values: [
      item.username || noData,
      `${item.firstName || ''} ${item.lastName || ''}`.trim() || noData,
      item.email || noData,
      item.phoneNumber || noData,
      item.roles?.map((role) => formatRoleLabel(role.name)).join(', ') || noData,
      item.emailVerified ? messages.users.emailVerifiedYes : messages.users.emailVerifiedNo,
      item.status ? messages.users.statusEnabled : messages.users.statusDisabled,
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
  }

  if (search.length > 0) queryParams.search = search
  return queryParams
}
