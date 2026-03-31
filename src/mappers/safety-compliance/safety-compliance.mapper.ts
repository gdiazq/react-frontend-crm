import messages from '@/messages/messages'
import type {
  SafetyComplianceCreateForm,
  SafetyComplianceCreatePayload,
  SafetyComplianceDetail,
  SafetyComplianceDetailView,
  SafetyCompliancePagedResponse,
  SafetyCompliancePagination,
  SafetyComplianceQueryParams,
  SafetyComplianceRaw,
  SafetyComplianceTableRow,
  SafetyComplianceUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperSafetyComplianceRows(result: SafetyComplianceRaw[]): SafetyComplianceTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.active ? messages.safetyCompliance.ui.statusActive : messages.safetyCompliance.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperSafetyCompliancePagination(result: SafetyCompliancePagedResponse): SafetyCompliancePagination {
  return mapperPagination(result)
}

export function mapperSafetyComplianceQueryParams(result: SafetyComplianceQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperSafetyComplianceDetailView(detail: SafetyComplianceDetail | null): SafetyComplianceDetailView | null {
  if (!detail) return null

  return {
    nameDisplay: detail.name,
    descriptionDisplay: detail.description || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperSafetyComplianceToForm(detail: Pick<SafetyComplianceDetail, 'name' | 'description' | 'active'>): SafetyComplianceCreateForm {
  return {
    name: detail.name || '',
    description: detail.description || '',
    active: detail.active ? 'true' : 'false',
  }
}

export function mapperCreateSafetyCompliancePayload(form: SafetyComplianceCreateForm): SafetyComplianceCreatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active == 'false' ? false : true

  return description.length > 0
    ? { name, description, active }
    : { name, active }
}

export function mapperUpdateSafetyCompliancePayload(id: number, form: SafetyComplianceCreateForm): SafetyComplianceUpdatePayload {
  const name = form.name.trim()
  const description = form.description.trim()
  const active = form.active == 'false' ? false : true

  return description.length > 0
    ? { id, name, description, active }
    : { id, name, active }
}
