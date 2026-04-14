import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION } from '@/constant'
import { initialCreateTerminationQuizQuestionForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateTerminationQuizQuestionPayload,
  mapperTerminationQuizQuestionToForm,
  mapperUpdateTerminationQuizQuestionPayload,
} from '@/mappers'
import { useStoreTerminationQuizQuestion } from '@/store'
import type {
  TerminationQuizQuestionCreateForm,
  TerminationQuizQuestionCreatePayload,
  TerminationQuizQuestionOptionForm,
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

  const loadingDetail = useStoreTerminationQuizQuestion((s) => s.loadingTerminationQuizQuestionDetail)
  const detailError = useStoreTerminationQuizQuestion((s) => s.operationStatus.detail.error)
  const createSubmitting = useStoreTerminationQuizQuestion((s) => s.createTerminationQuizQuestionSubmitting)
  const updateSubmitting = useStoreTerminationQuizQuestion((s) => s.updateTerminationQuizQuestionSubmitting)
  const createStatus = useStoreTerminationQuizQuestion((s) => s.operationStatus.create)
  const updateStatus = useStoreTerminationQuizQuestion((s) => s.operationStatus.update)
  const getDetail = useStoreTerminationQuizQuestion((s) => s.getTerminationQuizQuestionDetail)
  const clearDetail = useStoreTerminationQuizQuestion((s) => s.clearTerminationQuizQuestionDetail)
  const clearOperationStatus = useStoreTerminationQuizQuestion((s) => s.clearOperationStatus)
  const createTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.createTerminationQuizQuestion)
  const updateTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.updateTerminationQuizQuestion)

  const { errors, validateAll, onValidation } = useFormValidation(form, terminationQuizQuestionCreateValidationRules)

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
  const canSubmit = !saving

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

  const handleChangeField = (field: keyof TerminationQuizQuestionCreateForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleOptionChange = (index: number, field: keyof TerminationQuizQuestionOptionForm, value: string) => {
    setForm((prev) => {
      const options = [...prev.options]
      options[index] = { ...options[index], [field]: value }
      return { ...prev, options }
    })
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleAddOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { label: '', displayOrder: String(prev.options.length + 1) }],
    }))
  }

  const handleRemoveOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
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

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{headerDescription}</p>
      </header>

      {isEditMode && detailError && (
        <AlertMessageComponent
          message={detailError}
          tone="error"
          onClose={() => clearOperationStatus('detail')}
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

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        {isEditMode && loadingDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos de la pregunta...</p>
        )}

        <InputComponent
          value={form.question}
          label="Pregunta"
          type="text"
          placeholder="Ingresa el texto de la pregunta"
          autoComplete="off"
          error={errors.question}
          onValueChange={(v) => handleChangeField('question', v)}
          onBlur={onValidation('question')}
          required
        />

        <InputComponent
          value={form.questionGroup}
          label="Grupo de pregunta"
          type="text"
          placeholder="Ej: Ambiente Laboral"
          autoComplete="off"
          error={errors.questionGroup}
          onValueChange={(v) => handleChangeField('questionGroup', v)}
          onBlur={onValidation('questionGroup')}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputComponent
            value={form.displayOrder}
            label="Orden de visualizacion"
            type="number"
            placeholder="1"
            autoComplete="off"
            onValueChange={(v) => handleChangeField('displayOrder', v)}
          />

          <InputComponent
            value={form.employeeId}
            label="ID Empleado (opcional)"
            type="number"
            placeholder="Dejar en blanco si aplica a todos"
            autoComplete="off"
            onValueChange={(v) => handleChangeField('employeeId', v)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Requerida
          </label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="required"
                value="true"
                checked={form.required === 'true'}
                onChange={() => handleChangeField('required', 'true')}
                className="accent-cyan-600"
              />
              Sí
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="required"
                value="false"
                checked={form.required === 'false'}
                onChange={() => handleChangeField('required', 'false')}
                className="accent-cyan-600"
              />
              No
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Opciones de respuesta
            </label>
            <ButtonComponent
              type="button"
              variant="outline"
              label="+ Agregar opcion"
              onClick={handleAddOption}
            />
          </div>

          {form.options.map((option, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <InputComponent
                  value={option.label}
                  label={`Opcion ${index + 1}`}
                  type="text"
                  placeholder="Ingresa la etiqueta de la opcion"
                  autoComplete="off"
                  onValueChange={(v) => handleOptionChange(index, 'label', v)}
                />
              </div>
              <div className="w-24">
                <InputComponent
                  value={option.displayOrder}
                  label="Orden"
                  type="number"
                  placeholder={String(index + 1)}
                  autoComplete="off"
                  onValueChange={(v) => handleOptionChange(index, 'displayOrder', v)}
                />
              </div>
              {form.options.length > 1 && (
                <ButtonComponent
                  type="button"
                  variant="outline"
                  label="✕"
                  className="mb-0.5 shrink-0 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/20"
                  onClick={() => handleRemoveOption(index)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION)}
          />
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={!canSubmit}
            label={saving ? submitLoadingLabel : submitLabel}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de pregunta' : 'Confirmar creacion de pregunta'}
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
