import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { mapperCreateUserPayload } from '@/mappers'
import { useStoreSelects, useStoreUsers } from '@/store'
import type { UserCreatePayload } from '@/types'
import { usersCreateValidationRules } from '@/validators'

export default function UsersFormDashboardPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...initialCreateUserForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<UserCreatePayload | null>(null)

  const roleOptions = useStoreSelects((s) => s.roleOptions)
  const loadingRoleOptions = useStoreSelects((s) => s.loadingRoleOptions)
  const roleOptionsErrorMessage = useStoreSelects((s) => s.roleOptionsErrorMessage)
  const getRoleOptions = useStoreSelects((s) => s.getRoleOptions)
  const clearRoleOptionsStatus = useStoreSelects((s) => s.clearRoleOptionsStatus)
  const createUserSubmitting = useStoreUsers((s) => s.createUserSubmitting)
  const createUserErrorMessage = useStoreUsers((s) => s.createUserErrorMessage)
  const createUserSuccessMessage = useStoreUsers((s) => s.createUserSuccessMessage)
  const mutationCreateUser = useStoreUsers((s) => s.mutationCreateUser)
  const clearCreateUserStatus = useStoreUsers((s) => s.clearCreateUserStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, usersCreateValidationRules)

  const selectOptions = useMemo(
    () => roleOptions.map((role) => ({ label: role.name, value: String(role.id) })),
    [roleOptions],
  )

  useEffect(() => {
    clearCreateUserStatus()
    clearRoleOptionsStatus()
    void getRoleOptions()
    return () => {
      clearCreateUserStatus()
      clearRoleOptionsStatus()
    }
  }, [clearCreateUserStatus, clearRoleOptionsStatus, getRoleOptions])

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    const payload = mapperCreateUserPayload(form)
    setPendingPayload(payload)
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (createUserSubmitting) return
    setConfirmOpen(false)
    setPendingPayload(null)
  }

  const handleConfirmCreate = async () => {
    if (!pendingPayload || createUserSubmitting) return
    const success = await mutationCreateUser(pendingPayload)
    if (success) {
      setForm({ ...initialCreateUserForm })
    }
    setConfirmOpen(false)
    setPendingPayload(null)
  }

  const handleChangeField = (field: keyof typeof initialCreateUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (createUserErrorMessage || createUserSuccessMessage) clearCreateUserStatus()
  }

  const confirmMessage = pendingPayload
    ? `¿Deseas crear al usuario ${pendingPayload.username} con correo ${pendingPayload.email}?`
    : '¿Deseas crear este usuario?'

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Crear usuario</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Completa los datos para registrar un nuevo usuario en el sistema.</p>
      </header>

      {createUserErrorMessage && (
        <AlertMessageComponent
          message={createUserErrorMessage}
          tone="error"
          onClose={clearCreateUserStatus}
        />
      )}

      {roleOptionsErrorMessage && (
        <AlertMessageComponent
          message={roleOptionsErrorMessage}
          tone="error"
          onClose={clearRoleOptionsStatus}
        />
      )}

      {createUserSuccessMessage && (
        <AlertMessageComponent
          message={createUserSuccessMessage}
          tone="success"
          onClose={clearCreateUserStatus}
        />
      )}

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
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
            label="Rol"
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
            disabled={createUserSubmitting}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_USERS)}
          />
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={createUserSubmitting || loadingRoleOptions || selectOptions.length === 0}
            label={createUserSubmitting ? 'Creando usuario...' : 'Crear usuario'}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar creacion de usuario"
        message={confirmMessage}
        confirmLabel="Crear usuario"
        cancelLabel="Cancelar"
        loading={createUserSubmitting}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmCreate() }}
      />
    </section>
  )
}
