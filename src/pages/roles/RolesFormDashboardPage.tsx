import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_ROLES } from '@/constant'
import { initialCreateRoleForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateRolePayload, mapperUpdateRolePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreRoles, useStoreSelects } from '@/store'
import type { RoleCreatePayload, RoleUpdatePayload } from '@/types'
import { mapRoleToForm } from '@/utils'
import { rolesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: RoleCreatePayload, permissionIds: number[] }
  | { mode: 'update', payload: RoleUpdatePayload, permissionIds: number[] }
  | null

export default function RolesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editRoleId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editRoleId) && editRoleId > 0

  const [form, setForm] = useState({ ...initialCreateRoleForm })
  const [selectedPermissionValues, setSelectedPermissionValues] = useState<string[]>([])
  const [permissionsError, setPermissionsError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingRoleDetail = useStoreRoles((s) => s.operationLoading.detail)
  const detailError = useStoreRoles((s) => s.operationStatus.detail.error)
  const createRoleSubmitting = useStoreRoles((s) => s.operationLoading.create)
  const updateRoleSubmitting = useStoreRoles((s) => s.operationLoading.update)
  const createStatus = useStoreRoles((s) => s.operationStatus.create)
  const updateStatus = useStoreRoles((s) => s.operationStatus.update)
  const getRoleDetail = useStoreRoles((s) => s.getRoleDetail)
  const clearRoleDetail = useStoreRoles((s) => s.clearRoleDetail)
  const clearOperationStatus = useStoreRoles((s) => s.clearOperationStatus)
  const createRole = useStoreRoles((s) => s.createRole)
  const updateRole = useStoreRoles((s) => s.updateRole)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const permissionOptions = useStoreSelects((s) => s.permissionOptions)
  const loadingPermissionOptions = useStoreSelects((s) => s.loadingPermissionOptions)
  const permissionOptionsErrorMessage = useStoreSelects((s) => s.permissionOptionsErrorMessage)
  const getPermissionOptions = useStoreSelects((s) => s.getPermissionOptions)
  const clearPermissionOptionsStatus = useStoreSelects((s) => s.clearPermissionOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, rolesCreateValidationRules)

  const saving = createRoleSubmitting || updateRoleSubmitting

  const headerTitle = isEditMode ? 'Editar rol' : 'Crear rol'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del rol seleccionado.'
    : 'Completa los datos para registrar un nuevo rol en el sistema.'
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editRoleId}` : 'ROL-NEW'
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear rol'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando rol...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingPermissionOptions && selectedPermissionValues.length > 0
  const permissionSelectOptions = permissionOptions.map((permission) => ({
    value: String(permission.id),
    label: permission.name,
  }))

  useEffect(() => {
    void getPermissionOptions()

    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearPermissionOptionsStatus()
      clearRoleDetail()
    }
  }, [
    clearOperationStatus,
    clearPermissionOptionsStatus,
    clearRoleDetail,
    getPermissionOptions,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getRoleDetail(String(editRoleId))
      if (!detail || cancelled) return

      setForm(mapRoleToForm({ name: detail.name, description: detail.description }))
      setSelectedPermissionValues(detail.permissions.map((permission) => String(permission.id)))
      setPermissionsError(null)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editRoleId, getRoleDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateRoleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleRoleNameChange = (value: string) => handleChangeField('name', value)
  const handleRoleDescriptionChange = (value: string) => handleChangeField('description', value)

  const handlePermissionsValuesChange = (values: string[]) => {
    setSelectedPermissionValues(values)
    setPermissionsError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (selectedPermissionValues.length === 0) {
      setPermissionsError(
        isEditMode
          ? messages.roles.status.errors.updateRolePermissionsRequired
          : messages.roles.status.errors.createRolePermissionsRequired,
      )
      return
    }

    const permissionIds = selectedPermissionValues.map(Number)

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateRolePayload(editRoleId, form), permissionIds })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateRolePayload(form), permissionIds })
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
      ? await createRole(pendingAction.payload, pendingAction.permissionIds)
      : await updateRole(pendingAction.payload, pendingAction.permissionIds)

    if (success) {
      try {
        await getCurrentUser()
      } catch {
        // Ignore refresh errors; user can continue with current session data.
      }
      navigate(AUTH_ROUTE_ROLES)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del rol ${form.name}?`
    : `¿Deseas crear el rol ${form.name}?`

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
          {heroTrailing && <span className="display-it text-slate-500 dark:text-slate-400"> {heroTrailing}</span>}
        </h1>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {headerDescription}
        </p>
      </header>

      {permissionOptionsErrorMessage && (
        <AlertMessageComponent
          message={permissionOptionsErrorMessage}
          tone="error"
          onClose={clearPermissionOptionsStatus}
        />
      )}

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
        className="space-y-10"
        onSubmit={handleSubmit}
      >
        {isEditMode && loadingRoleDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del rol...</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos del rol" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Identificación" />
            <div className="grid gap-4 md:grid-cols-2">
              <InputComponent
                value={form.name}
                label="Nombre del rol"
                type="text"
                placeholder="Ingresa el nombre del rol"
                autoComplete="off"
                error={errors.name}
                onValueChange={handleRoleNameChange}
                onBlur={onValidation('name')}
                required
              />

              <InputComponent
                value={form.description}
                label="Descripción"
                type="text"
                placeholder="Ingresa la descripción"
                autoComplete="off"
                onValueChange={handleRoleDescriptionChange}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="02" title="Permisos" />
          <div className="space-y-3">
            <SubSectionLabel number="02.1" title="Accesos asociados" />
            <SelectComponent
              label="Permisos"
              multiple
              disabled={saving || loadingPermissionOptions}
              options={permissionSelectOptions}
              values={selectedPermissionValues}
              placeholder="Selecciona permisos"
              helperText="Selecciona al menos un permiso para este rol."
              error={permissionsError}
              loading={loadingPermissionOptions}
              onValuesChange={handlePermissionsValuesChange}
            />
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
              onClick={() => navigate(AUTH_ROUTE_ROLES)}
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
        title={isEditMode ? 'Confirmar actualización de rol' : 'Confirmar creación de rol'}
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

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}
