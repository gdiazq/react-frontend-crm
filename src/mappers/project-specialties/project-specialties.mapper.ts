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
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 10
  const totalElements = result.totalElements ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.active ?? 0
  const first = result.first ?? page == 0
  const last = result.last ?? page >= totalPages - 1

  return { page, size, totalElements, totalPages, total, active, first, last }
}

export function mapperProjectSpecialtiesQueryParams(result: ProjectSpecialtiesQueryParams): Record<string, number | string> {
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
