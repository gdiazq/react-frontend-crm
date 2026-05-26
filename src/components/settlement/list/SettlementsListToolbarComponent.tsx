import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, InputComponent, ToolbarActionsDropdownComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { settlementService } from '@/services'
import { useStoreSettlement } from '@/store'
import { useHasPermission } from '@/hooks'
import { downloadBlobFile } from '@/utils'

interface SettlementsListToolbarComponentProps {
  onOpenFilters: () => void
}

export function SettlementsListToolbarComponent({ onOpenFilters }: SettlementsListToolbarComponentProps) {
  const navigate = useNavigate()
  const search = useStoreSettlement((s) => s.queryParams.search)
  const loading = useStoreSettlement((s) => s.operationLoading.list)
  const setSearch = useStoreSettlement((s) => s.setSearch)
  const searchSettlements = useStoreSettlement((s) => s.searchSettlements)
  const canCreate = useHasPermission(PermissionModule.Settlement, PermissionAction.Create)
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [actionsMessage, setActionsMessage] = useState('')

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await settlementService.exportSettlementsCsv()
      downloadBlobFile(csvBlob, 'settlements.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (settlementService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo descargar el reporte.')
      } else {
        setActionsMessage('No se pudo descargar el reporte.')
      }
    } finally {
      setDownloadingReport(false)
    }
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchSettlements()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent value={search} type="text" placeholder="Buscar por nombre trabajador" onValueChange={setSearch} />
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
              label="Nuevo finiquito"
              onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loading || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => setActionsMessage('Carga masiva no disponible para finiquitos.')}
          />
        </div>
      </form>

      {actionsMessage && <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />}
    </>
  )
}
