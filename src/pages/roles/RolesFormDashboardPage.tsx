import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_ROLES } from '@/constant'
import { initialCreateRoleForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateRolePayload, mapperUpdateRolePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreRoles } from '@/store'
import type { RoleCreatePayload, RoleRaw, RoleUpdatePayload } from '@/types'
import { rolesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: RoleCreatePayload }
  | { mode: 'update', payload: RoleUpdatePayload }
  | null

export default function RolesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editRoleId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editRoleId) && editRoleId > 0

  const [form, setForm] = useState({ ...initialCreateRoleForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [editLoadErrorMessage, setEditLoadErrorMessage] = useState<string | null>(null)
  const [loadingEditRole, setLoadingEditRole] = useState(false)

  const getRoles = useStoreRoles((s) => s.getRoles)
  const createRoleSubmitting = useStoreRoles((s) => s.createRoleSubmitting)
  const updateRoleSubmitting = useStoreRoles((s) => s.updateRoleSubmitting)
  const createRoleErrorMessage = useStoreRoles((s) => s.createRoleErrorMessage)
  const createRoleSuccessMessage = useStoreRoles((s) => s.createRoleSuccessMessage)
  const updateRoleErrorMessage = useStoreRoles((s) => s.updateRoleErrorMessage)
  const updateRoleSuccessMessage = useStoreRoles((s) => s.updateRoleSuccessMessage)
  const mutationCreateRole = useStoreRoles((s) => s.mutationCreateRole)
  const mutationUpdateRole = useStoreRoles((s) => s.mutationUpdateRole)
  const clearCreateRoleStatus = useStoreRoles((s) => s.clearCreateRoleStatus)
  const clearUpdateRoleStatus = useStoreRoles((s) => s.clearUpdateRoleStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, rolesCreateValidationRules)

  const creating = createRoleSubmitting
  const updating = updateRoleSubmitting
  const saving = creating || updating

  const headerTitle = isEditMode ? messages.roles.ui.editRoleTitle : messages.roles.ui.createRoleTitle
  const headerDescription = isEditMode ? messages.roles.ui.editRoleDescription : messages.roles.ui.createRoleDescription
  const submitLabel = isEditMode ? messages.roles.ui.updateRoleSubmit : messages.roles.ui.createRoleSubmit
  const submitLoadingLabel = isEditMode ? messages.roles.ui.updateRoleSubmitting : messages.roles.ui.createRoleSubmitting
  const submitErrorMessage = isEditMode ? updateRoleErrorMessage : createRoleErrorMessage
  const submitSuccessMessage = isEditMode ? updateRoleSuccessMessage : createRoleSuccessMessage

  const fillFormFromRole = (role: RoleRaw) => {
    setForm({
      name: role.name || '',
      description: role.description || '',
    })
  }

  useEffect(() => {
    return () => {
      clearCreateRoleStatus()
      clearUpdateRoleStatus()
    }
  }, [clearCreateRoleStatus, clearUpdateRoleStatus])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const applyRole = (role: RoleRaw | undefined) => {
        if (!role || cancelled) return false
        fillFormFromRole(role)
        setEditLoadErrorMessage(null)
        return true
      }

      const currentRole = useStoreRoles.getState().rolesRaw.find((role) => role.id === editRoleId)
      if (applyRole(currentRole)) return

      try {
        setLoadingEditRole(true)
        await getRoles()
        if (cancelled) return

        const refreshedRole = useStoreRoles.getState().rolesRaw.find((role) => role.id === editRoleId)
        if (!applyRole(refreshedRole)) {
          setEditLoadErrorMessage(messages.roles.status.errors.updateRoleLoadError)
        }
      } catch {
        if (!cancelled) {
          setEditLoadErrorMessage(messages.roles.status.errors.updateRoleLoadError)
        }
      } finally {
        if (!cancelled) setLoadingEditRole(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editRoleId, getRoles, isEditMode])

  const clearSubmitStatus = () => {
    clearCreateRoleStatus()
    clearUpdateRoleStatus()
  }

  const handleChangeField = (field: keyof typeof initialCreateRoleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateRolePayload(editRoleId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateRolePayload(form) })
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
      ? await mutationCreateRole(pendingAction.payload)
      : await mutationUpdateRole(pendingAction.payload)

    if (success) {
      if (pendingAction.mode === 'create') {
        navigate(AUTH_ROUTE_ROLES)
        return
      }
      navigate(AUTH_ROUTE_ROLES)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del rol ${form.name || ''}?`
    : `¿Deseas crear el rol ${form.name || ''}?`

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{headerDescription}</p>
      </header>

      {isEditMode && editLoadErrorMessage && (
        <AlertMessageComponent
          message={editLoadErrorMessage}
          tone="error"
          onClose={() => setEditLoadErrorMessage(null)}
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
        {isEditMode && loadingEditRole && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del rol...</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label={messages.roles.ui.createRoleNameLabel}
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
            label={messages.roles.ui.createRoleDescriptionLabel}
            type="text"
            placeholder="Ingresa la descripcion"
            autoComplete="off"
            onValueChange={(value) => handleChangeField('description', value)}
          />
        </div>

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
            disabled={saving}
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
