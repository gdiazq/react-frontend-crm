import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  QualityOfWorkFormDataSectionComponent,
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

  const loadingQualityOfWorkDetail = useStoreQualityOfWork((s) => s.operationLoading.detail)
  const detailError = useStoreQualityOfWork((s) => s.operationStatus.detail.error)
  const createQualityOfWorkSubmitting = useStoreQualityOfWork((s) => s.operationLoading.create)
  const updateQualityOfWorkSubmitting = useStoreQualityOfWork((s) => s.operationLoading.update)
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

  const handleChangeField = (field: keyof typeof initialCreateQualityOfWorkForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

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
        {isEditMode && loadingQualityOfWorkDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos de la calidad del trabajo...</p>
        )}

        <QualityOfWorkFormDataSectionComponent
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
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY)}
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
        title={isEditMode ? 'Confirmar actualización de calidad' : 'Confirmar creación de calidad'}
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
