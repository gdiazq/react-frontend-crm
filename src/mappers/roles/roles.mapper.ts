import messages from '@/messages/messages'
import type {
  RoleCreateForm,
  RoleCreatePayload,
  RoleUpdatePayload,
  RoleDetailView,
  RolePagedResponse,
  RoleRaw,
  RoleTableRow,
  RolesPagination,
  RolesQueryParams,
} from '@/types'
import { formatDate, formatRoleLabel } from '@/utils'

export function mapperRolesRows(result: RoleRaw[]): RoleTableRow[] {
  const noData = messages.roles.ui.noData
  const noDate = messages.roles.ui.noDate

  return result.map((item) => ({
    id: String(item.id),
    status: item.enabled,
    values: [
      formatRoleLabel(item.name) || noData,
      item.enabled ? messages.roles.ui.statusEnabled : messages.roles.ui.statusDisabled,
      formatDate(item.createdAt, noDate),
      formatDate(item.updatedAt, noDate),
      '',
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

export function mapperRoleDetailView(detail: RoleRaw | null): RoleDetailView | null {
  if (!detail) return null

  const noData = messages.roles.ui.noData
  const noDate = messages.roles.ui.noDate

  return {
    roleNameDisplay: formatRoleLabel(detail.name?.trim() || '') || noData,
    descriptionDisplay: detail.description?.trim() || noData,
    enabled: detail.enabled === true,
    createdAtDisplay: formatDate(detail.createdAt, noDate),
    updatedAtDisplay: formatDate(detail.updatedAt, noDate),
  }
}

export function mapperCreateRolePayload(form: RoleCreateForm): RoleCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { name, description }
    : { name }
}

export function mapperUpdateRolePayload(roleId: number, form: RoleCreateForm): RoleUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { id: roleId, name, description }
    : { id: roleId, name }
}
