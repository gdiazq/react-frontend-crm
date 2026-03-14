import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
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
        {isEditMode && loadingProjectStatusDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos de la vigencia de proyecto...</p>
        )}

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
          label="Descripcion"
          type="text"
          placeholder="Ingresa la descripcion de la vigencia de proyecto"
          autoComplete="off"
          onValueChange={handleProjectStatusDescriptionChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
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
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de vigencia' : 'Confirmar creacion de vigencia'}
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
