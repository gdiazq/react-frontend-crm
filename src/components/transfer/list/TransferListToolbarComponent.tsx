import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_TRANSFERS_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { useStoreAuth, useStoreTransfer } from '@/store'

interface TransferListToolbarComponentProps {
  onOpenFilters: () => void
}

export function TransferListToolbarComponent({ onOpenFilters }: TransferListToolbarComponentProps) {
  const navigate = useNavigate()
  const search = useStoreTransfer((s) => s.queryParams.search)
  const loading = useStoreTransfer((s) => s.operationLoading.list)
  const setSearch = useStoreTransfer((s) => s.setSearch)
  const searchTransfers = useStoreTransfer((s) => s.searchTransfers)
  const exportTransfersCsv = useStoreTransfer((s) => s.exportTransfersCsv)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canCreateTransfer = hasPermission(PermissionModule.Transfer, PermissionAction.Create)
  const [exportingCsv, setExportingCsv] = useState(false)
  const [actionsMessage, setActionsMessage] = useState('')

  const handleDownloadCsv = async () => {
    if (exportingCsv) return
    setExportingCsv(true)
    await exportTransfersCsv()
    setExportingCsv(false)
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchTransfers()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={search}
              type="text"
              placeholder="Buscar por nombre del trabajador"
              onValueChange={setSearch}
            />
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
          {canCreateTransfer && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loading}
              className="flex-1 md:flex-none"
              label="Nuevo traspaso"
              onClick={() => navigate(AUTH_ROUTE_TRANSFERS_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loading || exportingCsv}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadCsv() }}
            onBulkUpload={() => setActionsMessage('La carga masiva de traspasos aún no está disponible.')}
          />
        </div>
      </form>

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}
    </>
  )
}
