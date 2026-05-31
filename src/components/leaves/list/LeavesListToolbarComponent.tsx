import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_LEAVES_CREATE, PermissionAction, PermissionModule } from '@/constant'
import messages from '@/messages/messages'
import { useStoreLeaves } from '@/store'
import { useHasPermission } from '@/hooks'

interface LeavesListToolbarComponentProps {
  onOpenFilters: () => void
}

export function LeavesListToolbarComponent({ onOpenFilters }: LeavesListToolbarComponentProps) {
  const navigate = useNavigate()
  const search = useStoreLeaves((s) => s.queryParams.search)
  const loading = useStoreLeaves((s) => s.operationLoading.list)
  const exportingCsv = useStoreLeaves((s) => s.exportingCsv)
  const setSearch = useStoreLeaves((s) => s.setSearch)
  const searchLeaves = useStoreLeaves((s) => s.searchLeaves)
  const exportLeavesCsv = useStoreLeaves((s) => s.exportLeavesCsv)
  const canCreate = useHasPermission(PermissionModule.Leave, PermissionAction.Create)
  const [actionsMessage, setActionsMessage] = useState('')

  const handleDownloadReport = async () => {
    if (exportingCsv) return
    const success = await exportLeavesCsv()
    if (success) setActionsMessage(messages.leaves.status.success.exportSuccess)
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchLeaves() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent value={search} type="text" placeholder="Buscar por trabajador, identificación o motivo" onValueChange={setSearch} />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loading ? 'Buscando...' : 'Buscar'}
          />
          {canCreate && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loading}
              className="flex-1 md:flex-none"
              label="Nuevo permiso"
              onClick={() => navigate(AUTH_ROUTE_LEAVES_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loading || exportingCsv}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => setActionsMessage(messages.leaves.ui.bulkUploadComingSoon)}
          />
        </div>
      </form>

      {actionsMessage && <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />}
    </>
  )
}
