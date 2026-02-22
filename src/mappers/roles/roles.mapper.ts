import messages from '@/messages/messages'
import type {
  RolePagedResponse,
  RoleRaw,
  RoleTableRow,
  RolesPagination,
  RolesQueryParams,
} from '@/types'
import { formatDateTime, formatRoleLabel } from '@/utils'

export function mapperRolesRows(result: RoleRaw[]): RoleTableRow[] {
  const noData = messages.roles.ui.noData
  const noDate = messages.roles.ui.noDate

  return result.map((item) => ({
    id: String(item.id),
    values: [
      formatRoleLabel(item.name) || noData,
      item.enabled ? messages.roles.ui.statusEnabled : messages.roles.ui.statusDisabled,
      formatDateTime(item.createdAt, noDate),
      formatDateTime(item.updatedAt, noDate),
    ],
  }))
}

export function mapperRolesPagination(result: RolePagedResponse): RolesPagination {
  return {
    page: result.number ?? 0,
    size: result.size ?? 8,
    totalElements: result.totalElements ?? 0,
    totalPages: result.totalPages ?? 0,
    first: result.first ?? true,
    last: result.last ?? true,
  }
}

export function mapperRolesQueryParams(result: RolesQueryParams): Record<string, number | string> {
  const search = result.search.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
    sortBy: result.sortBy || 'name',
    sortDir: result.sortDir || 'asc',
  }

  if (search.length > 0) queryParams.search = search
  return queryParams
}
