import messages from '@/messages/messages'
import type {
  NoRehireCauseCreateForm,
  NoRehireCauseCreatePayload,
  NoRehireCauseDetail,
  NoRehireCauseDetailView,
  NoRehireCausePagedResponse,
  NoRehireCausePagination,
  NoRehireCauseQueryParams,
  NoRehireCauseRaw,
  NoRehireCauseTableRow,
  NoRehireCauseUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperNoRehireCauseRows(result: NoRehireCauseRaw[]): NoRehireCauseTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.noRehireCause.ui.statusActive : messages.noRehireCause.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperNoRehireCausePagination(result: NoRehireCausePagedResponse): NoRehireCausePagination {
  return mapperPagination(result)
}

export function mapperNoRehireCauseQueryParams(result: NoRehireCauseQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperNoRehireCauseDetailView(detail: NoRehireCauseDetail | null): NoRehireCauseDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperNoRehireCauseToForm(detail: Pick<NoRehireCauseDetail, 'name' | 'description' | 'active'>): NoRehireCauseCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
    active: detail.active ? 'true' : 'false',
  }
}

export function mapperCreateNoRehireCausePayload(form: NoRehireCauseCreateForm): NoRehireCauseCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active == 'false' ? false : true

  return description.length > 0
    ? { name, description, active }
    : { name, active }
}

export function mapperUpdateNoRehireCausePayload(id: number, form: NoRehireCauseCreateForm): NoRehireCauseUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active == 'false' ? false : true

  return description.length > 0
    ? { id, name, description, active }
    : { id, name, active }
}
