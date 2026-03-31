import messages from '@/messages/messages'
import type {
  LegalTerminationCauseCreateForm,
  LegalTerminationCauseCreatePayload,
  LegalTerminationCauseDetail,
  LegalTerminationCauseDetailView,
  LegalTerminationCausePagedResponse,
  LegalTerminationCauseRaw,
  LegalTerminationCauseTableRow,
  LegalTerminationCausesPagination,
  LegalTerminationCausesQueryParams,
  LegalTerminationCauseUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperLegalTerminationCausesRows(result: LegalTerminationCauseRaw[]): LegalTerminationCauseTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.legalTerminationCauses.ui.statusActive : messages.legalTerminationCauses.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperLegalTerminationCausesPagination(result: LegalTerminationCausePagedResponse): LegalTerminationCausesPagination {
  return mapperPagination(result)
}

export function mapperLegalTerminationCausesQueryParams(result: LegalTerminationCausesQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperLegalTerminationCauseDetailView(detail: LegalTerminationCauseDetail | null): LegalTerminationCauseDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperLegalTerminationCauseToForm(detail: Pick<LegalTerminationCauseDetail, 'name' | 'description'>): LegalTerminationCauseCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
  }
}

export function mapperCreateLegalTerminationCausePayload(form: LegalTerminationCauseCreateForm): LegalTerminationCauseCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { name, description }
    : { name }
}

export function mapperUpdateLegalTerminationCausePayload(legalTerminationCauseId: number, form: LegalTerminationCauseCreateForm): LegalTerminationCauseUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()

  return description.length > 0
    ? { id: legalTerminationCauseId, name, description }
    : { id: legalTerminationCauseId, name }
}
