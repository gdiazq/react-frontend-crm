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
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString } from '../shared/queryParams.mapper'
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
  return mapperPagination(result)
}

export function mapperRolesQueryParams(result: RolesQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  const status = result.status.trim()
  if (status === 'true' || status === 'false') {
    params.status = status
    params.enabled = status
  }
  return params
}

function parsePermissionName(permissionName: string) {
  const [resourceRaw, actionRaw] = permissionName.split(':')
  return {
    resourceDisplay: resourceRaw?.trim() || 'GENERAL',
    actionDisplay: actionRaw?.trim() || 'ACCESS',
  }
}

export function mapperRoleDetailView(detail: RoleDetail | null): RoleDetailView | null {
  if (!detail) return null

  return {
    roleNameDisplay: formatRoleLabel(detail.name),
    descriptionDisplay: detail.description ?? '',
    enabled: detail.enabled,
    permissionsDisplay: detail.permissions.map((permission) => {
      const parsedPermission = parsePermissionName(permission.name)

      return {
        id: permission.id,
        name: permission.name,
        description: permission.description ?? '',
        resourceDisplay: parsedPermission.resourceDisplay,
        actionDisplay: parsedPermission.actionDisplay,
      }
    }),
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
