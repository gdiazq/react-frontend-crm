import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_ANNEXES_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { annexesService } from '@/services'
import { useStoreAnnexes } from '@/store'
import { useHasPermission } from '@/hooks'
import { downloadBlobFile } from '@/utils'

interface AnnexesListToolbarComponentProps {
  onOpenFilters: () => void
}

export function AnnexesListToolbarComponent(props: AnnexesListToolbarComponentProps) {
  const { onOpenFilters } = props
  const navigate = useNavigate()
  const search = useStoreAnnexes((s) => s.queryParams.search)
  const loading = useStoreAnnexes((s) => s.operationLoading.list)
  const setSearch = useStoreAnnexes((s) => s.setSearch)
  const searchAnnexes = useStoreAnnexes((s) => s.searchAnnexes)
  const canCreate = useHasPermission(PermissionModule.Annex, PermissionAction.Create)
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [actionsMessage, setActionsMessage] = useState('')

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await annexesService.exportAnnexesCsv()
      downloadBlobFile(csvBlob, 'annexes.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch {
      setActionsMessage('No se pudo descargar el reporte.')
    } finally {
      setDownloadingReport(false)
    }
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
            disabled={loading || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => {}}
          />
        </div>
      </form>

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}
    </>
  )
}
