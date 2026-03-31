import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY } from '@/constant'
import { initialCreateQualityOfWorkForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateQualityOfWorkPayload,
  mapperQualityOfWorkToForm,
  mapperUpdateQualityOfWorkPayload,
} from '@/mappers'
import { useStoreQualityOfWork } from '@/store'
import type { QualityOfWorkCreatePayload, QualityOfWorkUpdatePayload } from '@/types'
import { qualityOfWorkCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: QualityOfWorkCreatePayload }
  | { mode: 'update', payload: QualityOfWorkUpdatePayload }
  | null

export default function SettlementsWorkQualityFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editQualityOfWorkId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editQualityOfWorkId) && editQualityOfWorkId > 0

  const [form, setForm] = useState({ ...initialCreateQualityOfWorkForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingQualityOfWorkDetail = useStoreQualityOfWork((s) => s.loadingQualityOfWorkDetail)
  const detailError = useStoreQualityOfWork((s) => s.operationStatus.detail.error)
  const createQualityOfWorkSubmitting = useStoreQualityOfWork((s) => s.createQualityOfWorkSubmitting)
  const updateQualityOfWorkSubmitting = useStoreQualityOfWork((s) => s.updateQualityOfWorkSubmitting)
  const createStatus = useStoreQualityOfWork((s) => s.operationStatus.create)
  const updateStatus = useStoreQualityOfWork((s) => s.operationStatus.update)
  const getQualityOfWorkDetail = useStoreQualityOfWork((s) => s.getQualityOfWorkDetail)
  const clearQualityOfWorkDetail = useStoreQualityOfWork((s) => s.clearQualityOfWorkDetail)
  const clearOperationStatus = useStoreQualityOfWork((s) => s.clearOperationStatus)
  const createQualityOfWork = useStoreQualityOfWork((s) => s.createQualityOfWork)
  const updateQualityOfWork = useStoreQualityOfWork((s) => s.updateQualityOfWork)

  const { errors, validateAll, onValidation } = useFormValidation(form, qualityOfWorkCreateValidationRules)

  const saving = createQualityOfWorkSubmitting || updateQualityOfWorkSubmitting

  const headerTitle = isEditMode ? 'Editar calidad del trabajo' : 'Crear calidad del trabajo'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del registro de calidad del trabajo seleccionado.'
    : 'Completa los datos para registrar una nueva calidad del trabajo.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear calidad'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando calidad...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearQualityOfWorkDetail()
    }
  }, [clearOperationStatus, clearQualityOfWorkDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getQualityOfWorkDetail(String(editQualityOfWorkId))
      if (!detail || cancelled) return
      setForm(mapperQualityOfWorkToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editQualityOfWorkId, getQualityOfWorkDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateQualityOfWorkForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleQualityOfWorkNameChange = (value: string) => handleChangeField('name', value)
  const handleQualityOfWorkDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateQualityOfWorkPayload(editQualityOfWorkId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateQualityOfWorkPayload(form) })
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
      ? await createQualityOfWork(pendingAction.payload)
      : await updateQualityOfWork(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios de la calidad ${form.name}?`
    : `¿Deseas crear la calidad ${form.name}?`

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
        {isEditMode && loadingQualityOfWorkDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos de la calidad del trabajo...</p>
        )}

        <InputComponent
          value={form.name}
          label="Nombre calidad del trabajo"
          type="text"
          placeholder="Ingresa el nombre de la calidad del trabajo"
          autoComplete="off"
          error={errors.name}
          onValueChange={handleQualityOfWorkNameChange}
          onBlur={onValidation('name')}
          required
        />

        <InputComponent
          value={form.description}
          label="Descripcion"
          type="text"
          placeholder="Ingresa la descripcion de la calidad del trabajo"
          autoComplete="off"
          onValueChange={handleQualityOfWorkDescriptionChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY)}
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
        title={isEditMode ? 'Confirmar actualizacion de calidad' : 'Confirmar creacion de calidad'}
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
