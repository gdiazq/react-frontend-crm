import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES } from '@/constant'
import { initialCreateLegalTerminationCauseForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateLegalTerminationCausePayload,
  mapperLegalTerminationCauseToForm,
  mapperUpdateLegalTerminationCausePayload,
} from '@/mappers'
import { useStoreLegalTerminationCauses } from '@/store'
import type { LegalTerminationCauseCreatePayload, LegalTerminationCauseUpdatePayload } from '@/types'
import { legalTerminationCausesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: LegalTerminationCauseCreatePayload }
  | { mode: 'update', payload: LegalTerminationCauseUpdatePayload }
  | null

export default function SettlementsTerminationFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editLegalTerminationCauseId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editLegalTerminationCauseId) && editLegalTerminationCauseId > 0

  const [form, setForm] = useState({ ...initialCreateLegalTerminationCauseForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.loadingLegalTerminationCauseDetail)
  const detailError = useStoreLegalTerminationCauses((s) => s.operationStatus.detail.error)
  const createLegalTerminationCauseSubmitting = useStoreLegalTerminationCauses((s) => s.createLegalTerminationCauseSubmitting)
  const updateLegalTerminationCauseSubmitting = useStoreLegalTerminationCauses((s) => s.updateLegalTerminationCauseSubmitting)
  const createStatus = useStoreLegalTerminationCauses((s) => s.operationStatus.create)
  const updateStatus = useStoreLegalTerminationCauses((s) => s.operationStatus.update)
  const getLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauseDetail)
  const clearLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.clearLegalTerminationCauseDetail)
  const clearOperationStatus = useStoreLegalTerminationCauses((s) => s.clearOperationStatus)
  const createLegalTerminationCause = useStoreLegalTerminationCauses((s) => s.createLegalTerminationCause)
  const updateLegalTerminationCause = useStoreLegalTerminationCauses((s) => s.updateLegalTerminationCause)

  const { errors, validateAll, onValidation } = useFormValidation(form, legalTerminationCausesCreateValidationRules)

  const saving = createLegalTerminationCauseSubmitting || updateLegalTerminationCauseSubmitting

  const headerTitle = isEditMode ? 'Editar causa legal de terminacion' : 'Crear causa legal de terminacion'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la causa legal de terminacion seleccionada.'
    : 'Completa los datos para registrar una nueva causa legal de terminacion.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear causa'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando causa...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearLegalTerminationCauseDetail()
    }
  }, [clearOperationStatus, clearLegalTerminationCauseDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getLegalTerminationCauseDetail(String(editLegalTerminationCauseId))
      if (!detail || cancelled) return
      setForm(mapperLegalTerminationCauseToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editLegalTerminationCauseId, getLegalTerminationCauseDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateLegalTerminationCauseForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleLegalTerminationCauseNameChange = (value: string) => handleChangeField('name', value)
  const handleLegalTerminationCauseDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateLegalTerminationCausePayload(editLegalTerminationCauseId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateLegalTerminationCausePayload(form) })
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
      ? await createLegalTerminationCause(pendingAction.payload)
      : await updateLegalTerminationCause(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios de la causa ${form.name}?`
    : `¿Deseas crear la causa ${form.name}?`

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
        {isEditMode && loadingLegalTerminationCauseDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos de la causa legal de terminacion...</p>
        )}

        <InputComponent
          value={form.name}
          label="Nombre causa legal"
          type="text"
          placeholder="Ingresa el nombre de la causa legal"
          autoComplete="off"
          error={errors.name}
          onValueChange={handleLegalTerminationCauseNameChange}
          onBlur={onValidation('name')}
          required
        />

        <InputComponent
          value={form.description}
          label="Descripcion"
          type="text"
          placeholder="Ingresa la descripcion de la causa legal"
          autoComplete="off"
          onValueChange={handleLegalTerminationCauseDescriptionChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)}
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
        title={isEditMode ? 'Confirmar actualizacion de causa' : 'Confirmar creacion de causa'}
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
