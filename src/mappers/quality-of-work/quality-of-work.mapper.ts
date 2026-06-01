import messages from '@/messages/messages'
import type {
  QualityOfWorkCreateForm,
  QualityOfWorkCreatePayload,
  QualityOfWorkDetail,
  QualityOfWorkDetailView,
  QualityOfWorkPagedResponse,
  QualityOfWorkRaw,
  QualityOfWorkTableRow,
  QualityOfWorkPagination,
  QualityOfWorkQueryParams,
  QualityOfWorkUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperQualityOfWorkRows(result: QualityOfWorkRaw[]): QualityOfWorkTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.qualityOfWork.ui.statusActive : messages.qualityOfWork.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperQualityOfWorkPagination(result: QualityOfWorkPagedResponse): QualityOfWorkPagination {
  return mapperPagination(result)
}

export function mapperQualityOfWorkQueryParams(result: QualityOfWorkQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperQualityOfWorkDetailView(detail: QualityOfWorkDetail | null): QualityOfWorkDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperQualityOfWorkToForm(detail: Pick<QualityOfWorkDetail, 'name' | 'description' | 'active'>): QualityOfWorkCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
    active: detail.active ? 'true' : 'false',
  }
}

export function mapperCreateQualityOfWorkPayload(form: QualityOfWorkCreateForm): QualityOfWorkCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active !== 'false'

  return description.length > 0
    ? { name, description, active }
    : { name, active }
}

export function mapperUpdateQualityOfWorkPayload(id: number, form: QualityOfWorkCreateForm): QualityOfWorkUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active !== 'false'

  return description.length > 0
    ? { id, name, description, active }
    : { id, name, active }
}
