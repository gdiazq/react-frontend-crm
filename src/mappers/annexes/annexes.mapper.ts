import type {
  AnnexCreateForm,
  AnnexCreatePayload,
  AnnexDetail,
  AnnexDetailDocumentView,
  AnnexDetailView,
  AnnexPagedResponse,
  AnnexRaw,
  AnnexTableRow,
  AnnexUpdatePayload,
  AnnexesPagination,
  AnnexesQueryParams,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'
import { normalizeDateValue, parseNullableString, parseRequiredNumber } from '../shared/form.mapper'
import { formatDate, formatDateTime } from '@/utils'

export function mapperAnnexesRows(result: AnnexRaw[]): AnnexTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.requireApproval === false,
    values: [
      item.employeeIdentification,
      item.employeeFullName,
      item.annexTypeName,
      formatDate(item.date),
      item.status,
      formatDate(item.createdAt),
      formatDate(item.updatedAt || '', 'Sin registro'),
      '',
    ],
  }))
}

export function mapperAnnexesPagination(result: AnnexPagedResponse): AnnexesPagination {
  return mapperPagination(result)
}

export function mapperAnnexesQueryParams(result: AnnexesQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendString(params, 'status', result.status)
  appendParsedId(params, 'annexTypeId', result.annexTypeId)
  appendParsedId(params, 'contractId', result.contractId)
  appendString(params, 'dateFrom', result.dateFrom)
  appendString(params, 'dateTo', result.dateTo)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

function mapperAnnexDocuments(documents: AnnexDetail['documents']): AnnexDetailDocumentView[] {
  if (!documents || documents.length === 0) return []

  return documents.map((document) => ({
    id: document.id,
    fileName: document.fileName,
    uploadedAtDisplay: formatDateTime(document.uploadedAt || '', 'Sin registro'),
    url: document.fileUrl?.trim() ?? '',
  }))
}

export function mapperCreateAnnexPayload(form: AnnexCreateForm): AnnexCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    annexTypeId: parseRequiredNumber(form.annexTypeId),
    date: form.date.trim(),
    description: parseNullableString(form.description),
  }
}

export function mapperUpdateAnnexPayload(annexId: number, form: AnnexCreateForm): AnnexUpdatePayload {
  return {
    id: annexId,
    annexTypeId: parseRequiredNumber(form.annexTypeId),
    date: form.date.trim(),
    description: parseNullableString(form.description),
  }
}

export function mapperAnnexDetailToForm(detail: AnnexDetail): AnnexCreateForm {
  return {
    employeeId: String(detail.employeeId),
    annexTypeId: String(detail.annexTypeId),
    date: normalizeDateValue(detail.date),
    description: detail.description ?? '',
  }
}

export function mapperAnnexDetailView(detail: AnnexDetail | null): AnnexDetailView | null {
  if (!detail) return null

  return {
    id: detail.id,
    statusName: detail.status,
    employeeName: detail.employeeFullName || '',
    employeeIdentification: detail.employeeIdentification || '',
    contractId: detail.contractId,
    annexTypeName: detail.annexTypeName || '',
    requireApproval: detail.requireApproval,
    requireApprovalDisplay: detail.requireApproval ? 'Si' : 'No',
    dateDisplay: formatDate(detail.date, 'Sin registro'),
    descriptionText: detail.description || '',
    documents: mapperAnnexDocuments(detail.documents),
    hrRequestId: detail.hrRequestId ?? null,
    createdAtDisplay: formatDateTime(detail.createdAt || '', 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt || '', 'Sin registro'),
  }
}

export function mapperCreateAnnexFormData(payload: AnnexCreatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperUpdateAnnexFormData(payload: AnnexUpdatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}
