import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE } from '@/constant'
import { initialCreateNoRehireCauseForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateNoRehireCausePayload,
  mapperNoRehireCauseToForm,
  mapperUpdateNoRehireCausePayload,
} from '@/mappers'
import { useStoreNoRehireCause } from '@/store'
import type { NoRehireCauseCreatePayload, NoRehireCauseUpdatePayload } from '@/types'
import { noRehireCauseCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: NoRehireCauseCreatePayload }
  | { mode: 'update', payload: NoRehireCauseUpdatePayload }
  | null

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
    </div>
  )
}

export default function NoRehireCauseFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editNoRehireCauseId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editNoRehireCauseId) && editNoRehireCauseId > 0

  const [form, setForm] = useState({ ...initialCreateNoRehireCauseForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingNoRehireCauseDetail = useStoreNoRehireCause((s) => s.loadingNoRehireCauseDetail)
  const detailError = useStoreNoRehireCause((s) => s.operationStatus.detail.error)
  const createNoRehireCauseSubmitting = useStoreNoRehireCause((s) => s.createNoRehireCauseSubmitting)
  const updateNoRehireCauseSubmitting = useStoreNoRehireCause((s) => s.updateNoRehireCauseSubmitting)
  const createStatus = useStoreNoRehireCause((s) => s.operationStatus.create)
  const updateStatus = useStoreNoRehireCause((s) => s.operationStatus.update)
  const getNoRehireCauseDetail = useStoreNoRehireCause((s) => s.getNoRehireCauseDetail)
  const clearNoRehireCauseDetail = useStoreNoRehireCause((s) => s.clearNoRehireCauseDetail)
  const clearOperationStatus = useStoreNoRehireCause((s) => s.clearOperationStatus)
  const createNoRehireCause = useStoreNoRehireCause((s) => s.createNoRehireCause)
  const updateNoRehireCause = useStoreNoRehireCause((s) => s.updateNoRehireCause)

  const { errors, validateAll, onValidation } = useFormValidation(form, noRehireCauseCreateValidationRules)

  const saving = createNoRehireCauseSubmitting || updateNoRehireCauseSubmitting

  const headerTitle = isEditMode ? 'Editar causa de no recontratación' : 'Crear causa de no recontratación'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la causa de no recontratación seleccionada.'
    : 'Completa los datos para registrar una nueva causa de no recontratación.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear causa'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando causa...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearNoRehireCauseDetail()
    }
  }, [clearOperationStatus, clearNoRehireCauseDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getNoRehireCauseDetail(String(editNoRehireCauseId))
      if (!detail || cancelled) return
      setForm(mapperNoRehireCauseToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editNoRehireCauseId, getNoRehireCauseDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateNoRehireCauseForm, value: string) => {
    setForm((prev: typeof initialCreateNoRehireCauseForm) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleNoRehireCauseNameChange = (value: string) => handleChangeField('name', value)
  const handleNoRehireCauseDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateNoRehireCausePayload(editNoRehireCauseId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateNoRehireCausePayload(form) })
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
      ? await createNoRehireCause(pendingAction.payload)
      : await updateNoRehireCause(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios de la causa ${form.name}?`
    : `¿Deseas crear la causa ${form.name}?`
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')

  return (
    <section className="space-y-6">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <h1 className="display text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          {heroLeading}
          {heroTrailing && (
            <span className="display-it text-slate-500 dark:text-slate-400"> {heroTrailing}</span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {headerDescription}
        </p>
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
        className="space-y-10"
        onSubmit={handleSubmit}
      >
        {isEditMode && loadingNoRehireCauseDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos de la causa de no recontratación...</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos de no recontratación" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Identificación de la causa" />
            <div className="grid gap-4 md:grid-cols-2">
              <InputComponent
                value={form.name}
                label="Nombre causa de no recontratación"
                type="text"
                placeholder="Ingresa el nombre de la causa de no recontratación"
                autoComplete="off"
                error={errors.name}
                onValueChange={handleNoRehireCauseNameChange}
                onBlur={onValidation('name')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.2" title="Descripción operativa" />
            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Descripción
              </label>
              <textarea
                value={form.description}
                placeholder="Ingresa la descripción de la causa de no recontratación"
                autoComplete="off"
                rows={5}
                className="r-md min-h-28 w-full resize-y border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--accent-400)] focus:ring-2 focus:ring-[color:var(--accent-400)]/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                onChange={(event) => handleNoRehireCauseDescriptionChange(event.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-5 dark:border-white/10">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={saving}
            label="Volver"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)}
          />
          <ButtonComponent
            type="submit"
            variant="success"
            disabled={!canSubmit}
            label={saving ? submitLoadingLabel : submitLabel}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualización de causa' : 'Confirmar creación de causa'}
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
