export interface Pagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface AlertsCore {
  icon: string
  variant: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export interface ModulePermission {
  module: string
  canRead?: boolean
  canCreate?: boolean
  canUpdate?: boolean
  canDelete?: boolean
  canApprove?: boolean
  canReject?: boolean
}

export interface CsvImportError {
  row: number
  message: string
}

export interface CsvImportResponse {
  total: number
  success: number
  failed: number
  errors: CsvImportError[]
}

export type OperationKey = 'list' | 'detail' | 'create' | 'update' | 'toggle'

export interface OperationStatus {
  error: string | null
  success: string | null
  errorBack: unknown | null
}
