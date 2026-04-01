import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE } from '@/constant'
import { initialCreateNoRehireCauseForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateNoRehireCausePayload,
  mapperNoRehireCauseToForm,
  mapperUpdateNoRehireCausePayload,
} from '@/mappers'
import { useStoreNoRehireCause } from '@/store'
import type { NoRehireCauseCreatePayload, NoRehireCauseUpdatePayload } from '@/types'
import { noRehireCauseCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: NoRehireCauseCreatePayload }
  | { mode: 'update', payload: NoRehireCauseUpdatePayload }
  | null

export default function NoRehireCauseFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editNoRehireCauseId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editNoRehireCauseId) && editNoRehireCauseId > 0

  const [form, setForm] = useState({ ...initialCreateNoRehireCauseForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingNoRehireCauseDetail = useStoreNoRehireCause((s) => s.loadingNoRehireCauseDetail)
  const detailError = useStoreNoRehireCause((s) => s.operationStatus.detail.error)
  const createNoRehireCauseSubmitting = useStoreNoRehireCause((s) => s.createNoRehireCauseSubmitting)
  const updateNoRehireCauseSubmitting = useStoreNoRehireCause((s) => s.updateNoRehireCauseSubmitting)
  const createStatus = useStoreNoRehireCause((s) => s.operationStatus.create)
  const updateStatus = useStoreNoRehireCause((s) => s.operationStatus.update)
  const getNoRehireCauseDetail = useStoreNoRehireCause((s) => s.getNoRehireCauseDetail)
  const clearNoRehireCauseDetail = useStoreNoRehireCause((s) => s.clearNoRehireCauseDetail)
  const clearOperationStatus = useStoreNoRehireCause((s) => s.clearOperationStatus)
  const createNoRehireCause = useStoreNoRehireCause((s) => s.createNoRehireCause)
  const updateNoRehireCause = useStoreNoRehireCause((s) => s.updateNoRehireCause)

  const { errors, validateAll, onValidation } = useFormValidation(form, noRehireCauseCreateValidationRules)

  const saving = createNoRehireCauseSubmitting || updateNoRehireCauseSubmitting

  const headerTitle = isEditMode ? 'Editar causa de no recontratacion' : 'Crear causa de no recontratacion'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la causa de no recontratacion seleccionada.'
    : 'Completa los datos para registrar una nueva causa de no recontratacion.'
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
      clearNoRehireCauseDetail()
    }
  }, [clearOperationStatus, clearNoRehireCauseDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getNoRehireCauseDetail(String(editNoRehireCauseId))
      if (!detail || cancelled) return
      setForm(mapperNoRehireCauseToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editNoRehireCauseId, getNoRehireCauseDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateNoRehireCauseForm, value: string) => {
    setForm((prev: typeof initialCreateNoRehireCauseForm) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleNoRehireCauseNameChange = (value: string) => handleChangeField('name', value)
  const handleNoRehireCauseDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateNoRehireCausePayload(editNoRehireCauseId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateNoRehireCausePayload(form) })
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
      ? await createNoRehireCause(pendingAction.payload)
      : await updateNoRehireCause(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)
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
        {isEditMode && loadingNoRehireCauseDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos de la causa de no recontratacion...</p>
        )}

        <InputComponent
          value={form.name}
          label="Nombre causa de no recontratacion"
          type="text"
          placeholder="Ingresa el nombre de la causa de no recontratacion"
          autoComplete="off"
          error={errors.name}
          onValueChange={handleNoRehireCauseNameChange}
          onBlur={onValidation('name')}
          required
        />

        <InputComponent
          value={form.description}
          label="Descripcion"
          type="text"
          placeholder="Ingresa la descripcion de la causa de no recontratacion"
          autoComplete="off"
          onValueChange={handleNoRehireCauseDescriptionChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)}
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
