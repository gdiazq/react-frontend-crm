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
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
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
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
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
  const active = form.active !== 'false'

  return description.length > 0
    ? { name, description, active }
    : { name, active }
}

export function mapperUpdateProjectTypePayload(projectTypeId: number, form: ProjectTypeCreateForm): ProjectTypeUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active !== 'false'

  return description.length > 0
    ? { id: projectTypeId, name, description, active }
    : { id: projectTypeId, name, active }
}
