import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_ANNEXES_CREATE, PermissionAction, PermissionModule } from '@/constant'
import messages from '@/messages/messages'
import { useStoreAnnexes } from '@/store'
import { useHasPermission } from '@/hooks'

interface AnnexesListToolbarComponentProps {
  onOpenFilters: () => void
}

export function AnnexesListToolbarComponent(props: AnnexesListToolbarComponentProps) {
  const { onOpenFilters } = props
  const navigate = useNavigate()
  const search = useStoreAnnexes((s) => s.queryParams.search)
  const loading = useStoreAnnexes((s) => s.operationLoading.list)
  const exportingCsv = useStoreAnnexes((s) => s.exportingCsv)
  const setSearch = useStoreAnnexes((s) => s.setSearch)
  const searchAnnexes = useStoreAnnexes((s) => s.searchAnnexes)
  const exportAnnexesCsv = useStoreAnnexes((s) => s.exportAnnexesCsv)
  const canCreate = useHasPermission(PermissionModule.Annex, PermissionAction.Create)
  const [actionsMessage, setActionsMessage] = useState('')

  const handleDownloadReport = async () => {
    if (exportingCsv) return
    const success = await exportAnnexesCsv()
    if (success) setActionsMessage(messages.annexes.status.success.exportSuccess)
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchAnnexes() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent value={search} type="text" placeholder="Buscar por trabajador" onValueChange={setSearch} />
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
              label="Nuevo anexo"
              onClick={() => navigate(AUTH_ROUTE_ANNEXES_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loading || exportingCsv}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => setActionsMessage(messages.annexes.ui.bulkUploadComingSoon)}
          />
        </div>
      </form>

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}
    </>
  )
}
