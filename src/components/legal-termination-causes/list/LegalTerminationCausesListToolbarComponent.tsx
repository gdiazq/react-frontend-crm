import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_CREATE } from '@/constant'
import { legalTerminationCausesService } from '@/services'
import { useStoreLegalTerminationCauses } from '@/store'
import { downloadBlobFile, formatCsvImportSummary } from '@/utils'

interface LegalTerminationCausesListToolbarComponentProps {
  onOpenFilters: () => void
  disabled?: boolean
}

export function LegalTerminationCausesListToolbarComponent(props: LegalTerminationCausesListToolbarComponentProps) {
  const { onOpenFilters, disabled = false } = props
  const navigate = useNavigate()
  const search = useStoreLegalTerminationCauses((s) => s.queryParams.search)
  const loading = useStoreLegalTerminationCauses((s) => s.operationLoading.list)
  const setSearch = useStoreLegalTerminationCauses((s) => s.setSearch)
  const searchLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.searchLegalTerminationCauses)
  const getLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauses)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)
  const loadingAny = loading || disabled || downloadingReport || uploadingBulk

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await legalTerminationCausesService.exportLegalTerminationCausesCsv()
      downloadBlobFile(csvBlob, 'legal-termination-causes.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (legalTerminationCausesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo descargar el reporte.')
      } else {
        setActionsMessage('No se pudo descargar el reporte.')
      }
    } finally {
      setDownloadingReport(false)
    }
  }

  const handleBulkUpload = () => {
    if (uploadingBulk) return
    bulkUploadInputRef.current?.click()
  }

  const handleBulkUploadFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || uploadingBulk) return

    try {
      setUploadingBulk(true)
      const result = await legalTerminationCausesService.importLegalTerminationCausesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getLegalTerminationCauses()
    } catch (error) {
      if (legalTerminationCausesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchLegalTerminationCauses() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent value={search} type="text" placeholder="Buscar por nombre o descripción" onValueChange={setSearch} />
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
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingAny}
            className="flex-1 md:flex-none"
            label="Nueva causa"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingAny}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>
      <input ref={bulkUploadInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { void handleBulkUploadFileChange(event) }} />
      {actionsMessage && <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />}
    </>
  )
}
