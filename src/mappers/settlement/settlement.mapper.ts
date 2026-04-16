import messages from '@/messages/messages'
import type {
  SettlementCreateForm,
  SettlementCreatePayload,
  SettlementDetail,
  SettlementDetailDocumentView,
  SettlementDetailView,
  SettlementPagedResponse,
  SettlementPagination,
  SettlementQuizAnswerView,
  SettlementQueryParams,
  SettlementRaw,
  SettlementTableRow,
  SettlementUpdatePayload,
  SettlementQuizAnswerPayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendParsedId, appendBooleanString } from '../shared/queryParams.mapper'
import { parseRequiredNumber, parseNullableId, parseNullableString, normalizeDateValue } from '../shared/form.mapper'
import { formatDate, resolveFileSize } from '@/utils'

export function mapperSettlementRows(result: SettlementRaw[]): SettlementTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    values: [
      item.employeeIdentification,
      item.employeeFullName,
      formatDate(item.endDate),
      item.legalTerminationCauseName,
      item.qualityOfWorkName,
      item.status,
      item.rehireEligible ? messages.settlement.ui.rehireYes : messages.settlement.ui.rehireNo,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperSettlementPagination(result: SettlementPagedResponse): SettlementPagination {
  return mapperPagination(result)
}

export function mapperSettlementQueryParams(result: SettlementQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendParsedId(params, 'statusId', result.statusId)
  appendParsedId(params, 'legalTerminationCauseId', result.legalTerminationCauseId)
  appendParsedId(params, 'qualityOfWorkId', result.qualityOfWorkId)
  appendParsedId(params, 'safetyComplianceId', result.safetyComplianceId)
  appendParsedId(params, 'noReHiredCauseId', result.noReHiredCauseId)
  appendBooleanString(params, 'rehireEligible', result.rehireEligible)
  appendString(params, 'endDateFrom', result.endDateFrom)
  appendString(params, 'endDateTo', result.endDateTo)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  return params
}

export function mapperSettlementDetailView(detail: SettlementDetail | null): SettlementDetailView | null {
  if (!detail) return null

  return {
    statusDisplay: detail.status,
    employeeFullNameDisplay: detail.employeeFullName,
    employeeIdentificationDisplay: detail.employeeIdentification,
    contractIdDisplay: String(detail.contractId),
    endDateDisplay: formatDate(detail.endDate),
    legalTerminationCauseNameDisplay: detail.legalTerminationCauseName,
    qualityOfWorkNameDisplay: detail.qualityOfWorkName,
    safetyComplianceNameDisplay: detail.safetyComplianceName,
    rehireEligibleDisplay: detail.rehireEligible
      ? messages.settlement.ui.rehireYes
      : messages.settlement.ui.rehireNo,
    noReHiredCauseNameDisplay: detail.noReHiredCauseName ?? '-',
    terminationDocumentUrl: detail.terminationDocumentUrl,
    observationsDisplay: detail.observations ?? '-',
    hrRequestIdDisplay: detail.hrRequestId != null ? String(detail.hrRequestId) : '-',
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
    documents: mapperSettlementDocuments(detail.documents),
    quizAnswers: mapperSettlementQuizAnswers(detail.quizAnswers),
  }
}

function mapperSettlementDocuments(documents: SettlementDetail['documents']): SettlementDetailDocumentView[] {
  if (!documents || documents.length === 0) return []
  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.fileName,
    sizeDisplay: resolveFileSize(doc.size),
    url: doc.url?.trim() ?? '',
  }))
}

function mapperSettlementQuizAnswers(quizAnswers: SettlementDetail['quizAnswers']): SettlementQuizAnswerView[] {
  if (!quizAnswers || quizAnswers.length === 0) return []
  return quizAnswers.map((quizAnswer) => ({
    questionId: quizAnswer.questionId,
    questionTextDisplay: quizAnswer.questionText?.trim() || '-',
    questionGroupNameDisplay: quizAnswer.questionGroupName?.trim() || 'Sin grupo',
    answerDisplay: quizAnswer.answer?.trim() || '-',
  }))
}

// ─── Create / Update helpers ────────────────────────────────────────────────

export function mapperCreateSettlementFormData(payload: SettlementCreatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperUpdateSettlementFormData(payload: SettlementUpdatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperCreateSettlementPayload(
  form: SettlementCreateForm,
  quizAnswers: SettlementQuizAnswerPayload[] = [],
): SettlementCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    endDate: form.endDate.trim(),
    legalTerminationCauseId: parseRequiredNumber(form.legalTerminationCauseId),
    qualityOfWorkId: parseRequiredNumber(form.qualityOfWorkId),
    safetyComplianceId: parseRequiredNumber(form.safetyComplianceId),
    rehireEligible: form.rehireEligible === 'true',
    noReHiredCauseId: parseNullableId(form.noReHiredCauseId),
    observations: parseNullableString(form.observations),
    hrRequestId: parseNullableId(form.hrRequestId),
    quizAnswers,
  }
}

export function mapperUpdateSettlementPayload(id: number, form: SettlementCreateForm): SettlementUpdatePayload {
  return {
    id,
    endDate: form.endDate.trim(),
    legalTerminationCauseId: parseRequiredNumber(form.legalTerminationCauseId),
    qualityOfWorkId: parseRequiredNumber(form.qualityOfWorkId),
    safetyComplianceId: parseRequiredNumber(form.safetyComplianceId),
    rehireEligible: form.rehireEligible === 'true',
    noReHiredCauseId: parseNullableId(form.noReHiredCauseId),
    observations: parseNullableString(form.observations),
    hrRequestId: parseNullableId(form.hrRequestId),
  }
}

export function mapperSettlementDetailToForm(detail: SettlementDetail): SettlementCreateForm {
  return {
    employeeId: String(detail.employeeId),
    endDate: normalizeDateValue(detail.endDate),
    legalTerminationCauseId: String(detail.legalTerminationCauseId),
    qualityOfWorkId: String(detail.qualityOfWorkId),
    safetyComplianceId: String(detail.safetyComplianceId),
    rehireEligible: detail.rehireEligible ? 'true' : 'false',
    noReHiredCauseId: detail.noReHiredCauseId != null ? String(detail.noReHiredCauseId) : '',
    observations: detail.observations ?? '',
    hrRequestId: detail.hrRequestId != null ? String(detail.hrRequestId) : '',
  }
}
