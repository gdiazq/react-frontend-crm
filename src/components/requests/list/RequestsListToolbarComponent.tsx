import { useState } from 'react'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { requestsService } from '@/services'
import { useStoreRequests } from '@/store'
import { downloadBlobFile } from '@/utils'

interface RequestsListToolbarComponentProps {
  disabled?: boolean
  onOpenFilters: () => void
}

export function RequestsListToolbarComponent(props: RequestsListToolbarComponentProps) {
  const { disabled = false, onOpenFilters } = props
  const queryParams = useStoreRequests((s) => s.queryParams)
  const loadingRequests = useStoreRequests((s) => s.operationLoading.list)
  const setSearch = useStoreRequests((s) => s.setSearch)
  const searchRequests = useStoreRequests((s) => s.searchRequests)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const loadingAny = loadingRequests || disabled || downloadingReport

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await requestsService.exportRequestsCsv()
      downloadBlobFile(csvBlob, 'hr-requests.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (requestsService.isAxiosError(error)) {
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
          void searchRequests()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingAny}
            label="Filtro"
            onClick={onOpenFilters}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre"
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
            label={loadingRequests ? 'Buscando...' : 'Buscar'}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingAny}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => setActionsMessage('Carga masiva disponible proximamente.')}
          />
        </div>
      </form>

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}
    </>
  )
}
