import type { Pagination } from '../common'

export interface TerminationQuizQuestionRaw {
  id: number
  employeeId: number | null
  question: string
  questionGroupId?: number | null
  questionGroupName: string
  required: boolean
  displayOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface TerminationQuizQuestionDetail {
  id: number
  employeeId: number | null
  question: string
  questionGroupId?: number | null
  questionGroupName: string
  required: boolean
  displayOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface TerminationQuizQuestionDetailView {
  questionDisplay: string
  questionGroupDisplay: string
  required: boolean
  employeeIdDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface TerminationQuizQuestionCreateForm {
  question: string
  questionGroup: string
  required: string
  employeeId: string
}

export interface TerminationQuizQuestionCreatePayload {
  employeeId?: number
  question: string
  questionGroup: string
  required: boolean
}

export interface TerminationQuizQuestionUpdatePayload {
  id: number
  employeeId?: number
  question: string
  questionGroup: string
  required: boolean
}

export interface TerminationQuizQuestionCreateResponse {
  id: number
  employeeId: number | null
  question: string
  questionGroupId?: number | null
  questionGroupName: string
  required: boolean
  displayOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface TerminationQuizQuestionTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type TerminationQuizQuestionSortBy = 'question' | 'questionGroup' | 'displayOrder' | 'active' | 'createdAt' | 'updatedAt'
export type TerminationQuizQuestionSortDir = 'asc' | 'desc'

export type TerminationQuizQuestionPagination = Pagination

export interface TerminationQuizQuestionQueryParams {
  page: number
  size: number
  search: string
  active: string
  questionGroup: string
  employeeId: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: TerminationQuizQuestionSortBy
  sortDir: TerminationQuizQuestionSortDir
}

export interface TerminationQuizQuestionPagedResponse {
  content: TerminationQuizQuestionRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  totalActive?: number
  active?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}
