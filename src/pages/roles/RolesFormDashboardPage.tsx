import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_ROLES } from '@/constant'
import { initialCreateRoleForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateRolePayload } from '@/mappers'
import { useStoreRoles } from '@/store'
import type { RoleCreatePayload } from '@/types'
import { rolesCreateValidationRules } from '@/validators'

export default function RolesFormDashboardPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...initialCreateRoleForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<RoleCreatePayload | null>(null)

  const createRoleSubmitting = useStoreRoles((s) => s.createRoleSubmitting)
  const createRoleErrorMessage = useStoreRoles((s) => s.createRoleErrorMessage)
  const createRoleSuccessMessage = useStoreRoles((s) => s.createRoleSuccessMessage)
  const mutationCreateRole = useStoreRoles((s) => s.mutationCreateRole)
  const clearCreateRoleStatus = useStoreRoles((s) => s.clearCreateRoleStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, rolesCreateValidationRules)

  useEffect(() => {
    return () => {
      clearCreateRoleStatus()
    }
  }, [clearCreateRoleStatus])

  const clearSubmitStatus = () => {
    clearCreateRoleStatus()
  }

  const handleChangeField = (field: keyof typeof initialCreateRoleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (createRoleErrorMessage || createRoleSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    setPendingPayload(mapperCreateRolePayload(form))
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (createRoleSubmitting) return
    setConfirmOpen(false)
    setPendingPayload(null)
  }

  const handleConfirmSave = async () => {
    if (!pendingPayload || createRoleSubmitting) return

    const success = await mutationCreateRole(pendingPayload)
    if (success) {
      navigate(AUTH_ROUTE_ROLES)
      return
    }

    setConfirmOpen(false)
    setPendingPayload(null)
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Crear rol</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Completa los datos para registrar un nuevo rol en el sistema.</p>
      </header>

      {createRoleErrorMessage && (
        <AlertMessageComponent
          message={createRoleErrorMessage}
          tone="error"
          onClose={clearSubmitStatus}
        />
      )}

      {createRoleSuccessMessage && (
        <AlertMessageComponent
          message={createRoleSuccessMessage}
          tone="success"
          onClose={clearSubmitStatus}
        />
      )}

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
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

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={createRoleSubmitting}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_ROLES)}
          />
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={createRoleSubmitting}
            label={createRoleSubmitting ? 'Creando rol...' : 'Crear rol'}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar creacion de rol"
        message={`¿Deseas crear el rol ${form.name || ''}?`}
        confirmLabel="Crear rol"
        cancelLabel="Cancelar"
        loading={createRoleSubmitting}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmSave() }}
      />
    </section>
  )
}
