import messages from '@/messages/messages'
import type {
  ProjectTypeCreateForm,
  ProjectTypeCreatePayload,
  ProjectTypeDetail,
  ProjectTypeDetailView,
  ProjectTypePagedResponse,
  ProjectTypeRaw,
  ProjectTypeTableRow,
  ProjectTypesPagination,
  ProjectTypesQueryParams,
  ProjectTypeUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { formatDate } from '@/utils'

export function mapperProjectTypesRows(result: ProjectTypeRaw[]): ProjectTypeTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.projectTypes.ui.statusActive : messages.projectTypes.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperProjectTypesPagination(result: ProjectTypePagedResponse): ProjectTypesPagination {
  return mapperPagination(result)
}

export function mapperProjectTypesQueryParams(result: ProjectTypesQueryParams): Record<string, number | string> {
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

export function mapperProjectTypeDetailView(detail: ProjectTypeDetail | null): ProjectTypeDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperProjectTypeToForm(detail: Pick<ProjectTypeDetail, 'name' | 'description' | 'active'>): ProjectTypeCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
    active: detail.active ? 'true' : 'false',
  }
}

export function mapperCreateProjectTypePayload(form: ProjectTypeCreateForm): ProjectTypeCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active == 'false' ? false : true

  return description.length > 0
    ? { name, description, active }
    : { name, active }
}

export function mapperUpdateProjectTypePayload(projectTypeId: number, form: ProjectTypeCreateForm): ProjectTypeUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active == 'false' ? false : true

  return description.length > 0
    ? { id: projectTypeId, name, description, active }
    : { id: projectTypeId, name, active }
}
