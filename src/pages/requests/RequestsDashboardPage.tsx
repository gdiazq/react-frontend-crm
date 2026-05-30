import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  RequestsListDetailSidebarComponent,
  RequestsListFiltersSidebarComponent,
  RequestsListTableComponent,
  RequestsListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import {
  mapperRequestApproveConfirmMessage,
  mapperRequestApproveSuccessMessage,
  mapperRequestRejectConfirmMessage,
  mapperRequestRejectSuccessMessage,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreEmployeeSelects, useStoreRequests } from '@/store'
import type { RequestTableRow } from '@/types'

export default function RequestsDashboardPage() {
  const pagination = useStoreRequests((s) => s.pagination)
  const loadingApproveRequest = useStoreRequests((s) => s.loadingApproveRequest)
  const loadingRejectRequest = useStoreRequests((s) => s.loadingRejectRequest)
  const listError = useStoreRequests((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreRequests((s) => s.clearOperationStatus)
  const getRequests = useStoreRequests((s) => s.getRequests)
  const approveRequest = useStoreRequests((s) => s.approveRequest)
  const rejectRequest = useStoreRequests((s) => s.rejectRequest)

  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)
  const hrRequestTypeOptionsErrorMessage = useStoreEmployeeSelects((s) => s.hrRequestTypeOptionsErrorMessage)
  const getHrRequestTypeOptions = useStoreEmployeeSelects((s) => s.getHrRequestTypeOptions)
  const clearHrRequestTypeOptionsStatus = useStoreEmployeeSelects((s) => s.clearHrRequestTypeOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRow, setSelectedDetailRow] = useState<RequestTableRow | null>(null)
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [pendingApproveRow, setPendingApproveRow] = useState<RequestTableRow | null>(null)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)
  const [pendingRejectRow, setPendingRejectRow] = useState<RequestTableRow | null>(null)
  const [rejectDetail, setRejectDetail] = useState('')
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getRequests()
    void getApprovalEmployeeStatusOptions()
    void getHrRequestTypeOptions()
  }, [getRequests, getApprovalEmployeeStatusOptions, getHrRequestTypeOptions])

  const handleApproveRequest = (row: RequestTableRow) => {
    setPendingApproveRow(row)
    setConfirmApproveOpen(true)
  }

  const handleRejectRequest = (row: RequestTableRow) => {
    setPendingRejectRow(row)
    setRejectDetail('')
    setConfirmRejectOpen(true)
  }

  const handleCloseConfirmApprove = () => {
    if (loadingApproveRequest) return
    setConfirmApproveOpen(false)
    setPendingApproveRow(null)
  }

  const handleConfirmApproveRequest = async () => {
    if (!pendingApproveRow || loadingApproveRequest) return

    const success = await approveRequest(pendingApproveRow.id)
    if (!success) return

    setConfirmApproveOpen(false)
    setPendingApproveRow(null)
    await getRequests()
    setActionsMessage(mapperRequestApproveSuccessMessage(pendingApproveRow))
  }

  const handleCloseConfirmReject = () => {
    if (loadingRejectRequest) return
    setConfirmRejectOpen(false)
    setPendingRejectRow(null)
    setRejectDetail('')
  }

  const handleConfirmRejectRequest = async () => {
    if (!pendingRejectRow || loadingRejectRequest) return

    const success = await rejectRequest(pendingRejectRow.id, rejectDetail.trim())
    if (!success) return

    setConfirmRejectOpen(false)
    setPendingRejectRow(null)
    setRejectDetail('')
    await getRequests()
    setActionsMessage(mapperRequestRejectSuccessMessage(pendingRejectRow))
  }

  const confirmApproveMessage = mapperRequestApproveConfirmMessage(pendingApproveRow)
  const confirmRejectMessage = mapperRequestRejectConfirmMessage(pendingRejectRow)
  const loadingAction = loadingApproveRequest || loadingRejectRequest

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · SOLICITUDES RRHH</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de solicitudes RRHH</span>
        </h1>
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

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => clearOperationStatus('list')}
        />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
        />
      )}

      {hrRequestTypeOptionsErrorMessage && (
        <AlertMessageComponent
          message={hrRequestTypeOptionsErrorMessage}
          tone="error"
          onClose={clearHrRequestTypeOptionsStatus}
        />
      )}

      <RequestsListToolbarComponent
        disabled={loadingAction}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}

      <RequestsListTableComponent
        onViewDetail={setSelectedDetailRow}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        loadingExtra={loadingAction}
      />

      <RequestsListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <RequestsListDetailSidebarComponent
        row={selectedDetailRow}
        onClose={() => setSelectedDetailRow(null)}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
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
        message={confirmRejectMessage}
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
