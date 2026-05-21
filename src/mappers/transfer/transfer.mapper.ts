import type {
  TransferCreateForm,
  TransferCreatePayload,
  TransferDetail,
  TransferDetailView,
  TransferDocumentView,
  TransferExistingFileView,
  TransferPagedResponse,
  TransferPagination,
  TransferQueryParams,
  TransferRaw,
  TransferTableRow,
  TransferUpdatePayload,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'
import { normalizeDateValue, parseRequiredNumber } from '../shared/form.mapper'
import { formatDate } from '@/utils'

export function mapperTransferRows(result: TransferRaw[]): TransferTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    values: [
      item.employeeFullName,
      item.employeeIdentification,
      item.fromCostCenterName,
      item.toCostCenterName,
      formatDate(item.effectiveDate),
      item.status,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperTransferPagination(result: TransferPagedResponse): TransferPagination {
  return mapperPagination(result)
}

export function mapperTransferQueryParams(result: TransferQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendString(params, 'status', result.status)
  appendParsedId(params, 'toCostCenter', result.toCostCenter)
  appendString(params, 'effectiveDateFrom', result.effectiveDateFrom)
  appendString(params, 'effectiveDateTo', result.effectiveDateTo)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperTransferDetailView(detail: TransferDetail | null): TransferDetailView | null {
  if (!detail) return null

  return {
    statusDisplay: detail.status,
    employeeFullNameDisplay: detail.employeeFullName,
    employeeIdentificationDisplay: detail.employeeIdentification,
    fromCostCenterNameDisplay: detail.fromCostCenterName,
    toCostCenterNameDisplay: detail.toCostCenterName,
    effectiveDateDisplay: formatDate(detail.effectiveDate),
    reasonDisplay: detail.reason,
    hrRequestIdDisplay: detail.hrRequestId != null ? String(detail.hrRequestId) : '-',
    createdAtDisplay: formatDate(detail.createdAt),
    updatedAtDisplay: formatDate(detail.updatedAt),
    documents: mapperTransferDocuments(detail.documents),
  }
}

function mapperTransferDocuments(documents: TransferDetail['documents']): TransferDocumentView[] {
  if (!documents || documents.length === 0) return []
  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.fileName,
    url: doc.url?.trim() ?? '',
  }))
}

export function mapperTransferExistingFiles(documents: TransferDetail['documents']): TransferExistingFileView[] {
  if (!documents || documents.length === 0) return []
  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.fileName,
    size: 0,
    url: doc.url,
  }))
}

export function mapperCreateTransferFormData(payload: TransferCreatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperUpdateTransferFormData(payload: TransferUpdatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperCreateTransferPayload(form: TransferCreateForm): TransferCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    toCostCenter: parseRequiredNumber(form.toCostCenter),
    effectiveDate: form.effectiveDate.trim(),
    reason: form.reason.trim(),
  }
}

export function mapperUpdateTransferPayload(id: number, form: TransferCreateForm): TransferUpdatePayload {
  return {
    id,
    toCostCenter: parseRequiredNumber(form.toCostCenter),
    effectiveDate: form.effectiveDate.trim(),
    reason: form.reason.trim(),
  }
}

export function mapperTransferDetailToForm(detail: TransferDetail): TransferCreateForm {
  return {
    employeeId: String(detail.employeeId),
    toCostCenter: String(detail.toCostCenter),
    effectiveDate: normalizeDateValue(detail.effectiveDate),
    reason: detail.reason,
  }
}
