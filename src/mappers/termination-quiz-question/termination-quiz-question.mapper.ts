import messages from '@/messages/messages'
import type {
  TerminationQuizQuestionCreateForm,
  TerminationQuizQuestionCreatePayload,
  TerminationQuizQuestionDetail,
  TerminationQuizQuestionDetailView,
  TerminationQuizQuestionPagedResponse,
  TerminationQuizQuestionPagination,
  TerminationQuizQuestionQueryParams,
  TerminationQuizQuestionRaw,
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
      item.questionGroup,
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

export function mapperTerminationQuizQuestionDetailView(detail: TerminationQuizQuestionDetail | null): TerminationQuizQuestionDetailView | null {
  if (!detail) return null

  return {
    questionDisplay: detail.question,
    questionGroupDisplay: detail.questionGroup || '-',
    required: detail.required,
    displayOrderDisplay: String(detail.displayOrder),
    employeeIdDisplay: detail.employeeId ? String(detail.employeeId) : '-',
    active: detail.active,
    optionLabels: detail.options?.map((o) => o.label) ?? [],
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
  }
}

export function mapperTerminationQuizQuestionToForm(detail: TerminationQuizQuestionDetail): TerminationQuizQuestionCreateForm {
  return {
    question: detail.question || '',
    questionGroup: detail.questionGroup || '',
    required: detail.required ? 'true' : 'false',
    displayOrder: String(detail.displayOrder ?? 1),
    employeeId: detail.employeeId ? String(detail.employeeId) : '',
    options: detail.options?.length
      ? detail.options.map((o) => ({ label: o.label, displayOrder: String(o.displayOrder) }))
      : [{ label: '', displayOrder: '1' }],
  }
}

export function mapperCreateTerminationQuizQuestionPayload(form: TerminationQuizQuestionCreateForm): TerminationQuizQuestionCreatePayload {
  const question = form.question.trim()
  const questionGroup = form.questionGroup.trim()
  const required = form.required !== 'false'
  const displayOrder = parseInt(form.displayOrder, 10) || 1
  const employeeIdNum = parseInt(form.employeeId, 10)
  const options = form.options
    .filter((o) => o.label.trim().length > 0)
    .map((o, i) => ({ label: o.label.trim(), displayOrder: parseInt(o.displayOrder, 10) || i + 1 }))

  const payload: TerminationQuizQuestionCreatePayload = { question, questionGroup, required, displayOrder, options }
  if (Number.isInteger(employeeIdNum) && employeeIdNum > 0) payload.employeeId = employeeIdNum
  return payload
}

export function mapperUpdateTerminationQuizQuestionPayload(id: number, form: TerminationQuizQuestionCreateForm): TerminationQuizQuestionUpdatePayload {
  const question = form.question.trim()
  const questionGroup = form.questionGroup.trim()
  const required = form.required !== 'false'
  const displayOrder = parseInt(form.displayOrder, 10) || 1
  const employeeIdNum = parseInt(form.employeeId, 10)
  const options = form.options
    .filter((o) => o.label.trim().length > 0)
    .map((o, i) => ({ label: o.label.trim(), displayOrder: parseInt(o.displayOrder, 10) || i + 1 }))

  const payload: TerminationQuizQuestionUpdatePayload = { id, question, questionGroup, required, displayOrder, options }
  if (Number.isInteger(employeeIdNum) && employeeIdNum > 0) payload.employeeId = employeeIdNum
  return payload
}
