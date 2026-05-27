import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  ProjectTypesFormDataSectionComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_TYPES } from '@/constant'
import { initialCreateProjectTypeForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateProjectTypePayload, mapperProjectTypeToForm, mapperUpdateProjectTypePayload } from '@/mappers'
import { useStoreProjectTypes } from '@/store'
import { projectTypesCreateValidationRules } from '@/validators'

export default function ProjectTypesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editProjectTypeId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editProjectTypeId) && editProjectTypeId > 0

  const [form, setForm] = useState({ ...initialCreateProjectTypeForm })
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Store state used to render loading and submit status.
  const loadingProjectTypeDetail = useStoreProjectTypes((s) => s.operationLoading.detail)
  const detailError = useStoreProjectTypes((s) => s.operationStatus.detail.error)
  const createProjectTypeSubmitting = useStoreProjectTypes((s) => s.operationLoading.create)
  const updateProjectTypeSubmitting = useStoreProjectTypes((s) => s.operationLoading.update)
  const createStatus = useStoreProjectTypes((s) => s.operationStatus.create)
  const updateStatus = useStoreProjectTypes((s) => s.operationStatus.update)

  // Store actions triggered by form lifecycle and submit.
  const getProjectTypeDetail = useStoreProjectTypes((s) => s.getProjectTypeDetail)
  const clearProjectTypeDetail = useStoreProjectTypes((s) => s.clearProjectTypeDetail)
  const clearOperationStatus = useStoreProjectTypes((s) => s.clearOperationStatus)
  const createProjectType = useStoreProjectTypes((s) => s.createProjectType)
  const updateProjectType = useStoreProjectTypes((s) => s.updateProjectType)

  const { errors, validateAll, onValidation } = useFormValidation(form, projectTypesCreateValidationRules)

  // Derived UI state.
  const saving = createProjectTypeSubmitting || updateProjectTypeSubmitting
  const headerTitle = isEditMode ? 'Editar tipo de proyecto' : 'Crear tipo de proyecto'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del tipo de proyecto seleccionado.'
    : 'Completa los datos para registrar un nuevo tipo de proyecto.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear tipo'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando tipo...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearProjectTypeDetail()
    }
  }, [
    clearOperationStatus,
    clearProjectTypeDetail,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getProjectTypeDetail(String(editProjectTypeId))
      if (!detail || cancelled) return

      setForm(mapperProjectTypeToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editProjectTypeId, getProjectTypeDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateProjectTypeForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
  }

  const handleConfirmSave = async () => {
    if (saving) return
    if (!validateAll()) return

    const success = isEditMode
      ? await updateProjectType(mapperUpdateProjectTypePayload(editProjectTypeId, form))
      : await createProjectType(mapperCreateProjectTypePayload(form))

    if (success) {
      navigate(AUTH_ROUTE_PROJECT_TYPES)
      return
    }

    setConfirmOpen(false)
  }

  const confirmMessage = isEditMode
    ? `¿Deseas guardar los cambios del tipo ${form.name}?`
    : `¿Deseas crear el tipo ${form.name}?`
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editProjectTypeId}` : 'TYPE-NEW'
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')

  return (
    <section className="space-y-6">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">{heroEyebrow}</span>
          <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" />
          <span className="num">{heroIdSuffix}</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          {heroLeading}
          {heroTrailing && (
            <span className="display-it text-slate-500 dark:text-slate-400"> {heroTrailing}</span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">{headerDescription}</p>
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
        {isEditMode && loadingProjectTypeDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del tipo de proyecto…</p>
        )}

        <ProjectTypesFormDataSectionComponent
          form={form}
          errors={errors}
          onChangeField={handleChangeField}
          onValidation={onValidation}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
          <p className="num text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            FIN DEL REGISTRO · {new Date().toLocaleDateString('es-CL')}
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={saving}
              label="Volver"
              onClick={() => navigate(AUTH_ROUTE_PROJECT_TYPES)}
            />
            <ButtonComponent
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              label={saving ? submitLoadingLabel : submitLabel}
            />
          </div>
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualización de tipo' : 'Confirmar creación de tipo'}
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
