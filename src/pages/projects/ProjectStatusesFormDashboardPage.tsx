import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_STATUSES } from '@/constant'
import { initialCreateProjectStatusForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateProjectStatusPayload, mapperProjectStatusToForm, mapperUpdateProjectStatusPayload } from '@/mappers'
import { useStoreProjectStatuses } from '@/store'
import type { ProjectStatusCreatePayload, ProjectStatusUpdatePayload } from '@/types'
import { projectStatusesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: ProjectStatusCreatePayload }
  | { mode: 'update', payload: ProjectStatusUpdatePayload }
  | null

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

export default function ProjectStatusesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editProjectStatusId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editProjectStatusId) && editProjectStatusId > 0

  const [form, setForm] = useState({ ...initialCreateProjectStatusForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingProjectStatusDetail = useStoreProjectStatuses((s) => s.loadingProjectStatusDetail)
  const detailError = useStoreProjectStatuses((s) => s.operationStatus.detail.error)
  const createProjectStatusSubmitting = useStoreProjectStatuses((s) => s.createProjectStatusSubmitting)
  const updateProjectStatusSubmitting = useStoreProjectStatuses((s) => s.updateProjectStatusSubmitting)
  const createStatus = useStoreProjectStatuses((s) => s.operationStatus.create)
  const updateStatus = useStoreProjectStatuses((s) => s.operationStatus.update)
  const getProjectStatusDetail = useStoreProjectStatuses((s) => s.getProjectStatusDetail)
  const clearProjectStatusDetail = useStoreProjectStatuses((s) => s.clearProjectStatusDetail)
  const clearOperationStatus = useStoreProjectStatuses((s) => s.clearOperationStatus)
  const createProjectStatus = useStoreProjectStatuses((s) => s.createProjectStatus)
  const updateProjectStatus = useStoreProjectStatuses((s) => s.updateProjectStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, projectStatusesCreateValidationRules)

  const saving = createProjectStatusSubmitting || updateProjectStatusSubmitting

  const headerTitle = isEditMode ? 'Editar vigencia de proyecto' : 'Crear vigencia de proyecto'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la vigencia de proyecto seleccionada.'
    : 'Completa los datos para registrar una nueva vigencia de proyecto.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear vigencia'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando vigencia...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearProjectStatusDetail()
    }
  }, [
    clearOperationStatus,
    clearProjectStatusDetail,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getProjectStatusDetail(String(editProjectStatusId))
      if (!detail || cancelled) return

      setForm(mapperProjectStatusToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editProjectStatusId, getProjectStatusDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateProjectStatusForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleProjectStatusNameChange = (value: string) => handleChangeField('name', value)
  const handleProjectStatusDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateProjectStatusPayload(editProjectStatusId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateProjectStatusPayload(form) })
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
      ? await createProjectStatus(pendingAction.payload)
      : await updateProjectStatus(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_PROJECT_STATUSES)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios de la vigencia ${form.name}?`
    : `¿Deseas crear la vigencia ${form.name}?`
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editProjectStatusId}` : 'VIG-NEW'
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
        {isEditMode && loadingProjectStatusDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos de la vigencia de proyecto…</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos de la vigencia" />
          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Identificación" />
            <div className="grid gap-4 md:grid-cols-2">
              <InputComponent
                value={form.name}
                label="Nombre vigencia proyecto"
                type="text"
                placeholder="Ingresa el nombre de la vigencia de proyecto"
                autoComplete="off"
                error={errors.name}
                onValueChange={handleProjectStatusNameChange}
                onBlur={onValidation('name')}
                required
              />

              <InputComponent
                value={form.description}
                label="Descripción"
                type="text"
                placeholder="Ingresa la descripción de la vigencia de proyecto"
                autoComplete="off"
                onValueChange={handleProjectStatusDescriptionChange}
              />
            </div>
          </div>
        </section>

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
              onClick={() => navigate(AUTH_ROUTE_PROJECT_STATUSES)}
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
        title={isEditMode ? 'Confirmar actualización de vigencia' : 'Confirmar creación de vigencia'}
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
