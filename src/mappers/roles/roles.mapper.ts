import messages from '@/messages/messages'
import type {
  RoleCreateForm,
  RoleCreatePayload,
  RoleDetail,
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
  return result.map((item) => ({
    id: String(item.id),
    status: item.enabled,
    values: [
      formatRoleLabel(item.name),
      item.enabled ? messages.roles.ui.statusEnabled : messages.roles.ui.statusDisabled,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperRolesPagination(result: RolePagedResponse): RolesPagination {
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 10
  const totalElements = result.totalElements ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.active ?? 0
  const first = result.first ?? page === 0
  const last = result.last ?? page >= totalPages - 1

  return { page, size, totalElements, totalPages, total, active, first, last }
}

export function mapperRolesQueryParams(result: RolesQueryParams): Record<string, number | string> {
  const search = result.search.trim()
  const status = result.status.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
    sortBy: result.sortBy,
    sortDir: result.sortDir,
  }

  if (search.length > 0) queryParams.search = search
  if (status === 'true' || status === 'false') {
    queryParams.status = status
    queryParams.enabled = status
  }
  return queryParams
}

export function mapperRoleDetailView(detail: RoleDetail | null): RoleDetailView | null {
  if (!detail) return null

  return {
    roleNameDisplay: formatRoleLabel(detail.name),
    descriptionDisplay: detail.description ?? '',
    enabled: detail.enabled,
    permissionsDisplay: detail.permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description ?? '',
    })),
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
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
