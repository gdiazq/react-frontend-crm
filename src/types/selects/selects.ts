export interface SelectRoleOption {
  id: number
  name: string
}

export interface SelectUserNameOption {
  id: number
  name: string
}

export interface SelectUserEmailOption {
  id: number
  email: string
}

export interface SelectStatusOption {
  id: boolean
  name: string
}

export interface SelectEmployeeStatusOption {
  id: number
  name: string
}

export interface SelectActiveInactiveOption {
  id: number
  value: boolean
  name: string
}

export interface SelectPermissionOption {
  id: number
  name: string
  label?: string
}

export interface SelectProjectTypeOption {
  id: number
  name: string
}

export interface SelectProjectSpecialtyOption {
  id: number
  name: string
}

export interface SelectProjectStatusOption {
  id: number
  name: string
}

export interface SelectVisitorOption {
  id: number
  name: string
}

export interface SelectSupervisorOption {
  id: number
  name: string
}

export interface SelectCompanyRepresentativeOption {
  id: number
  name: string
}

export interface SelectTerminationQuizQuestionOptionItem {
  id: number
  label: string
  displayOrder: number
}

export interface SelectTerminationQuizQuestionOption {
  id: number
  employeeId: number | null
  question: string
  questionGroup: string
  required: boolean
  displayOrder: number
  active: boolean
  options: SelectTerminationQuizQuestionOptionItem[]
  createdAt: string
  updatedAt: string
}
