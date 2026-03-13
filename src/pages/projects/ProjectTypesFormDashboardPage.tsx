import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_TYPES } from '@/constant'
import { initialCreateProjectTypeForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateProjectTypePayload, mapperProjectTypeToForm, mapperUpdateProjectTypePayload } from '@/mappers'
import { useStoreProjectTypes } from '@/store'
import type { ProjectTypeCreatePayload, ProjectTypeUpdatePayload } from '@/types'
import { projectTypesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: ProjectTypeCreatePayload }
  | { mode: 'update', payload: ProjectTypeUpdatePayload }
  | null

export default function ProjectTypesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editProjectTypeId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editProjectTypeId) && editProjectTypeId > 0

  const [form, setForm] = useState({ ...initialCreateProjectTypeForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingProjectTypeDetail = useStoreProjectTypes((s) => s.loadingProjectTypeDetail)
  const detailError = useStoreProjectTypes((s) => s.operationStatus.detail.error)
  const createProjectTypeSubmitting = useStoreProjectTypes((s) => s.createProjectTypeSubmitting)
  const updateProjectTypeSubmitting = useStoreProjectTypes((s) => s.updateProjectTypeSubmitting)
  const createStatus = useStoreProjectTypes((s) => s.operationStatus.create)
  const updateStatus = useStoreProjectTypes((s) => s.operationStatus.update)
  const getProjectTypeDetail = useStoreProjectTypes((s) => s.getProjectTypeDetail)
  const clearProjectTypeDetail = useStoreProjectTypes((s) => s.clearProjectTypeDetail)
  const clearOperationStatus = useStoreProjectTypes((s) => s.clearOperationStatus)
  const createProjectType = useStoreProjectTypes((s) => s.createProjectType)
  const updateProjectType = useStoreProjectTypes((s) => s.updateProjectType)

  const { errors, validateAll, onValidation } = useFormValidation(form, projectTypesCreateValidationRules)

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

  const handleChangeField = (field: keyof typeof initialCreateProjectTypeForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleProjectTypeNameChange = (value: string) => handleChangeField('name', value)
  const handleProjectTypeDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateProjectTypePayload(editProjectTypeId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateProjectTypePayload(form) })
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
      ? await createProjectType(pendingAction.payload)
      : await updateProjectType(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_PROJECT_TYPES)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del tipo ${form.name}?`
    : `¿Deseas crear el tipo ${form.name}?`

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
        {isEditMode && loadingProjectTypeDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del tipo de proyecto...</p>
        )}

        <InputComponent
          value={form.name}
          label="Nombre tipo proyecto"
          type="text"
          placeholder="Ingresa el nombre del tipo de proyecto"
          autoComplete="off"
          error={errors.name}
          onValueChange={handleProjectTypeNameChange}
          onBlur={onValidation('name')}
          required
        />

        <InputComponent
          value={form.description}
          label="Descripcion"
          type="text"
          placeholder="Ingresa la descripcion del tipo de proyecto"
          autoComplete="off"
          onValueChange={handleProjectTypeDescriptionChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
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
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de tipo' : 'Confirmar creacion de tipo'}
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
