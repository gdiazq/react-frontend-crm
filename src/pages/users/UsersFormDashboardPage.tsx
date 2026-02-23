import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_USERS } from '@/constant'
import { initialCreateUserForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateUserPayload, mapperUpdateUserPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreSelects, useStoreUsers } from '@/store'
import type { UserCreatePayload, UserUpdatePayload } from '@/types'
import { usersCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: UserCreatePayload }
  | { mode: 'update', payload: UserUpdatePayload }
  | null

export default function UsersFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editUserId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editUserId) && editUserId > 0

  const [form, setForm] = useState({ ...initialCreateUserForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const roleOptions = useStoreSelects((s) => s.roleOptions)
  const loadingRoleOptions = useStoreSelects((s) => s.loadingRoleOptions)
  const roleOptionsErrorMessage = useStoreSelects((s) => s.roleOptionsErrorMessage)
  const getRoleOptions = useStoreSelects((s) => s.getRoleOptions)
  const clearRoleOptionsStatus = useStoreSelects((s) => s.clearRoleOptionsStatus)

  const loadingUserDetail = useStoreUsers((s) => s.loadingUserDetail)
  const detailErrorMessage = useStoreUsers((s) => s.detailErrorMessage)
  const createUserSubmitting = useStoreUsers((s) => s.createUserSubmitting)
  const updateUserSubmitting = useStoreUsers((s) => s.updateUserSubmitting)
  const createUserErrorMessage = useStoreUsers((s) => s.createUserErrorMessage)
  const createUserSuccessMessage = useStoreUsers((s) => s.createUserSuccessMessage)
  const updateUserErrorMessage = useStoreUsers((s) => s.updateUserErrorMessage)
  const updateUserSuccessMessage = useStoreUsers((s) => s.updateUserSuccessMessage)
  const getUserDetail = useStoreUsers((s) => s.getUserDetail)
  const clearUserDetail = useStoreUsers((s) => s.clearUserDetail)
  const mutationCreateUser = useStoreUsers((s) => s.mutationCreateUser)
  const mutationUpdateUser = useStoreUsers((s) => s.mutationUpdateUser)
  const clearDetailError = useStoreUsers((s) => s.clearDetailError)
  const clearCreateUserStatus = useStoreUsers((s) => s.clearCreateUserStatus)
  const clearUpdateUserStatus = useStoreUsers((s) => s.clearUpdateUserStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, usersCreateValidationRules)

  const creating = createUserSubmitting
  const updating = updateUserSubmitting
  const saving = creating || updating

  const headerTitle = isEditMode ? messages.users.ui.editUserTitle : messages.users.ui.createUserTitle
  const headerDescription = isEditMode ? messages.users.ui.editUserDescription : messages.users.ui.createUserDescription
  const submitLabel = isEditMode ? messages.users.ui.updateUserSubmit : messages.users.ui.createUserSubmit
  const submitLoadingLabel = isEditMode ? messages.users.ui.updateUserSubmitting : messages.users.ui.createUserSubmitting
  const submitErrorMessage = isEditMode ? updateUserErrorMessage : createUserErrorMessage
  const submitSuccessMessage = isEditMode ? updateUserSuccessMessage : createUserSuccessMessage
  const canSubmit = !saving && !loadingRoleOptions && form.roleId.trim().length > 0

  const selectOptions = useMemo(
    () => roleOptions.map((role) => ({ label: role.name, value: String(role.id) })),
    [roleOptions],
  )

  useEffect(() => {
    void getRoleOptions()

    return () => {
      clearCreateUserStatus()
      clearUpdateUserStatus()
      clearRoleOptionsStatus()
      clearUserDetail()
    }
  }, [clearCreateUserStatus, clearRoleOptionsStatus, clearUpdateUserStatus, clearUserDetail, getRoleOptions])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getUserDetail(String(editUserId))
      if (!detail || cancelled) return

      setForm({
        username: detail.username || '',
        email: detail.email || '',
        firstName: detail.firstName || '',
        lastName: detail.lastName || '',
        phoneNumber: detail.phoneNumber || '',
        roleId: String(detail.roles[0]?.id || ''),
      })
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editUserId, getUserDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearCreateUserStatus()
    clearUpdateUserStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      const payload = mapperUpdateUserPayload(editUserId, {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        roleId: form.roleId,
      })
      setPendingAction({ mode: 'update', payload })
    } else {
      const payload = mapperCreateUserPayload(form)
      setPendingAction({ mode: 'create', payload })
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
      ? await mutationCreateUser(pendingAction.payload)
      : await mutationUpdateUser(pendingAction.payload)

    if (success) {
      if (pendingAction.mode === 'create') {
        setForm({ ...initialCreateUserForm })
      }
      if (pendingAction.mode === 'update') {
        await getUserDetail(String(editUserId))
      }
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleChangeField = (field: keyof typeof initialCreateUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del usuario ${form.username || ''}?`
    : `¿Deseas crear al usuario ${form.username || ''} con correo ${form.email || ''}?`

  const showBootstrapMessage = isEditMode && loadingUserDetail

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{headerDescription}</p>
      </header>

      {roleOptionsErrorMessage && (
        <AlertMessageComponent
          message={roleOptionsErrorMessage}
          tone="error"
          onClose={clearRoleOptionsStatus}
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
        {showBootstrapMessage && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del usuario...</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.username}
            label="Usuario"
            type="text"
            placeholder="Ingresa el usuario"
            autoComplete="username"
            error={errors.username}
            onValueChange={(value) => handleChangeField('username', value)}
            onBlur={onValidation('username')}
            disabled={isEditMode}
            required
          />

          <InputComponent
            value={form.email}
            label="Correo"
            type="email"
            placeholder="Ingresa el correo"
            autoComplete="email"
            error={errors.email}
            onValueChange={(value) => handleChangeField('email', value)}
            onBlur={onValidation('email')}
            required
          />

          <InputComponent
            value={form.firstName}
            label="Nombre"
            type="text"
            placeholder="Ingresa el nombre"
            autoComplete="given-name"
            error={errors.firstName}
            onValueChange={(value) => handleChangeField('firstName', value)}
            onBlur={onValidation('firstName')}
            required
          />

          <InputComponent
            value={form.lastName}
            label="Apellido"
            type="text"
            placeholder="Ingresa el apellido"
            autoComplete="family-name"
            error={errors.lastName}
            onValueChange={(value) => handleChangeField('lastName', value)}
            onBlur={onValidation('lastName')}
            required
          />

          <InputComponent
            value={form.phoneNumber}
            label="Telefono"
            type="tel"
            placeholder="Ingresa el telefono"
            autoComplete="tel"
            error={errors.phoneNumber}
            onValueChange={(value) => handleChangeField('phoneNumber', value)}
            onBlur={onValidation('phoneNumber')}
            required
          />

          <SelectComponent
            value={form.roleId}
            label={messages.users.ui.createUserRoleLabel}
            options={selectOptions}
            error={errors.roleId}
            onValueChange={(value) => handleChangeField('roleId', value)}
            onValidation={onValidation('roleId')}
            required
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_USERS)}
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
        title={isEditMode ? 'Confirmar actualizacion de usuario' : 'Confirmar creacion de usuario'}
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
