import messages from '@/messages/messages'
import type {
  ProjectSpecialtyCreateForm,
  ProjectSpecialtyCreatePayload,
  ProjectSpecialtyDetail,
  ProjectSpecialtyDetailView,
  ProjectSpecialtyPagedResponse,
  ProjectSpecialtyRaw,
  ProjectSpecialtyTableRow,
  ProjectSpecialtiesPagination,
  ProjectSpecialtiesQueryParams,
  ProjectSpecialtyUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperProjectSpecialtiesRows(result: ProjectSpecialtyRaw[]): ProjectSpecialtyTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.projectSpecialties.ui.statusActive : messages.projectSpecialties.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperProjectSpecialtiesPagination(result: ProjectSpecialtyPagedResponse): ProjectSpecialtiesPagination {
  return mapperPagination(result)
}

export function mapperProjectSpecialtiesQueryParams(result: ProjectSpecialtiesQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperProjectSpecialtyDetailView(detail: ProjectSpecialtyDetail | null): ProjectSpecialtyDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperProjectSpecialtyToForm(detail: Pick<ProjectSpecialtyDetail, 'name' | 'description'>): ProjectSpecialtyCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
  }
}

export function mapperCreateProjectSpecialtyPayload(form: ProjectSpecialtyCreateForm): ProjectSpecialtyCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { name, description }
    : { name }
}

export function mapperUpdateProjectSpecialtyPayload(projectSpecialtyId: number, form: ProjectSpecialtyCreateForm): ProjectSpecialtyUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { id: projectSpecialtyId, name, description }
    : { id: projectSpecialtyId, name }
}
