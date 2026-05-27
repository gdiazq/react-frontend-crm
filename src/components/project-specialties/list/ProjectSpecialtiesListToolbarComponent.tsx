import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_SPECIALTIES_CREATE } from '@/constant'
import { useStoreProjectSpecialties } from '@/store'

interface ProjectSpecialtiesListToolbarComponentProps {
  onOpenFilters: () => void
  disabled?: boolean
}

export function ProjectSpecialtiesListToolbarComponent(props: ProjectSpecialtiesListToolbarComponentProps) {
  const { onOpenFilters, disabled = false } = props

  const navigate = useNavigate()
  const [actionsMessage, setActionsMessage] = useState('')
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  // Store state used to render toolbar controls.
  const search = useStoreProjectSpecialties((s) => s.queryParams.search)
  const loading = useStoreProjectSpecialties((s) => s.operationLoading.list)
  const exportingCsv = useStoreProjectSpecialties((s) => s.exportingCsv)
  const importingCsv = useStoreProjectSpecialties((s) => s.importingCsv)

  // Store actions triggered by toolbar interactions.
  const setSearch = useStoreProjectSpecialties((s) => s.setSearch)
  const searchProjectSpecialties = useStoreProjectSpecialties((s) => s.searchProjectSpecialties)
  const exportProjectSpecialtiesCsv = useStoreProjectSpecialties((s) => s.exportProjectSpecialtiesCsv)
  const importProjectSpecialtiesCsv = useStoreProjectSpecialties((s) => s.importProjectSpecialtiesCsv)

  // Derived disabled state for every toolbar action.
  const loadingAny = loading || disabled || exportingCsv || importingCsv

  const handleDownloadReport = async () => {
    if (exportingCsv) return
    const success = await exportProjectSpecialtiesCsv()
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
    const summary = await importProjectSpecialtiesCsv(file)
    if (summary) {
      setActionsMessage(summary)
    }
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchProjectSpecialties() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent value={search} type="text" placeholder="Buscar por nombre o descripcion" onValueChange={setSearch} />
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
            label="Nueva especialidad"
            onClick={() => navigate(AUTH_ROUTE_PROJECT_SPECIALTIES_CREATE)}
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
