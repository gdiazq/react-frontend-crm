import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  ProjectSpecialtiesFormDataSectionComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_SPECIALTIES } from '@/constant'
import { initialCreateProjectSpecialtyForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateProjectSpecialtyPayload, mapperProjectSpecialtyToForm, mapperUpdateProjectSpecialtyPayload } from '@/mappers'
import { useStoreProjectSpecialties } from '@/store'
import type { ProjectSpecialtyCreatePayload, ProjectSpecialtyUpdatePayload } from '@/types'
import { projectSpecialtiesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: ProjectSpecialtyCreatePayload }
  | { mode: 'update', payload: ProjectSpecialtyUpdatePayload }
  | null

export default function ProjectSpecialtiesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editProjectSpecialtyId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editProjectSpecialtyId) && editProjectSpecialtyId > 0

  const [form, setForm] = useState({ ...initialCreateProjectSpecialtyForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.operationLoading.detail)
  const detailError = useStoreProjectSpecialties((s) => s.operationStatus.detail.error)
  const createProjectSpecialtySubmitting = useStoreProjectSpecialties((s) => s.operationLoading.create)
  const updateProjectSpecialtySubmitting = useStoreProjectSpecialties((s) => s.operationLoading.update)
  const createStatus = useStoreProjectSpecialties((s) => s.operationStatus.create)
  const updateStatus = useStoreProjectSpecialties((s) => s.operationStatus.update)
  const getProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.getProjectSpecialtyDetail)
  const clearProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.clearProjectSpecialtyDetail)
  const clearOperationStatus = useStoreProjectSpecialties((s) => s.clearOperationStatus)
  const createProjectSpecialty = useStoreProjectSpecialties((s) => s.createProjectSpecialty)
  const updateProjectSpecialty = useStoreProjectSpecialties((s) => s.updateProjectSpecialty)

  const { errors, validateAll, onValidation } = useFormValidation(form, projectSpecialtiesCreateValidationRules)

  const saving = createProjectSpecialtySubmitting || updateProjectSpecialtySubmitting

  const headerTitle = isEditMode ? 'Editar especialidad de proyecto' : 'Crear especialidad de proyecto'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la especialidad de proyecto seleccionada.'
    : 'Completa los datos para registrar una nueva especialidad de proyecto.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear especialidad'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando especialidad...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearProjectSpecialtyDetail()
    }
  }, [
    clearOperationStatus,
    clearProjectSpecialtyDetail,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getProjectSpecialtyDetail(String(editProjectSpecialtyId))
      if (!detail || cancelled) return

      setForm(mapperProjectSpecialtyToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editProjectSpecialtyId, getProjectSpecialtyDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateProjectSpecialtyForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateProjectSpecialtyPayload(editProjectSpecialtyId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateProjectSpecialtyPayload(form) })
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
      ? await createProjectSpecialty(pendingAction.payload)
      : await updateProjectSpecialty(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_PROJECT_SPECIALTIES)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios de la especialidad ${form.name}?`
    : `¿Deseas crear la especialidad ${form.name}?`
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editProjectSpecialtyId}` : 'SPEC-NEW'
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
        {isEditMode && loadingProjectSpecialtyDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos de la especialidad de proyecto…</p>
        )}

        <ProjectSpecialtiesFormDataSectionComponent
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
              onClick={() => navigate(AUTH_ROUTE_PROJECT_SPECIALTIES)}
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
        title={isEditMode ? 'Confirmar actualización de especialidad' : 'Confirmar creación de especialidad'}
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
