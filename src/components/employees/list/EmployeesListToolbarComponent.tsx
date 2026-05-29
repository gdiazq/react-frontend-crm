import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_EMPLOYEES_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { useStoreEmployees } from '@/store'
import { useHasPermission } from '@/hooks'

interface EmployeesListToolbarComponentProps {
  onOpenFilters: () => void
  disabled?: boolean
}

export function EmployeesListToolbarComponent(props: EmployeesListToolbarComponentProps) {
  const { onOpenFilters, disabled = false } = props

  const navigate = useNavigate()
  const canCreate = useHasPermission(PermissionModule.Employee, PermissionAction.Create)
  const [actionsMessage, setActionsMessage] = useState('')
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  // Store state used to render toolbar controls.
  const search = useStoreEmployees((s) => s.queryParams.search)
  const loading = useStoreEmployees((s) => s.operationLoading.list)
  const exportingCsv = useStoreEmployees((s) => s.exportingCsv)
  const importingCsv = useStoreEmployees((s) => s.importingCsv)

  // Store actions triggered by toolbar interactions.
  const setSearch = useStoreEmployees((s) => s.setSearch)
  const searchEmployees = useStoreEmployees((s) => s.searchEmployees)
  const exportEmployeesCsv = useStoreEmployees((s) => s.exportEmployeesCsv)
  const importEmployeesCsv = useStoreEmployees((s) => s.importEmployeesCsv)

  // Derived disabled state for every toolbar action.
  const loadingAny = loading || disabled || exportingCsv || importingCsv

  const handleDownloadReport = async () => {
    if (exportingCsv) return
    const success = await exportEmployeesCsv()
    if (success) {
      setActionsMessage('Reporte descargado correctamente.')
    }
  }

  const handleBulkUpload = () => {
    if (importingCsv) return
    bulkUploadInputRef.current?.click()
  }

  const handleBulkUploadFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || importingCsv) return

    const summary = await importEmployeesCsv(file)
    if (summary) {
      setActionsMessage(summary)
    }
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchEmployees() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={search}
              type="text"
              placeholder="Buscar por nombre, apellido o correo"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingAny}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loading ? 'Buscando...' : 'Buscar'}
          />
          {canCreate && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loadingAny}
              className="flex-1 md:flex-none"
              label="Nuevo trabajador"
              onClick={() => navigate(AUTH_ROUTE_EMPLOYEES_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loadingAny}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <input
        ref={bulkUploadInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => { void handleBulkUploadFileChange(event) }}
      />

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}
    </>
  )
}
