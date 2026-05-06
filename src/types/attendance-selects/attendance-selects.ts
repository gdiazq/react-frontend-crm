export interface AttendanceEmployeeSelectOption {
  id: number
  name: string
}

export interface AttendanceEmployeeWithCostCenterSelectOption {
  id: number
  name: string
  costCenter?: number | null
}

export interface AttendanceStatusSelectOption {
  id: number
  name: string
  code?: string | null
  description?: string | null
  active?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface AttendanceMarkTypeSelectOption {
  id: string
  name: string
}
