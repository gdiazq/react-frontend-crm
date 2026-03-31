import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE } from '@/constant'
import { initialCreateSafetyComplianceForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateSafetyCompliancePayload,
  mapperSafetyComplianceToForm,
  mapperUpdateSafetyCompliancePayload,
} from '@/mappers'
import { useStoreSafetyCompliance } from '@/store'
import type { SafetyComplianceCreatePayload, SafetyComplianceUpdatePayload } from '@/types'
import { safetyComplianceCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: SafetyComplianceCreatePayload }
  | { mode: 'update', payload: SafetyComplianceUpdatePayload }
  | null

export default function SafetyComplianceFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editSafetyComplianceId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editSafetyComplianceId) && editSafetyComplianceId > 0

  const [form, setForm] = useState({ ...initialCreateSafetyComplianceForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.loadingSafetyComplianceDetail)
  const detailError = useStoreSafetyCompliance((s) => s.operationStatus.detail.error)
  const createSafetyComplianceSubmitting = useStoreSafetyCompliance((s) => s.createSafetyComplianceSubmitting)
  const updateSafetyComplianceSubmitting = useStoreSafetyCompliance((s) => s.updateSafetyComplianceSubmitting)
  const createStatus = useStoreSafetyCompliance((s) => s.operationStatus.create)
  const updateStatus = useStoreSafetyCompliance((s) => s.operationStatus.update)
  const getSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.getSafetyComplianceDetail)
  const clearSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.clearSafetyComplianceDetail)
  const clearOperationStatus = useStoreSafetyCompliance((s) => s.clearOperationStatus)
  const createSafetyCompliance = useStoreSafetyCompliance((s) => s.createSafetyCompliance)
  const updateSafetyCompliance = useStoreSafetyCompliance((s) => s.updateSafetyCompliance)

  const { errors, validateAll, onValidation } = useFormValidation(form, safetyComplianceCreateValidationRules)

  const saving = createSafetyComplianceSubmitting || updateSafetyComplianceSubmitting

  const headerTitle = isEditMode ? 'Editar cumplimiento de seguridad' : 'Crear cumplimiento'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del registro de cumplimiento de seguridad seleccionado.'
    : 'Completa los datos para registrar un nuevo cumplimiento de seguridad.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear cumplimiento'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando cumplimiento...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearSafetyComplianceDetail()
    }
  }, [clearOperationStatus, clearSafetyComplianceDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getSafetyComplianceDetail(String(editSafetyComplianceId))
      if (!detail || cancelled) return
      setForm(mapperSafetyComplianceToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editSafetyComplianceId, getSafetyComplianceDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateSafetyComplianceForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleSafetyComplianceNameChange = (value: string) => handleChangeField('name', value)
  const handleSafetyComplianceDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateSafetyCompliancePayload(editSafetyComplianceId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateSafetyCompliancePayload(form) })
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
      ? await createSafetyCompliance(pendingAction.payload)
      : await updateSafetyCompliance(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del cumplimiento ${form.name}?`
    : `¿Deseas crear el cumplimiento ${form.name}?`

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
        {isEditMode && loadingSafetyComplianceDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del cumplimiento de seguridad...</p>
        )}

        <InputComponent
          value={form.name}
          label="Nombre cumplimiento de seguridad"
          type="text"
          placeholder="Ingresa el nombre del cumplimiento de seguridad"
          autoComplete="off"
          error={errors.name}
          onValueChange={handleSafetyComplianceNameChange}
          onBlur={onValidation('name')}
          required
        />

        <InputComponent
          value={form.description}
          label="Descripcion"
          type="text"
          placeholder="Ingresa la descripcion del cumplimiento de seguridad"
          autoComplete="off"
          onValueChange={handleSafetyComplianceDescriptionChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE)}
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
        title={isEditMode ? 'Confirmar actualizacion de cumplimiento' : 'Confirmar creacion de cumplimiento'}
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
