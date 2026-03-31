import messages from '@/messages/messages'
import type {
  ProjectStatusCreateForm,
  ProjectStatusCreatePayload,
  ProjectStatusDetail,
  ProjectStatusDetailView,
  ProjectStatusPagedResponse,
  ProjectStatusRaw,
  ProjectStatusTableRow,
  ProjectStatusesPagination,
  ProjectStatusesQueryParams,
  ProjectStatusUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperProjectStatusesRows(result: ProjectStatusRaw[]): ProjectStatusTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.projectStatuses.ui.statusActive : messages.projectStatuses.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperProjectStatusesPagination(result: ProjectStatusPagedResponse): ProjectStatusesPagination {
  return mapperPagination(result)
}

export function mapperProjectStatusesQueryParams(result: ProjectStatusesQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperProjectStatusDetailView(detail: ProjectStatusDetail | null): ProjectStatusDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperProjectStatusToForm(detail: Pick<ProjectStatusDetail, 'name' | 'description'>): ProjectStatusCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
  }
}

export function mapperCreateProjectStatusPayload(form: ProjectStatusCreateForm): ProjectStatusCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { name, description }
    : { name }
}

export function mapperUpdateProjectStatusPayload(projectStatusId: number, form: ProjectStatusCreateForm): ProjectStatusUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { id: projectStatusId, name, description }
    : { id: projectStatusId, name }
}
