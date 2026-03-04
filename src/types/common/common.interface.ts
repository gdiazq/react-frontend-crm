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
