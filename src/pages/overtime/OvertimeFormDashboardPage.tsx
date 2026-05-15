import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_OVERTIME } from '@/constant'
import { initialOvertimeForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateOvertimePayload, mapperOvertimeDetailToForm, mapperUpdateOvertimePayload } from '@/mappers'
import { useStoreAttendanceSelects, useStoreOvertime } from '@/store'
import type { OvertimeCreatePayload, OvertimeUpdatePayload } from '@/types'
import { overtimeCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: OvertimeCreatePayload }
  | { mode: 'update', payload: OvertimeUpdatePayload }
  | null

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

function normalizeTimeInput(value: string): string {
  const normalized = value.trim()
  if (!normalized) return ''

  const hourOnlyMatch = normalized.match(/^(\d{1,2})$/)
  if (hourOnlyMatch) {
    const hour = Number(hourOnlyMatch[1])
    return hour >= 0 && hour <= 23 ? `${String(hour).padStart(2, '0')}:00` : normalized
  }

  const compactMatch = normalized.match(/^(\d{1,2})(\d{2})$/)
  if (compactMatch) {
    const hour = Number(compactMatch[1])
    const minute = Number(compactMatch[2])
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
    return normalized
  }

  const timeMatch = normalized.match(/^(\d{1,2}):(\d{1,2})$/)
  if (timeMatch) {
    const hour = Number(timeMatch[1])
    const minute = Number(timeMatch[2])
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }

  return normalized
}

export default function OvertimeFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editOvertimeId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editOvertimeId) && editOvertimeId > 0

  const [form, setForm] = useState({ ...initialOvertimeForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const overtimeDetail = useStoreOvertime((s) => s.overtimeDetail)
  const overtimeTypes = useStoreOvertime((s) => s.overtimeTypes)
  const loadingOvertimeDetail = useStoreOvertime((s) => s.operationLoading.detail)
  const loadingOvertimeTypes = useStoreOvertime((s) => s.loadingOvertimeTypes)
  const createOvertimeSubmitting = useStoreOvertime((s) => s.operationLoading.create)
  const updateOvertimeSubmitting = useStoreOvertime((s) => s.operationLoading.update)
  const detailError = useStoreOvertime((s) => s.operationStatus.detail.error)
  const createStatus = useStoreOvertime((s) => s.operationStatus.create)
  const updateStatus = useStoreOvertime((s) => s.operationStatus.update)
  const getOvertimeDetail = useStoreOvertime((s) => s.getOvertimeDetail)
  const clearOvertimeDetail = useStoreOvertime((s) => s.clearOvertimeDetail)
  const getOvertimeTypes = useStoreOvertime((s) => s.getOvertimeTypes)
  const clearOperationStatus = useStoreOvertime((s) => s.clearOperationStatus)
  const createOvertime = useStoreOvertime((s) => s.createOvertime)
  const updateOvertime = useStoreOvertime((s) => s.updateOvertime)

  const attendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptions)
  const loadingAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceEmployeeOptions)
  const attendanceEmployeeOptionsErrorMessage = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptionsErrorMessage)
  const getAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.getAttendanceEmployeeOptions)
  const clearAttendanceEmployeeOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceEmployeeOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, overtimeCreateValidationRules)

  const saving = createOvertimeSubmitting || updateOvertimeSubmitting
  const headerTitle = isEditMode ? 'Editar hora extra' : 'Crear hora extra'
  const headerDescription = isEditMode
    ? 'Actualiza el tipo, horario y motivo. La modificación quedará pendiente de aprobación.'
    : 'Registra un bloque de horas extras para revisión y aprobación.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear hora extra'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando hora extra...'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingOvertimeTypes && !loadingAttendanceEmployeeOptions && !(isEditMode && loadingOvertimeDetail)

  const employeeSelectOptions = useMemo(
    () => attendanceEmployeeOptions.map((opt) => ({ label: opt.name, value: String(opt.id) })),
    [attendanceEmployeeOptions],
  )
  const overtimeTypeSelectOptions = useMemo(
    () => overtimeTypes.map((opt) => ({
      label: opt.surchargePercent != null ? `${opt.name} · ${opt.surchargePercent}%` : opt.name,
      value: String(opt.id),
    })),
    [overtimeTypes],
  )
  const editEmployeeLabel = overtimeDetail?.employeeName || employeeSelectOptions.find((option) => option.value === form.employeeId)?.label || 'Trabajador'

  useEffect(() => {
    void getOvertimeTypes()
    void getAttendanceEmployeeOptions()
  }, [getOvertimeTypes, getAttendanceEmployeeOptions])

  useEffect(() => {
    if (!isEditMode) return
    let cancelled = false

    const load = async () => {
      const detail = await getOvertimeDetail(String(editOvertimeId))
      if (cancelled || !detail) return
      setForm(mapperOvertimeDetailToForm(detail))
    }

    void load()
    return () => { cancelled = true }
  }, [editOvertimeId, getOvertimeDetail, isEditMode])

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearOvertimeDetail()
      clearAttendanceEmployeeOptionsStatus()
    }
  }, [clearOperationStatus, clearOvertimeDetail, clearAttendanceEmployeeOptionsStatus])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialOvertimeForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleNormalizeTime = (field: 'startTime' | 'endTime') => {
    setForm((prev) => ({ ...prev, [field]: normalizeTimeInput(prev[field]) }))
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      const payload = mapperUpdateOvertimePayload(editOvertimeId, form)
      setPendingAction({ mode: 'update', payload })
    } else {
      const payload = mapperCreateOvertimePayload(form)
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
      ? await createOvertime(pendingAction.payload)
      : await updateOvertime(pendingAction.payload)
    if (success) {
      navigate(AUTH_ROUTE_OVERTIME)
      return
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? '¿Deseas enviar la modificación de esta hora extra?'
    : '¿Deseas crear esta hora extra?'
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editOvertimeId}` : 'OT-NEW'
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')

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

      {attendanceEmployeeOptionsErrorMessage && (
        <AlertMessageComponent message={attendanceEmployeeOptionsErrorMessage} tone="error" onClose={clearAttendanceEmployeeOptionsStatus} />
      )}
      {detailError && (
        <AlertMessageComponent message={detailError} tone="error" onClose={() => clearOperationStatus('detail')} />
      )}
      {submitErrorMessage && (
        <AlertMessageComponent message={submitErrorMessage} tone="error" onClose={clearSubmitStatus} />
      )}
      {submitSuccessMessage && (
        <AlertMessageComponent message={submitSuccessMessage} tone="success" onClose={clearSubmitStatus} />
      )}

      <form className="space-y-10" onSubmit={handleSubmit}>
        {isEditMode && loadingOvertimeDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando hora extra...</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Trabajador y tipo" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Relación laboral" />
            <div className="grid gap-4 md:grid-cols-2">
              {isEditMode ? (
                <InputComponent value={editEmployeeLabel} label="Trabajador" disabled />
              ) : (
                <SelectComponent
                  value={form.employeeId}
                  label="Trabajador"
                  options={employeeSelectOptions}
                  loading={loadingAttendanceEmployeeOptions}
                  error={errors.employeeId}
                  onValueChange={handleChangeField('employeeId')}
                  onValidation={onValidation('employeeId')}
                  required
                />
              )}
              <SelectComponent
                value={form.overtimeTypeId}
                label="Tipo de hora extra"
                options={overtimeTypeSelectOptions}
                loading={loadingOvertimeTypes}
                error={errors.overtimeTypeId}
                onValueChange={handleChangeField('overtimeTypeId')}
                onValidation={onValidation('overtimeTypeId')}
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="02" title="Bloque horario" />

          <div className="space-y-3">
            <SubSectionLabel number="02.1" title="Fecha y horas" />
            <div className="grid gap-4 md:grid-cols-3">
              <DatePickerComponent
                value={form.date}
                label="Fecha"
                error={errors.date}
                onValueChange={handleChangeField('date')}
                onValidation={onValidation('date')}
                disabled={isEditMode}
                required
              />
              <InputComponent
                value={form.startTime}
                label="Inicio"
                type="text"
                inputMode="numeric"
                placeholder="19 o 19:30"
                maxLength={5}
                error={errors.startTime}
                onValueChange={handleChangeField('startTime')}
                onBlur={() => {
                  handleNormalizeTime('startTime')
                  onValidation('startTime')()
                }}
                required
              />
              <InputComponent
                value={form.endTime}
                label="Término"
                type="text"
                inputMode="numeric"
                placeholder="21 o 21:00"
                maxLength={5}
                error={errors.endTime}
                onValueChange={handleChangeField('endTime')}
                onBlur={() => {
                  handleNormalizeTime('endTime')
                  onValidation('endTime')()
                }}
                required
              />
            </div>
            <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Puedes escribir solo la hora, por ejemplo 8 o 20. El sistema la normaliza a formato 24 horas.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="03" title="Motivo" />
          <div className="space-y-3">
            <SubSectionLabel number="03.1" title="Justificación" />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Motivo<span className="ml-0.5 accent-text">*</span>
              </label>
              <textarea
                value={form.reason}
                placeholder="Ej: Cierre de obra"
                rows={4}
                className={`r-md w-full resize-y border bg-white px-2.5 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                  errors.reason
                    ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-400/30 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-200'
                    : 'border-slate-200 focus:border-[var(--accent-500)] dark:border-white/10'
                }`}
                onChange={(event) => handleChangeField('reason')(event.target.value)}
                onBlur={onValidation('reason')}
              />
              {errors.reason && <p className="num text-[11px] text-rose-500 dark:text-rose-400">{errors.reason}</p>}
            </div>
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
              onClick={() => navigate(AUTH_ROUTE_OVERTIME)}
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
        title={pendingAction?.mode === 'update' ? 'Confirmar actualización de hora extra' : 'Confirmar creación de hora extra'}
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
