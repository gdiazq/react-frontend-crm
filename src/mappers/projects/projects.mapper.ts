import messages from '@/messages/messages'
import type {
  ProjectPagedResponse,
  ProjectRaw,
  ProjectsPagination,
  ProjectsQueryParams,
  ProjectTableRow,
} from '@/types'
import { formatDate } from '@/utils'

export function mapperProjectsRows(result: ProjectRaw[]): ProjectTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    typeId: item.typeId ?? null,
    statusId: item.statusId ?? null,
    specialtyId: item.specialtyId ?? null,
    values: [
      Number.isFinite(item.costCenter) ? String(item.costCenter) : '-',
      item.name || '-',
      item.typeId != null ? String(item.typeId) : '-',
      item.statusId != null ? String(item.statusId) : '-',
      item.specialtyId != null ? String(item.specialtyId) : '-',
      item.visitorName || '-',
      item.supervisorName || '-',
      formatDate(item.startDate ?? undefined, '-'),
      formatDate(item.endDate ?? undefined, '-'),
      item.active ? messages.projects.ui.statusActive : messages.projects.ui.statusInactive,
      formatDate(item.createdAt, '-'),
      formatDate(item.updatedAt, '-'),
    ],
  }))
}

export function mapperProjectsPagination(result: ProjectPagedResponse): ProjectsPagination {
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 8
  const totalElements = result.totalElements ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.totalActive ?? result.active ?? 0
  const first = result.first ?? page === 0
  const last = result.last ?? page >= totalPages - 1

  return { page, size, totalElements, totalPages, total, active, first, last }
}

export function mapperProjectsQueryParams(result: ProjectsQueryParams): Record<string, number | string> {
  const search = result.search.trim()
  const active = result.active.trim()
  const typeId = result.typeId.trim()
  const statusId = result.statusId.trim()
  const specialtyId = result.specialtyId.trim()
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
  if (active === 'true' || active === 'false') queryParams.active = active

  if (typeId.length > 0) {
    const parsedTypeId = Number(typeId)
    if (Number.isInteger(parsedTypeId) && parsedTypeId > 0) queryParams.typeId = parsedTypeId
  }

  if (statusId.length > 0) {
    const parsedStatusId = Number(statusId)
    if (Number.isInteger(parsedStatusId) && parsedStatusId > 0) queryParams.statusId = parsedStatusId
  }

  if (specialtyId.length > 0) {
    const parsedSpecialtyId = Number(specialtyId)
    if (Number.isInteger(parsedSpecialtyId) && parsedSpecialtyId > 0) queryParams.specialtyId = parsedSpecialtyId
  }

  if (createdFrom.length > 0) queryParams.createdFrom = createdFrom
  if (createdTo.length > 0) queryParams.createdTo = createdTo
  if (updatedFrom.length > 0) queryParams.updatedFrom = updatedFrom
  if (updatedTo.length > 0) queryParams.updatedTo = updatedTo

  return queryParams
}
