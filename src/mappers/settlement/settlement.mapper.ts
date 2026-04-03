import messages from '@/messages/messages'
import type {
  SettlementDetail,
  SettlementDetailDocumentView,
  SettlementDetailView,
  SettlementPagedResponse,
  SettlementPagination,
  SettlementQueryParams,
  SettlementRaw,
  SettlementTableRow,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendParsedId, appendBooleanString } from '../shared/queryParams.mapper'
import { formatDate } from '@/utils'

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
  appendString(params, 'status', result.status)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'legalTerminationCauseId', result.legalTerminationCauseId)
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
  }
}

function resolveFileSize(size: number): string {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${size} B`
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
