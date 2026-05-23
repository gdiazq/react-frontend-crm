import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  SaveConfirmComponent,
  TerminationQuizQuestionFormDataSectionComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION } from '@/constant'
import { initialCreateTerminationQuizQuestionForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateTerminationQuizQuestionPayload,
  mapperTerminationQuizQuestionToForm,
  mapperUpdateTerminationQuizQuestionPayload,
} from '@/mappers'
import { useStoreSettlementSelects, useStoreTerminationQuizQuestion } from '@/store'
import type {
  TerminationQuizQuestionCreateForm,
  TerminationQuizQuestionCreatePayload,
  TerminationQuizQuestionUpdatePayload,
} from '@/types'
import { terminationQuizQuestionCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: TerminationQuizQuestionCreatePayload }
  | { mode: 'update', payload: TerminationQuizQuestionUpdatePayload }
  | null

export default function TerminationQuizQuestionFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editId) && editId > 0

  const [form, setForm] = useState<TerminationQuizQuestionCreateForm>({ ...initialCreateTerminationQuizQuestionForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingDetail = useStoreTerminationQuizQuestion((s) => s.operationLoading.detail)
  const detailError = useStoreTerminationQuizQuestion((s) => s.operationStatus.detail.error)
  const createSubmitting = useStoreTerminationQuizQuestion((s) => s.operationLoading.create)
  const updateSubmitting = useStoreTerminationQuizQuestion((s) => s.operationLoading.update)
  const createStatus = useStoreTerminationQuizQuestion((s) => s.operationStatus.create)
  const updateStatus = useStoreTerminationQuizQuestion((s) => s.operationStatus.update)
  const getDetail = useStoreTerminationQuizQuestion((s) => s.getTerminationQuizQuestionDetail)
  const clearDetail = useStoreTerminationQuizQuestion((s) => s.clearTerminationQuizQuestionDetail)
  const clearOperationStatus = useStoreTerminationQuizQuestion((s) => s.clearOperationStatus)
  const createTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.createTerminationQuizQuestion)
  const updateTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.updateTerminationQuizQuestion)

  const employeeWithContractOptions = useStoreSettlementSelects((s) => s.employeeWithContractOptions)
  const loadingFormOptions = useStoreSettlementSelects((s) => s.loadingFormOptions)
  const formOptionsErrorMessage = useStoreSettlementSelects((s) => s.formOptionsErrorMessage)
  const getFormOptions = useStoreSettlementSelects((s) => s.getFormOptions)
  const clearFormOptionsStatus = useStoreSettlementSelects((s) => s.clearFormOptionsStatus)

  const selectEmployees = employeeWithContractOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const shouldIncludeCurrentEmployee = isEditMode
    && form.employeeId.trim().length > 0
    && !selectEmployees.some((option) => option.value === form.employeeId)
  const selectEmployeesWithCurrent = shouldIncludeCurrentEmployee
    ? [{ label: `Trabajador #${form.employeeId}`, value: form.employeeId }, ...selectEmployees]
    : selectEmployees

  const validatableForm = {
    question: form.question,
    questionGroup: form.questionGroup,
    required: form.required,
    employeeId: form.employeeId,
  }
  const { errors, validateAll, onValidation } = useFormValidation(validatableForm, terminationQuizQuestionCreateValidationRules)

  const saving = createSubmitting || updateSubmitting

  const headerTitle = isEditMode ? 'Editar pregunta del quiz de salida' : 'Crear pregunta del quiz de salida'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la pregunta seleccionada.'
    : 'Completa los datos para registrar una nueva pregunta del quiz de salida.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear pregunta'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando pregunta...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingFormOptions

  useEffect(() => {
    void getFormOptions()
  }, [getFormOptions])

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearDetail()
    }
  }, [clearOperationStatus, clearDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getDetail(String(editId))
      if (!detail || cancelled) return
      setForm(mapperTerminationQuizQuestionToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editId, getDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof TerminationQuizQuestionCreateForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateTerminationQuizQuestionPayload(editId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateTerminationQuizQuestionPayload(form) })
    }
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleConfirmSave = async () => {
    if (!pendingAction || saving) return

    const success = pendingAction.mode === 'create'
      ? await createTerminationQuizQuestion(pendingAction.payload)
      : await updateTerminationQuizQuestion(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios de la pregunta "${form.question}"?`
    : `¿Deseas crear la pregunta "${form.question}"?`
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')

  return (
    <section className="space-y-6">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <h1 className="display text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          {heroLeading}
          {heroTrailing && (
            <span className="display-it text-slate-500 dark:text-slate-400"> {heroTrailing}</span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {headerDescription}
        </p>
      </header>

      {isEditMode && detailError && (
        <AlertMessageComponent
          message={detailError}
          tone="error"
          onClose={() => clearOperationStatus('detail')}
        />
      )}

      {formOptionsErrorMessage && (
        <AlertMessageComponent
          message={formOptionsErrorMessage}
          tone="error"
          onClose={clearFormOptionsStatus}
        />
      )}

      {submitErrorMessage && (
        <AlertMessageComponent
          message={submitErrorMessage}
          tone="error"
          onClose={clearSubmitStatus}
        />
      )}

      {submitSuccessMessage && (
        <AlertMessageComponent
          message={submitSuccessMessage}
          tone="success"
          onClose={clearSubmitStatus}
        />
      )}

      <form className="space-y-10" onSubmit={handleSubmit}>
        {isEditMode && loadingDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos de la pregunta...</p>
        )}

        <TerminationQuizQuestionFormDataSectionComponent
          form={form}
          errors={errors}
          employeeOptions={selectEmployeesWithCurrent}
          loadingEmployeeOptions={loadingFormOptions}
          onChangeField={handleChangeField}
          onValidation={onValidation}
        />

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-5 dark:border-white/10">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION)}
          />
          <ButtonComponent
            type="submit"
            variant="success"
            disabled={!canSubmit}
            label={saving ? submitLoadingLabel : submitLabel}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualización de pregunta' : 'Confirmar creación de pregunta'}
        message={confirmMessage}
        confirmLabel={submitLabel}
        cancelLabel="Cancelar"
        loading={saving}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmSave() }}
      />
    </section>
  )
}
