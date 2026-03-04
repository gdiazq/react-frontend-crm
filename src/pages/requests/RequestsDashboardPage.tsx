import { type ReactNode, useEffect, useState } from 'react'
import {
  ActionsDropdownComponent,
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  EmployeeApprovalStatusBadgeComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { requestsTableColumns } from '@/factories'
import messages from '@/messages/messages'
import { requestsService } from '@/services'
import { useStoreRequests } from '@/store'
import { createRequestsActions, downloadBlobFile } from '@/utils'
import type { RequestTableRow, TableRow } from '@/types'
import type { DropdownAction } from '@/utils'

const REQUEST_STATUS_COLUMN_INDEX = 3
const REQUEST_NAME_COLUMN_INDEX = 1
const ACTIONS_COLUMN_INDEX = requestsTableColumns.length - 1

const FINAL_REQUEST_STATUS_IDS = new Set([3, 4])

export default function RequestsDashboardPage() {
  const requestsRows = useStoreRequests((s) => s.requestsRows) as RequestTableRow[]
  const pagination = useStoreRequests((s) => s.pagination)
  const loadingRequests = useStoreRequests((s) => s.loadingRequests)
  const loadingApproveRequest = useStoreRequests((s) => s.loadingApproveRequest)
  const loadingRejectRequest = useStoreRequests((s) => s.loadingRejectRequest)
  const errorMessage = useStoreRequests((s) => s.errorMessage)
  const getRequests = useStoreRequests((s) => s.getRequests)
  const goToPage = useStoreRequests((s) => s.goToPage)
  const mutationApproveRequest = useStoreRequests((s) => s.mutationApproveRequest)
  const mutationRejectRequest = useStoreRequests((s) => s.mutationRejectRequest)
  const clearStatus = useStoreRequests((s) => s.clearStatus)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [pendingApproveRow, setPendingApproveRow] = useState<RequestTableRow | null>(null)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)
  const [pendingRejectRow, setPendingRejectRow] = useState<RequestTableRow | null>(null)
  const [rejectDetail, setRejectDetail] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [actionsMessage, setActionsMessage] = useState('')
  const { actionViewDetail, actionApproveRequest, actionRejectRequest } = createRequestsActions()

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size

  useEffect(() => {
    void getRequests()
  }, [getRequests])

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const handleViewDetail = (row: RequestTableRow) => {
    setSelectedDetailName(String(row.values[REQUEST_NAME_COLUMN_INDEX] ?? 'Solicitud'))
    setDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailName('')
  }

  const handleApproveRequest = (row: RequestTableRow) => {
    setPendingApproveRow(row)
    setConfirmApproveOpen(true)
    setOpenActionsRowId(null)
  }

  const handleRejectRequest = (row: RequestTableRow) => {
    setPendingRejectRow(row)
    setRejectDetail('')
    setConfirmRejectOpen(true)
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: RequestTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => handleViewDetail(row))]
    if (!FINAL_REQUEST_STATUS_IDS.has(row.statusId)) {
      actions.push(actionApproveRequest(() => handleApproveRequest(row)))
      actions.push(actionRejectRequest(() => handleRejectRequest(row)))
    }
    return actions
  }

  const handleConfirmApproveRequest = async () => {
    if (!pendingApproveRow || loadingApproveRequest) return

    const success = await mutationApproveRequest(pendingApproveRow.id)
    if (success) {
      const requestName = pendingApproveRow.values[REQUEST_NAME_COLUMN_INDEX]
      setConfirmApproveOpen(false)
      setPendingApproveRow(null)
      await getRequests()
      setActionsMessage(`${requestName}: ${messages.requests.status.success.approveSuccess}`)
    }
  }

  const handleCloseConfirmApprove = () => {
    if (loadingApproveRequest) return
    setConfirmApproveOpen(false)
    setPendingApproveRow(null)
  }

  const handleConfirmRejectRequest = async () => {
    if (!pendingRejectRow || loadingRejectRequest) return

    const success = await mutationRejectRequest(pendingRejectRow.id, rejectDetail.trim())
    if (success) {
      const requestName = pendingRejectRow.values[REQUEST_NAME_COLUMN_INDEX]
      setConfirmRejectOpen(false)
      setPendingRejectRow(null)
      setRejectDetail('')
      await getRequests()
      setActionsMessage(`${requestName}: ${messages.requests.status.success.rejectSuccess}`)
    }
  }

  const handleCloseConfirmReject = () => {
    if (loadingRejectRequest) return
    setConfirmRejectOpen(false)
    setPendingRejectRow(null)
    setRejectDetail('')
  }

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

  const handleBulkUpload = () => {
    setActionsMessage('Carga masiva disponible proximamente.')
  }

  const confirmApproveMessage = pendingApproveRow
    ? `¿Seguro que deseas aprobar la solicitud de ${pendingApproveRow.values[REQUEST_NAME_COLUMN_INDEX]}?`
    : ''

  const renderCell = (row: TableRow, value: ReactNode, columnIndex: number, rowIndex: number) => {
    const requestRow = row as RequestTableRow
    if (columnIndex === REQUEST_NAME_COLUMN_INDEX) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => handleViewDetail(requestRow)}
        >
          {value}
        </button>
      )
    }
    if (columnIndex === REQUEST_STATUS_COLUMN_INDEX) {
      return <EmployeeApprovalStatusBadgeComponent statusName={requestRow.statusName} />
    }
    if (columnIndex === ACTIONS_COLUMN_INDEX) {
      const openDirection = requestsRows.length > 2 && rowIndex >= requestsRows.length - 2 ? 'up' : 'down'
      return (
        <ActionsDropdownComponent
          open={openActionsRowId === row.id}
          actions={resolveRowActions(requestRow)}
          openDirection={openDirection}
          onToggle={() => setOpenActionsRowId((id) => (id === row.id ? null : row.id))}
        />
      )
    }

    return <span>{value}</span>
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de solicitudes RRHH</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total solicitudes"
        activeLabel="Solicitudes aprobadas"
        pendingLabel="Solicitudes pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
        showRatios={false}
      />

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void getRequests()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingRequests || loadingApproveRequest || loadingRejectRequest}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={searchValue}
              type="text"
              placeholder="Buscar por identificacion, nombre o tipo de solicitud"
              onValueChange={setSearchValue}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingRequests || loadingApproveRequest || loadingRejectRequest}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingRequests ? 'Buscando...' : 'Buscar'}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingRequests || loadingApproveRequest || loadingRejectRequest || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <TableComponent
        columns={requestsTableColumns}
        rows={requestsRows}
        loading={loadingRequests}
        emptyMessage="No hay solicitudes registradas."
        renderCell={renderCell}
      />

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingRequests || loadingApproveRequest || loadingRejectRequest}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent
        open={filtersOpen}
        title="Filtros"
        onClose={() => setFiltersOpen(false)}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">Sin filtros disponibles por ahora.</p>
      </RightSidebarComponent>

      <DetailSidebarComponent
        open={detailOpen}
        title={selectedDetailName ? `Detalle de ${selectedDetailName}` : 'Detalle de solicitud'}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmApproveOpen}
        title="Confirmar aprobacion"
        message={confirmApproveMessage}
        confirmLabel="Aprobar"
        cancelLabel="Cancelar"
        loading={loadingApproveRequest}
        onClose={handleCloseConfirmApprove}
        onConfirm={() => { void handleConfirmApproveRequest() }}
      />

      <SaveConfirmComponent
        open={confirmRejectOpen}
        title="Confirmar rechazo"
        message={pendingRejectRow ? `¿Seguro que deseas rechazar la solicitud de ${pendingRejectRow.values[REQUEST_NAME_COLUMN_INDEX]}?` : ''}
        confirmLabel="Rechazar"
        cancelLabel="Cancelar"
        loading={loadingRejectRequest}
        confirmDisabled={rejectDetail.trim().length === 0}
        onClose={handleCloseConfirmReject}
        onConfirm={() => { void handleConfirmRejectRequest() }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {messages.requests.ui.rejectRequestReasonLabel}
          </label>
          <textarea
            value={rejectDetail}
            rows={4}
            placeholder={messages.requests.ui.rejectRequestReasonPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            onChange={(event) => setRejectDetail(event.target.value)}
          />
        </div>
      </SaveConfirmComponent>
    </section>
  )
}
