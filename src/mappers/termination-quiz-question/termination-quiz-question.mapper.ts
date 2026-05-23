import messages from '@/messages/messages'
import type {
  ContractSelectOption,
  SettlementYesNoOption,
  TerminationQuizQuestionCreateForm,
  TerminationQuizQuestionCreatePayload,
  TerminationQuizQuestionDetail,
  TerminationQuizQuestionDetailView,
  TerminationQuizQuestionPagedResponse,
  TerminationQuizQuestionPagination,
  TerminationQuizQuestionQueryParams,
  TerminationQuizQuestionRaw,
  TerminationQuizQuestionSelectOption,
  TerminationQuizQuestionTableRow,
  TerminationQuizQuestionUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendBooleanString, appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

export function mapperTerminationQuizQuestionRows(result: TerminationQuizQuestionRaw[]): TerminationQuizQuestionTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.question,
      item.questionGroupName,
      item.required ? 'Sí' : 'No',
      item.active ? messages.terminationQuizQuestion.ui.statusActive : messages.terminationQuizQuestion.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperTerminationQuizQuestionPagination(result: TerminationQuizQuestionPagedResponse): TerminationQuizQuestionPagination {
  const base = mapperPagination(result)
  return {
    ...base,
    active: result.totalActive ?? result.active ?? base.active,
  }
}

export function mapperTerminationQuizQuestionQueryParams(result: TerminationQuizQuestionQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'questionGroup', result.questionGroup)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperTerminationQuizQuestionSelectOptions(options: ContractSelectOption[]): TerminationQuizQuestionSelectOption[] {
  return options.map((option) => ({ label: option.name, value: String(option.id) }))
}

export function mapperTerminationQuizQuestionYesNoSelectOptions(options: SettlementYesNoOption[]): TerminationQuizQuestionSelectOption[] {
  return options.map((option) => ({ label: option.name ? 'Sí' : 'No', value: String(option.name) }))
}

export function mapperTerminationQuizQuestionDetailView(detail: TerminationQuizQuestionDetail | null): TerminationQuizQuestionDetailView | null {
  if (!detail) return null

  return {
    questionDisplay: detail.question,
    questionGroupDisplay: detail.questionGroupName || '-',
    required: detail.required,
    employeeDisplay: detail.employeeName?.trim() || '-',
    active: detail.active,
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperTerminationQuizQuestionToForm(detail: TerminationQuizQuestionDetail): TerminationQuizQuestionCreateForm {
  return {
    question: detail.question || '',
    questionGroup: detail.questionGroupName || '',
    required: detail.required ? 'true' : 'false',
    employeeId: detail.employeeId ? String(detail.employeeId) : '',
  }
}

export function mapperCreateTerminationQuizQuestionPayload(form: TerminationQuizQuestionCreateForm): TerminationQuizQuestionCreatePayload {
  const question = form.question.trim()
  const questionGroup = form.questionGroup.trim()
  const required = form.required !== 'false'
  const employeeIdNum = parseInt(form.employeeId, 10)

  const payload: TerminationQuizQuestionCreatePayload = {
    question,
    questionGroup,
    required,
  }
  if (Number.isInteger(employeeIdNum) && employeeIdNum > 0) payload.employeeId = employeeIdNum
  return payload
}

export function mapperUpdateTerminationQuizQuestionPayload(id: number, form: TerminationQuizQuestionCreateForm): TerminationQuizQuestionUpdatePayload {
  const question = form.question.trim()
  const questionGroup = form.questionGroup.trim()
  const required = form.required !== 'false'
  const employeeIdNum = parseInt(form.employeeId, 10)

  const payload: TerminationQuizQuestionUpdatePayload = {
    id,
    question,
    questionGroup,
    required,
  }
  if (Number.isInteger(employeeIdNum) && employeeIdNum > 0) payload.employeeId = employeeIdNum
  return payload
}
