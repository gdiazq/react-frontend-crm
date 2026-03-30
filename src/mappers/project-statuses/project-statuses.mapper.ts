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
  const search = result.search.trim()
  const active = result.active.trim()
  const createdFrom = result.createdFrom.trim()
  const createdTo = result.createdTo.trim()
  const updatedFrom = result.updatedFrom.trim()
  const updatedTo = result.updatedTo.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
    sortBy: result.sortBy,
    sortDir: result.sortDir,
  }

  if (search.length > 0) queryParams.search = search
  if (active == 'true' || active == 'false') queryParams.active = active
  if (createdFrom.length > 0) queryParams.createdFrom = createdFrom
  if (createdTo.length > 0) queryParams.createdTo = createdTo
  if (updatedFrom.length > 0) queryParams.updatedFrom = updatedFrom
  if (updatedTo.length > 0) queryParams.updatedTo = updatedTo

  return queryParams
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
