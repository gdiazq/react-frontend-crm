import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatusBadgeComponent,
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
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [permissionPickerValue, setPermissionPickerValue] = useState('')
  const [permissionsError, setPermissionsError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingRoleDetail = useStoreRoles((s) => s.loadingRoleDetail)
  const detailErrorMessage = useStoreRoles((s) => s.detailErrorMessage)
  const createRoleSubmitting = useStoreRoles((s) => s.createRoleSubmitting)
  const updateRoleSubmitting = useStoreRoles((s) => s.updateRoleSubmitting)
  const createRoleErrorMessage = useStoreRoles((s) => s.createRoleErrorMessage)
  const createRoleSuccessMessage = useStoreRoles((s) => s.createRoleSuccessMessage)
  const updateRoleErrorMessage = useStoreRoles((s) => s.updateRoleErrorMessage)
  const updateRoleSuccessMessage = useStoreRoles((s) => s.updateRoleSuccessMessage)
  const getRoleDetail = useStoreRoles((s) => s.getRoleDetail)
  const clearRoleDetail = useStoreRoles((s) => s.clearRoleDetail)
  const clearDetailError = useStoreRoles((s) => s.clearDetailError)
  const mutationCreateRole = useStoreRoles((s) => s.mutationCreateRole)
  const mutationUpdateRole = useStoreRoles((s) => s.mutationUpdateRole)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const clearCreateRoleStatus = useStoreRoles((s) => s.clearCreateRoleStatus)
  const clearUpdateRoleStatus = useStoreRoles((s) => s.clearUpdateRoleStatus)
  const permissionOptions = useStoreSelects((s) => s.permissionOptions)
  const loadingPermissionOptions = useStoreSelects((s) => s.loadingPermissionOptions)
  const permissionOptionsErrorMessage = useStoreSelects((s) => s.permissionOptionsErrorMessage)
  const getPermissionOptions = useStoreSelects((s) => s.getPermissionOptions)
  const clearPermissionOptionsStatus = useStoreSelects((s) => s.clearPermissionOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, rolesCreateValidationRules)

  const creating = createRoleSubmitting
  const updating = updateRoleSubmitting
  const saving = creating || updating

  const headerTitle = isEditMode ? 'Editar rol' : 'Crear rol'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del rol seleccionado.'
    : 'Completa los datos para registrar un nuevo rol en el sistema.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear rol'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando rol...'
  const submitErrorMessage = isEditMode ? updateRoleErrorMessage : createRoleErrorMessage
  const submitSuccessMessage = isEditMode ? updateRoleSuccessMessage : createRoleSuccessMessage
  const canSubmit = !saving && !loadingPermissionOptions && selectedPermissionIds.length > 0
  const permissionSelectOptions = useMemo(
    () => permissionOptions
      .filter((permission) => !selectedPermissionIds.includes(permission.id))
      .map((permission) => ({ value: String(permission.id), label: permission.name })),
    [permissionOptions, selectedPermissionIds],
  )
  const selectedPermissionItems = useMemo(() => (
    selectedPermissionIds.map((id) => {
      const matchedOption = permissionOptions.find((permission) => permission.id === id)
      return {
        id,
        name: matchedOption?.name || `PERMISSION:${id}`,
      }
    })
  ), [permissionOptions, selectedPermissionIds])

  useEffect(() => {
    void getPermissionOptions()

    return () => {
      clearCreateRoleStatus()
      clearUpdateRoleStatus()
      clearPermissionOptionsStatus()
      clearDetailError()
      clearRoleDetail()
    }
  }, [
    clearCreateRoleStatus,
    clearDetailError,
    clearPermissionOptionsStatus,
    clearRoleDetail,
    clearUpdateRoleStatus,
    getPermissionOptions,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getRoleDetail(String(editRoleId))
      if (!detail || cancelled) return

      setForm(mapRoleToForm({ name: detail.name, description: detail.description }))
      setSelectedPermissionIds(detail.permissions.map((permission) => permission.id))
      setPermissionPickerValue('')
      setPermissionsError(null)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editRoleId, getRoleDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearCreateRoleStatus()
    clearUpdateRoleStatus()
  }

  const handleChangeField = (field: keyof typeof initialCreateRoleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handlePermissionsChange = (value: string) => {
    const selectedId = Number(value)
    if (!Number.isInteger(selectedId) || selectedId <= 0) return

    setSelectedPermissionIds((prev) => (prev.includes(selectedId) ? prev : [...prev, selectedId]))
    setPermissionPickerValue('')
    setPermissionsError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemovePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) => prev.filter((id) => id !== permissionId))
    setPermissionsError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (selectedPermissionIds.length === 0) {
      setPermissionsError(
        isEditMode
          ? messages.roles.status.errors.updateRolePermissionsRequired
          : messages.roles.status.errors.createRolePermissionsRequired,
      )
      return
    }

    if (isEditMode) {
      setPendingAction({
        mode: 'update',
        payload: mapperUpdateRolePayload(editRoleId, form),
        permissionIds: [...selectedPermissionIds],
      })
    } else {
      setPendingAction({
        mode: 'create',
        payload: mapperCreateRolePayload(form),
        permissionIds: [...selectedPermissionIds],
      })
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
      ? await mutationCreateRole(pendingAction.payload, pendingAction.permissionIds)
      : await mutationUpdateRole(pendingAction.payload, pendingAction.permissionIds)

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
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{headerDescription}</p>
      </header>

      {permissionOptionsErrorMessage && (
        <AlertMessageComponent
          message={permissionOptionsErrorMessage}
          tone="error"
          onClose={clearPermissionOptionsStatus}
        />
      )}

      {isEditMode && detailErrorMessage && (
        <AlertMessageComponent
          message={detailErrorMessage}
          tone="error"
          onClose={clearDetailError}
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
        {isEditMode && loadingRoleDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del rol...</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre del rol"
            type="text"
            placeholder="Ingresa el nombre del rol"
            autoComplete="off"
            error={errors.name}
            onValueChange={(value) => handleChangeField('name', value)}
            onBlur={onValidation('name')}
            required
          />

          <InputComponent
            value={form.description}
            label="Descripcion"
            type="text"
            placeholder="Ingresa la descripcion"
            autoComplete="off"
            onValueChange={(value) => handleChangeField('description', value)}
          />
        </div>

        <section className="space-y-3">
          <header>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Permisos
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona al menos un permiso para este rol.
            </p>
          </header>

          {loadingPermissionOptions ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Cargando permisos...</p>
          ) : permissionOptions.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Sin permisos disponibles.</p>
          ) : (
            <div className="space-y-2">
              <SelectComponent
                value={permissionPickerValue}
                label="Permisos"
                disabled={saving || loadingPermissionOptions}
                options={permissionSelectOptions}
                placeholder="Selecciona un permiso"
                onValueChange={handlePermissionsChange}
                helperText="Selecciona permisos uno por uno."
              />

              {selectedPermissionItems.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">Sin permisos seleccionados.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedPermissionItems.map((permission) => (
                    <div key={permission.id} className="inline-flex items-center gap-1">
                      <StatusBadgeComponent
                        enabled
                        activeLabel={permission.name}
                        inactiveLabel={permission.name}
                      />
                      <button
                        type="button"
                        className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-300 text-xs text-slate-500 transition hover:border-rose-300 hover:text-rose-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-400/40 dark:hover:text-rose-400"
                        onClick={() => handleRemovePermission(permission.id)}
                        aria-label={`Quitar permiso ${permission.name}`}
                        disabled={saving || loadingPermissionOptions}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {permissionsError && (
            <p className="text-xs text-rose-500 dark:text-rose-400">{permissionsError}</p>
          )}
        </section>

        <div className="flex flex-wrap justify-end gap-2">
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
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de rol' : 'Confirmar creacion de rol'}
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
