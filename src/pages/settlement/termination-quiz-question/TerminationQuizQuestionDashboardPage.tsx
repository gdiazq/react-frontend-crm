import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
  TerminationQuizQuestionListDetailSidebarComponent,
  TerminationQuizQuestionListFiltersSidebarComponent,
  TerminationQuizQuestionListTableComponent,
  TerminationQuizQuestionListToolbarComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION } from '@/constant'
import { terminationQuizQuestionTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import {
  useStoreSelects,
  useStoreSettlementSelects,
  useStoreTerminationQuizQuestion,
} from '@/store'
import type { TerminationQuizQuestionTableRow } from '@/types'

const QUESTION_COLUMN_INDEX = terminationQuizQuestionTableColumnIndex.question

export default function TerminationQuizQuestionDashboardPage() {
  const navigate = useNavigate()
  const pagination = useStoreTerminationQuizQuestion((s) => s.pagination)
  const loadingTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreTerminationQuizQuestion((s) => s.operationLoading.toggle)
  const listError = useStoreTerminationQuizQuestion((s) => s.operationStatus.list.error)
  const toggleError = useStoreTerminationQuizQuestion((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreTerminationQuizQuestion((s) => s.clearOperationStatus)
  const getTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.getTerminationQuizQuestion)
  const toggleTerminationQuizQuestionStatus = useStoreTerminationQuizQuestion((s) => s.toggleTerminationQuizQuestionStatus)

  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)
  const quizQuestionGroupOptionsErrorMessage = useStoreSettlementSelects((s) => s.quizQuestionGroupOptionsErrorMessage)
  const getQuizQuestionGroupOptions = useStoreSettlementSelects((s) => s.getQuizQuestionGroupOptions)
  const clearQuizQuestionGroupOptionsStatus = useStoreSettlementSelects((s) => s.clearQuizQuestionGroupOptionsStatus)
  const employeeWithContractOptionsErrorMessage = useStoreSettlementSelects((s) => s.employeeWithContractOptionsErrorMessage)
  const getEmployeeWithContractOptions = useStoreSettlementSelects((s) => s.getEmployeeWithContractOptions)
  const clearEmployeeWithContractOptionsStatus = useStoreSettlementSelects((s) => s.clearEmployeeWithContractOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<TerminationQuizQuestionTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getTerminationQuizQuestion()
    void getStatusOptions()
    void getQuizQuestionGroupOptions()
    void getEmployeeWithContractOptions()
  }, [getTerminationQuizQuestion, getStatusOptions, getQuizQuestionGroupOptions, getEmployeeWithContractOptions])

  const handleCloseDetail = () => {
    setSelectedDetailRowId(null)
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.active !== true
    const questionText = pendingToggleRow.values[QUESTION_COLUMN_INDEX]
    const success = await toggleTerminationQuizQuestionStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getTerminationQuizQuestion()
    navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${questionText} ${
        nextStatus
          ? messages.terminationQuizQuestion.status.success.toggleEnabledSuccess
          : messages.terminationQuizQuestion.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la pregunta "${pendingToggleRow.values[QUESTION_COLUMN_INDEX]}"?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · QUIZ DE SALIDA</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de quiz de salida</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total preguntas"
        activeLabel="Preguntas activas del quiz"
        total={pagination.total}
        active={pagination.active}
      />

      {(listError || toggleError) && (
        <AlertMessageComponent
          message={(listError || toggleError)!}
          tone="error"
          onClose={() => {
            if (listError) clearOperationStatus('list')
            if (toggleError) clearOperationStatus('toggle')
          }}
        />
      )}

      {statusOptionsErrorMessage && (
        <AlertMessageComponent message={statusOptionsErrorMessage} tone="error" onClose={clearStatusOptionsStatus} />
      )}

      {quizQuestionGroupOptionsErrorMessage && (
        <AlertMessageComponent message={quizQuestionGroupOptionsErrorMessage} tone="error" onClose={clearQuizQuestionGroupOptionsStatus} />
      )}

      {employeeWithContractOptionsErrorMessage && (
        <AlertMessageComponent message={employeeWithContractOptionsErrorMessage} tone="error" onClose={clearEmployeeWithContractOptionsStatus} />
      )}

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}

      <TerminationQuizQuestionListToolbarComponent
        disabled={loadingToggleStatus}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <TerminationQuizQuestionListTableComponent
        loadingExtra={loadingToggleStatus}
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={(row) => {
          setPendingToggleRow(row)
          setConfirmOpen(true)
        }}
      />

      <TerminationQuizQuestionListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <TerminationQuizQuestionListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingTerminationQuizQuestion || loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
