import type { Pagination } from '../common'

export interface TerminationQuizQuestionOption {
  id: number
  label: string
  displayOrder: number
}

export interface TerminationQuizQuestionRaw {
  id: number
  employeeId: number | null
  question: string
  questionGroup: string
  required: boolean
  displayOrder: number
  active: boolean
  options: TerminationQuizQuestionOption[]
  createdAt: string
  updatedAt: string
}

export interface TerminationQuizQuestionDetail {
  id: number
  employeeId: number | null
  question: string
  questionGroup: string
  required: boolean
  displayOrder: number
  active: boolean
  options: TerminationQuizQuestionOption[]
  createdAt: string
  updatedAt: string
}

export interface TerminationQuizQuestionDetailView {
  questionDisplay: string
  questionGroupDisplay: string
  required: boolean
  employeeIdDisplay: string
  active: boolean
  optionLabels: string[]
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface TerminationQuizQuestionOptionForm {
  label: string
}

export interface TerminationQuizQuestionCreateForm {
  question: string
  questionGroup: string
  required: string
  employeeId: string
  options: TerminationQuizQuestionOptionForm[]
}

export interface TerminationQuizQuestionCreatePayload {
  employeeId?: number
  question: string
  questionGroup: string
  required: boolean
  options: { label: string }[]
}

export interface TerminationQuizQuestionUpdatePayload {
  id: number
  employeeId?: number
  question: string
  questionGroup: string
  required: boolean
  options: { label: string }[]
}

export interface TerminationQuizQuestionCreateResponse {
  id: number
  employeeId: number | null
  question: string
  questionGroup: string
  required: boolean
  displayOrder: number
  active: boolean
  options: TerminationQuizQuestionOption[]
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
