import messages from '@/messages/messages'
import type {
  ProjectCreateForm,
  ProjectCreatePayload,
  ProjectDetail,
  ProjectDetailView,
  ProjectPagedResponse,
  ProjectRaw,
  ProjectUpdatePayload,
  ProjectsPagination,
  ProjectsQueryParams,
  ProjectTableRow,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString, appendParsedId } from '../shared/queryParams.mapper'
import { formatDate, formatDateTime } from '@/utils'

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
      '',
    ],
  }))
}

export function mapperProjectsPagination(result: ProjectPagedResponse): ProjectsPagination {
  return mapperPagination({ ...result, active: result.totalActive ?? result.active })
}

export function mapperProjectsQueryParams(result: ProjectsQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendParsedId(params, 'typeId', result.typeId)
  appendParsedId(params, 'statusId', result.statusId)
  appendParsedId(params, 'specialtyId', result.specialtyId)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

function parseRequiredNumber(value: string): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

function parseNullableId(value: string): number | null {
  const normalized = value.trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function parseNullableString(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

function parseNullableNumberArray(values: string[]): number[] | null {
  const parsed = values
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0)
  return parsed.length > 0 ? parsed : null
}

export function mapperCreateProjectPayload(form: ProjectCreateForm): ProjectCreatePayload {
  return {
    costCenter: parseRequiredNumber(form.costCenter),
    name: form.name.trim(),
    address: parseNullableString(form.address),
    description: parseNullableString(form.description),
    typeId: parseNullableId(form.typeId),
    statusId: parseNullableId(form.statusId),
    specialtyId: parseNullableId(form.specialtyId),
    visitorId: parseNullableId(form.visitorId),
    supervisorId: parseNullableId(form.supervisorId),
    companyRepresentativeIds: parseNullableNumberArray(form.companyRepresentativeIds),
    startDate: parseNullableString(form.startDate),
    realStartDate: parseNullableString(form.realStartDate),
    endDate: parseNullableString(form.endDate),
    realEndDate: parseNullableString(form.realEndDate),
  }
}

export function mapperProjectToForm(detail: ProjectDetail): ProjectCreateForm {
  return {
    costCenter: Number.isFinite(detail.costCenter) ? String(detail.costCenter) : '',
    name: detail.name || '',
    address: detail.address || '',
    description: detail.description || '',
    typeId: detail.typeId != null ? String(detail.typeId) : '',
    statusId: detail.statusId != null ? String(detail.statusId) : '',
    specialtyId: detail.specialtyId != null ? String(detail.specialtyId) : '',
    visitorId: detail.visitorId != null ? String(detail.visitorId) : '',
    supervisorId: detail.supervisorId != null ? String(detail.supervisorId) : '',
    companyRepresentativeIds: Array.isArray(detail.companyRepresentativeIds)
      ? detail.companyRepresentativeIds.map((value) => String(value))
      : [],
    startDate: detail.startDate || '',
    realStartDate: detail.realStartDate || '',
    endDate: detail.endDate || '',
    realEndDate: detail.realEndDate || '',
  }
}

export function mapperUpdateProjectPayload(projectId: number, form: ProjectCreateForm): ProjectUpdatePayload {
  const payload: ProjectUpdatePayload = { id: projectId }
  const parsedCostCenter = parseRequiredNumber(form.costCenter)
  const name = form.name.trim()
  const address = parseNullableString(form.address)
  const description = parseNullableString(form.description)
  const typeId = parseNullableId(form.typeId)
  const statusId = parseNullableId(form.statusId)
  const specialtyId = parseNullableId(form.specialtyId)
  const visitorId = parseNullableId(form.visitorId)
  const supervisorId = parseNullableId(form.supervisorId)
  const companyRepresentativeIds = parseNullableNumberArray(form.companyRepresentativeIds)
  const startDate = parseNullableString(form.startDate)
  const realStartDate = parseNullableString(form.realStartDate)
  const endDate = parseNullableString(form.endDate)
  const realEndDate = parseNullableString(form.realEndDate)

  if (parsedCostCenter > 0) payload.costCenter = parsedCostCenter
  if (name.length > 0) payload.name = name
  if (address !== null) payload.address = address
  if (description !== null) payload.description = description
  if (typeId !== null) payload.typeId = typeId
  if (statusId !== null) payload.statusId = statusId
  if (specialtyId !== null) payload.specialtyId = specialtyId
  if (visitorId !== null) payload.visitorId = visitorId
  if (supervisorId !== null) payload.supervisorId = supervisorId
  if (companyRepresentativeIds !== null) payload.companyRepresentativeIds = companyRepresentativeIds
  if (startDate !== null) payload.startDate = startDate
  if (realStartDate !== null) payload.realStartDate = realStartDate
  if (endDate !== null) payload.endDate = endDate
  if (realEndDate !== null) payload.realEndDate = realEndDate

  return payload
}

export function mapperProjectDetailView(detail: ProjectDetail | null): ProjectDetailView | null {
  if (!detail) return null

  const companyRepresentatives = Array.isArray(detail.companyRepresentativeNames) ? detail.companyRepresentativeNames : []

  return {
    projectName: detail.name,
    costCenterDisplay: String(detail.costCenter),
    typeName: detail.typeName ?? '',
    statusName: detail.statusName ?? '',
    specialtyName: detail.specialtyName ?? '',
    addressDisplay: detail.address ?? '',
    descriptionDisplay: detail.description ?? '',
    visitorName: detail.visitorName ?? '',
    supervisorName: detail.supervisorName ?? '',
    companyRepresentativesDisplay: companyRepresentatives.join(', '),
    startDateDisplay: formatDate(detail.startDate || ''),
    realStartDateDisplay: formatDate(detail.realStartDate || ''),
    endDateDisplay: formatDate(detail.endDate || ''),
    realEndDateDisplay: formatDate(detail.realEndDate || ''),
    active: detail.active,
    createdAtDisplay: formatDateTime(detail.createdAt),
    updatedAtDisplay: formatDateTime(detail.updatedAt),
  }
}
