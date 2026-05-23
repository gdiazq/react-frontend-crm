import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  SafetyComplianceFormDataSectionComponent,
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

  const loadingSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.operationLoading.detail)
  const detailError = useStoreSafetyCompliance((s) => s.operationStatus.detail.error)
  const createSafetyComplianceSubmitting = useStoreSafetyCompliance((s) => s.operationLoading.create)
  const updateSafetyComplianceSubmitting = useStoreSafetyCompliance((s) => s.operationLoading.update)
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

  const handleChangeField = (field: keyof typeof initialCreateSafetyComplianceForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

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
        {isEditMode && loadingSafetyComplianceDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del cumplimiento de seguridad...</p>
        )}

        <SafetyComplianceFormDataSectionComponent
          form={form}
          errors={errors}
          onChangeField={handleChangeField}
          onValidation={onValidation}
        />

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-5 dark:border-white/10">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE)}
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
        title={isEditMode ? 'Confirmar actualización de cumplimiento' : 'Confirmar creación de cumplimiento'}
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
