import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_USERS_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { useHasPermission } from '@/hooks'
import { useStoreUsers } from '@/store'

interface UsersListToolbarComponentProps {
  onOpenFilters: () => void
  disabled?: boolean
}

export function UsersListToolbarComponent({ onOpenFilters, disabled = false }: UsersListToolbarComponentProps) {
  const navigate = useNavigate()
  const canCreate = useHasPermission(PermissionModule.User, PermissionAction.Create)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)
  const search = useStoreUsers((s) => s.queryParams.search)
  const loading = useStoreUsers((s) => s.operationLoading.list)
  const exportingCsv = useStoreUsers((s) => s.exportingCsv)
  const importingCsv = useStoreUsers((s) => s.importingCsv)
  const setSearch = useStoreUsers((s) => s.setSearch)
  const searchUsers = useStoreUsers((s) => s.searchUsers)
  const exportUsersCsv = useStoreUsers((s) => s.exportUsersCsv)
  const importUsersCsv = useStoreUsers((s) => s.importUsersCsv)
  const [actionsMessage, setActionsMessage] = useState('')
  const loadingAny = loading || disabled || exportingCsv || importingCsv

  const handleDownloadReport = async () => {
    if (exportingCsv) return
    const success = await exportUsersCsv()
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

    const summary = await importUsersCsv(file)
    if (summary) {
      setActionsMessage(summary)
    }
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchUsers()
        }}
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
              label="Nuevo usuario"
              onClick={() => navigate(AUTH_ROUTE_USERS_CREATE)}
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
