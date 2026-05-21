import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES } from '@/constant'
import { initialCreateLegalTerminationCauseForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateLegalTerminationCausePayload,
  mapperLegalTerminationCauseToForm,
  mapperUpdateLegalTerminationCausePayload,
} from '@/mappers'
import { useStoreLegalTerminationCauses } from '@/store'
import type { LegalTerminationCauseCreatePayload, LegalTerminationCauseUpdatePayload } from '@/types'
import { legalTerminationCausesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: LegalTerminationCauseCreatePayload }
  | { mode: 'update', payload: LegalTerminationCauseUpdatePayload }
  | null

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
    </div>
  )
}

export default function SettlementsTerminationFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editLegalTerminationCauseId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editLegalTerminationCauseId) && editLegalTerminationCauseId > 0

  const [form, setForm] = useState({ ...initialCreateLegalTerminationCauseForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.operationLoading.detail)
  const detailError = useStoreLegalTerminationCauses((s) => s.operationStatus.detail.error)
  const createLegalTerminationCauseSubmitting = useStoreLegalTerminationCauses((s) => s.operationLoading.create)
  const updateLegalTerminationCauseSubmitting = useStoreLegalTerminationCauses((s) => s.operationLoading.update)
  const createStatus = useStoreLegalTerminationCauses((s) => s.operationStatus.create)
  const updateStatus = useStoreLegalTerminationCauses((s) => s.operationStatus.update)
  const getLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauseDetail)
  const clearLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.clearLegalTerminationCauseDetail)
  const clearOperationStatus = useStoreLegalTerminationCauses((s) => s.clearOperationStatus)
  const createLegalTerminationCause = useStoreLegalTerminationCauses((s) => s.createLegalTerminationCause)
  const updateLegalTerminationCause = useStoreLegalTerminationCauses((s) => s.updateLegalTerminationCause)

  const { errors, validateAll, onValidation } = useFormValidation(form, legalTerminationCausesCreateValidationRules)

  const saving = createLegalTerminationCauseSubmitting || updateLegalTerminationCauseSubmitting

  const headerTitle = isEditMode ? 'Editar causa legal de terminación' : 'Crear causa legal de terminación'
  const headerDescription = isEditMode
    ? 'Actualiza los datos de la causa legal de terminación seleccionada.'
    : 'Completa los datos para registrar una nueva causa legal de terminación.'
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
      clearLegalTerminationCauseDetail()
    }
  }, [clearOperationStatus, clearLegalTerminationCauseDetail])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getLegalTerminationCauseDetail(String(editLegalTerminationCauseId))
      if (!detail || cancelled) return
      setForm(mapperLegalTerminationCauseToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editLegalTerminationCauseId, getLegalTerminationCauseDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateLegalTerminationCauseForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleLegalTerminationCauseNameChange = (value: string) => handleChangeField('name', value)
  const handleLegalTerminationCauseDescriptionChange = (value: string) => handleChangeField('description', value)

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateLegalTerminationCausePayload(editLegalTerminationCauseId, form) })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateLegalTerminationCausePayload(form) })
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
      ? await createLegalTerminationCause(pendingAction.payload)
      : await updateLegalTerminationCause(pendingAction.payload)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)
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
        {isEditMode && loadingLegalTerminationCauseDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos de la causa legal de terminación…</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos de terminación" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Identificación de la causa" />
            <div className="grid gap-4 md:grid-cols-2">
              <InputComponent
                value={form.name}
                label="Nombre causa legal"
                type="text"
                placeholder="Ingresa el nombre de la causa legal"
                autoComplete="off"
                error={errors.name}
                onValueChange={handleLegalTerminationCauseNameChange}
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
                placeholder="Ingresa la descripción de la causa legal"
                autoComplete="off"
                rows={5}
                className="r-md min-h-28 w-full resize-y border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--accent-400)] focus:ring-2 focus:ring-[color:var(--accent-400)]/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
                onChange={(event) => handleLegalTerminationCauseDescriptionChange(event.target.value)}
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
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)}
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
