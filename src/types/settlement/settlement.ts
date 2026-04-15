import type { Pagination } from '../common'

export interface SettlementDocument {
  id: number
  fileName: string
  contentType?: string | null
  size: number
  url?: string | null
  entityType?: string | null
  entityId?: number | null
  createdAt?: string
}

export interface SettlementDetailDocumentView {
  id: number
  fileName: string
  sizeDisplay: string
  url: string
}

export interface SettlementRaw {
  id: number
  status: string
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  contractId: number
  endDate: string
  legalTerminationCauseId: number
  legalTerminationCauseName: string
  qualityOfWorkId: number
  qualityOfWorkName: string
  safetyComplianceId: number
  safetyComplianceName: string
  rehireEligible: boolean
  noReHiredCauseId: number | null
  noReHiredCauseName: string | null
  terminationDocumentUrl: string | null
  observations: string | null
  hrRequestId: number | null
  createdAt: string
  updatedAt: string
  documents?: SettlementDocument[]
}

export type SettlementDetail = SettlementRaw

export interface SettlementDetailView {
  statusDisplay: string
  employeeFullNameDisplay: string
  employeeIdentificationDisplay: string
  contractIdDisplay: string
  endDateDisplay: string
  legalTerminationCauseNameDisplay: string
  qualityOfWorkNameDisplay: string
  safetyComplianceNameDisplay: string
  rehireEligibleDisplay: string
  noReHiredCauseNameDisplay: string
  terminationDocumentUrl: string | null
  observationsDisplay: string
  hrRequestIdDisplay: string
  createdAtDisplay: string
  updatedAtDisplay: string
  documents: SettlementDetailDocumentView[]
}

export interface SettlementTableRow {
  id: string
  values: string[]
}

export type SettlementSortBy =
  | 'employeeFullName'
  | 'status'
  | 'endDate'
  | 'legalTerminationCauseName'
  | 'qualityOfWorkName'
  | 'rehireEligible'
  | 'createdAt'
  | 'updatedAt'

export interface SettlementCreateForm {
  employeeId: string
  endDate: string
  legalTerminationCauseId: string
  qualityOfWorkId: string
  safetyComplianceId: string
  rehireEligible: string
  noReHiredCauseId: string
  observations: string
  hrRequestId: string
}

export interface SettlementQuizAnswerPayload {
  questionId: number
  answer: string
}

export interface SettlementCreatePayload {
  employeeId: number
  endDate: string
  legalTerminationCauseId: number
  qualityOfWorkId: number
  safetyComplianceId: number
  rehireEligible: boolean
  noReHiredCauseId: number | null
  observations: string | null
  hrRequestId: number | null
  quizAnswers: SettlementQuizAnswerPayload[]
}

export interface SettlementUpdatePayload {
  id: number
  endDate: string
  legalTerminationCauseId: number
  qualityOfWorkId: number
  safetyComplianceId: number
  rehireEligible: boolean
  noReHiredCauseId: number | null
  observations: string | null
  hrRequestId: number | null
}

export interface SettlementCreateResponse {
  id: number
}

export type SettlementSortDir = 'asc' | 'desc'

export type SettlementPagination = Pagination

export interface SettlementQueryParams {
  page: number
  size: number
  search: string
  statusId: string
  legalTerminationCauseId: string
  qualityOfWorkId: string
  safetyComplianceId: string
  noReHiredCauseId: string
  rehireEligible: string
  endDateFrom: string
  endDateTo: string
  createdFrom: string
  createdTo: string
  sortBy: SettlementSortBy
  sortDir: SettlementSortDir
}

export interface SettlementPagedResponse {
  content: SettlementRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  pending?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}
