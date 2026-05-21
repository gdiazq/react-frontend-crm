import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  SaveConfirmComponent,
  UsersFormDataSectionComponent,
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

  const loadingUserDetail = useStoreUsers((s) => s.operationLoading.detail)
  const detailError = useStoreUsers((s) => s.operationStatus.detail.error)
  const createUserSubmitting = useStoreUsers((s) => s.operationLoading.create)
  const updateUserSubmitting = useStoreUsers((s) => s.operationLoading.update)
  const createStatus = useStoreUsers((s) => s.operationStatus.create)
  const updateStatus = useStoreUsers((s) => s.operationStatus.update)
  const getUserDetail = useStoreUsers((s) => s.getUserDetail)
  const clearUserDetail = useStoreUsers((s) => s.clearUserDetail)
  const createUser = useStoreUsers((s) => s.createUser)
  const updateUser = useStoreUsers((s) => s.updateUser)
  const clearOperationStatus = useStoreUsers((s) => s.clearOperationStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, usersCreateValidationRules)

  const creating = createUserSubmitting
  const updating = updateUserSubmitting
  const saving = creating || updating

  const headerTitle = isEditMode ? messages.users.ui.editUserTitle : messages.users.ui.createUserTitle
  const headerDescription = isEditMode ? messages.users.ui.editUserDescription : messages.users.ui.createUserDescription
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editUserId}` : 'USR-NEW'
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')
  const submitLabel = isEditMode ? messages.users.ui.updateUserSubmit : messages.users.ui.createUserSubmit
  const submitLoadingLabel = isEditMode ? messages.users.ui.updateUserSubmitting : messages.users.ui.createUserSubmitting
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingRoleOptions && form.roleId.trim().length > 0

  const selectOptions = roleOptions.map((role) => ({ label: role.name, value: String(role.id) }))

  useEffect(() => {
    void getRoleOptions()

    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearRoleOptionsStatus()
      clearUserDetail()
    }
  }, [clearOperationStatus, clearRoleOptionsStatus, clearUserDetail, getRoleOptions])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getUserDetail(String(editUserId))
      if (!detail || cancelled) return

      setForm({
        username: detail.username,
        email: detail.email,
        firstName: detail.firstName,
        lastName: detail.lastName,
        phoneNumber: detail.phoneNumber ?? '',
        roleId: String(detail.roles[0]?.id ?? ''),
      })
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editUserId, getUserDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
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
      ? await createUser(pendingAction.payload)
      : await updateUser(pendingAction.payload)

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
  const handleFieldValueChange = (field: keyof typeof initialCreateUserForm) => (value: string) => {
    handleChangeField(field, value)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del usuario ${form.username}?`
    : `¿Deseas crear al usuario ${form.username} con correo ${form.email}?`

  const showBootstrapMessage = isEditMode && loadingUserDetail

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

      {roleOptionsErrorMessage && (
        <AlertMessageComponent
          message={roleOptionsErrorMessage}
          tone="error"
          onClose={clearRoleOptionsStatus}
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
        {showBootstrapMessage && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del usuario...</p>
        )}

        <UsersFormDataSectionComponent
          form={form}
          errors={errors}
          isEditMode={isEditMode}
          roleOptions={selectOptions}
          onChangeField={handleFieldValueChange}
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
              onClick={() => navigate(AUTH_ROUTE_USERS)}
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
