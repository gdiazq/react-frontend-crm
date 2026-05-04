import type {
  LeaveCreateForm,
  LeaveCreatePayload,
  LeaveDetail,
  LeaveDetailDocumentView,
  LeaveDetailView,
  LeavePagedResponse,
  LeaveRaw,
  LeaveTableRow,
  LeaveUpdatePayload,
  LeavesPagination,
  LeavesQueryParams,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'
import { normalizeDateValue, parseNullableString, parseRequiredNumber } from '../shared/form.mapper'
import { formatDate, formatDateTime, formatNumber, resolveFileSize } from '@/utils'

export function mapperLeavesRows(result: LeaveRaw[]): LeaveTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    status: item.status,
    values: [
      item.employeeIdentification,
      item.employeeFullName,
      item.leaveTypeName,
      formatDate(item.startDate, 'Sin registro'),
      formatDate(item.endDate, 'Sin registro'),
      formatNumber(item.totalDays),
      item.status,
      formatDate(item.createdAt, 'Sin registro'),
      '',
    ],
  }))
}

export function mapperLeavesPagination(result: LeavePagedResponse): LeavesPagination {
  return {
    ...mapperPagination(result),
    pending: result.pending ?? 0,
  }
}

export function mapperLeavesQueryParams(result: LeavesQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendString(params, 'status', result.status)
  appendParsedId(params, 'leaveTypeId', result.leaveTypeId)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendString(params, 'startFrom', result.startFrom)
  appendString(params, 'startTo', result.startTo)
  appendString(params, 'endFrom', result.endFrom)
  appendString(params, 'endTo', result.endTo)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

function mapperLeaveDocuments(documents: LeaveDetail['documents']): LeaveDetailDocumentView[] {
  if (!documents || documents.length === 0) return []

  return documents.map((document) => ({
    id: document.id,
    fileName: document.fileName,
    contentType: document.contentType ?? '',
    sizeDisplay: resolveFileSize(document.size ?? 0),
    createdAtDisplay: formatDateTime(document.createdAt || '', 'Sin registro'),
    url: document.url?.trim() ?? '',
  }))
}

export function mapperCreateLeavePayload(form: LeaveCreateForm): LeaveCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    leaveTypeId: parseRequiredNumber(form.leaveTypeId),
    startDate: form.startDate.trim(),
    endDate: form.endDate.trim(),
    halfDay: form.halfDay === 'true',
    reason: parseNullableString(form.reason),
  }
}

export function mapperUpdateLeavePayload(leaveId: number, form: LeaveCreateForm): LeaveUpdatePayload {
  return {
    id: leaveId,
    leaveTypeId: parseRequiredNumber(form.leaveTypeId),
    startDate: form.startDate.trim(),
    endDate: form.endDate.trim(),
    halfDay: form.halfDay === 'true',
    reason: parseNullableString(form.reason),
  }
}

export function mapperLeaveDetailToForm(detail: LeaveDetail): LeaveCreateForm {
  return {
    employeeId: String(detail.employeeId),
    leaveTypeId: String(detail.leaveTypeId),
    startDate: normalizeDateValue(detail.startDate),
    endDate: normalizeDateValue(detail.endDate),
    halfDay: detail.halfDay ? 'true' : 'false',
    reason: detail.reason ?? '',
  }
}

export function mapperLeaveDetailView(detail: LeaveDetail | null): LeaveDetailView | null {
  if (!detail) return null

  return {
    id: detail.id,
    statusName: detail.status,
    employeeId: detail.employeeId,
    employeeName: detail.employeeFullName || '',
    employeeIdentification: detail.employeeIdentification || '',
    leaveTypeId: detail.leaveTypeId,
    leaveTypeName: detail.leaveTypeName || '',
    paid: detail.paid,
    paidDisplay: detail.paid ? 'Sí' : 'No',
    requiresDocument: detail.requiresDocument,
    requiresDocumentDisplay: detail.requiresDocument ? 'Sí' : 'No',
    requireApproval: detail.requireApproval,
    requireApprovalDisplay: detail.requireApproval ? 'Sí' : 'No',
    startDateDisplay: formatDate(detail.startDate, 'Sin registro'),
    endDateDisplay: formatDate(detail.endDate, 'Sin registro'),
    halfDay: detail.halfDay,
    halfDayDisplay: detail.halfDay ? 'Sí' : 'No',
    totalDaysDisplay: formatNumber(detail.totalDays),
    reasonText: detail.reason || '',
    documents: mapperLeaveDocuments(detail.documents),
    createdAtDisplay: formatDateTime(detail.createdAt || '', 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt || '', 'Sin registro'),
  }
}

export function mapperCreateLeaveFormData(payload: LeaveCreatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperUpdateLeaveFormData(payload: LeaveUpdatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}
