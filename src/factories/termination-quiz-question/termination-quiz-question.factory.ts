import type {
  TerminationQuizQuestionCreateForm,
  TerminationQuizQuestionPagination,
  TerminationQuizQuestionQueryParams,
  TerminationQuizQuestionSortBy,
  TerminationQuizQuestionTableRow,
} from '@/types'

export const terminationQuizQuestionTableColumns: string[] = [
  'Pregunta',
  'Grupo',
  'Requerida',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const terminationQuizQuestionTableColumnIndex = {
  question: 0,
  questionGroup: 1,
  required: 2,
  status: 3,
}

export const terminationQuizQuestionTableSortByColumn: Partial<Record<number, TerminationQuizQuestionSortBy>> = {
  0: 'question',
  1: 'questionGroup',
  3: 'active',
  4: 'createdAt',
  5: 'updatedAt',
}

export const initialTerminationQuizQuestionRows: TerminationQuizQuestionTableRow[] = []

export const initialTerminationQuizQuestionPagination: TerminationQuizQuestionPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialTerminationQuizQuestionQueryParams: TerminationQuizQuestionQueryParams = {
  page: 0,
  size: 8,
  search: '',
  active: '',
  questionGroup: '',
  employeeId: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export const initialCreateTerminationQuizQuestionForm: TerminationQuizQuestionCreateForm = {
  question: '',
  questionGroup: '',
  required: 'true',
  employeeId: '',
  options: [{ label: '' }],
}
