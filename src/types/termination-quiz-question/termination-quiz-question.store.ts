import type {
  TerminationQuizQuestionCreatePayload,
  TerminationQuizQuestionDetail,
  TerminationQuizQuestionPagination,
  TerminationQuizQuestionQueryParams,
  TerminationQuizQuestionRaw,
  TerminationQuizQuestionSortBy,
  TerminationQuizQuestionSortDir,
  TerminationQuizQuestionTableRow,
  TerminationQuizQuestionUpdatePayload,
} from './termination-quiz-question'
import type { OperationKey, OperationStatus } from '../common'

export interface TerminationQuizQuestionStore {
  terminationQuizQuestionRaw: TerminationQuizQuestionRaw[]
  terminationQuizQuestionDetail: TerminationQuizQuestionDetail | null
  terminationQuizQuestionRows: TerminationQuizQuestionTableRow[]
  pagination: TerminationQuizQuestionPagination
  queryParams: TerminationQuizQuestionQueryParams
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getTerminationQuizQuestion: () => Promise<void>
  getTerminationQuizQuestionDetail: (id: string) => Promise<TerminationQuizQuestionDetail | null>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setActiveFilter: (active: string) => void
  setQuestionGroupFilter: (questionGroup: string) => void
  setEmployeeIdFilter: (employeeId: string) => void
  setCreatedDateRange: (value: { createdFrom: string; createdTo: string }) => void
  setUpdatedDateRange: (value: { updatedFrom: string; updatedTo: string }) => void
  clearActiveFilter: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchTerminationQuizQuestion: () => Promise<void>
  sortTerminationQuizQuestion: (sortBy: TerminationQuizQuestionSortBy, sortDir: TerminationQuizQuestionSortDir) => Promise<void>
  createTerminationQuizQuestion: (payload: TerminationQuizQuestionCreatePayload) => Promise<boolean>
  updateTerminationQuizQuestion: (payload: TerminationQuizQuestionUpdatePayload) => Promise<boolean>
  toggleTerminationQuizQuestionStatus: (id: string, nextStatus: boolean) => Promise<boolean>
  clearTerminationQuizQuestionDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
