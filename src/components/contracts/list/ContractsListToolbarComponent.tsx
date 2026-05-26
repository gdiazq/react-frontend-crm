import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_CONTRACTS_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { contractsService } from '@/services'
import { useStoreContracts } from '@/store'
import { useHasPermission } from '@/hooks'
import { downloadBlobFile, formatCsvImportSummary } from '@/utils'

interface ContractsListToolbarComponentProps {
  onOpenFilters: () => void
}

export function ContractsListToolbarComponent(props: ContractsListToolbarComponentProps) {
  const { onOpenFilters } = props
  const navigate = useNavigate()
  const search = useStoreContracts((s) => s.queryParams.search)
  const loading = useStoreContracts((s) => s.operationLoading.list)
  const setSearch = useStoreContracts((s) => s.setSearch)
  const searchContracts = useStoreContracts((s) => s.searchContracts)
  const getContracts = useStoreContracts((s) => s.getContracts)
  const canCreate = useHasPermission(PermissionModule.Contract, PermissionAction.Create)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await contractsService.exportContractsCsv()
      downloadBlobFile(csvBlob, 'contracts.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
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
      const result = await contractsService.importContractsCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getContracts()
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
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
        onSubmit={(event) => { event.preventDefault(); void searchContracts() }}
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
              label="Nuevo contrato"
              onClick={() => navigate(AUTH_ROUTE_CONTRACTS_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loading || downloadingReport || uploadingBulk}
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
