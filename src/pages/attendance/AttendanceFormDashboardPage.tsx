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
import { AttendanceMarkType, AUTH_ROUTE_ATTENDANCE } from '@/constant'
import { initialAttendanceMarkForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperAttendanceMarkToForm,
  mapperCreateAttendanceMarkPayload,
  mapperUpdateAttendanceMarkPayload,
} from '@/mappers'
import { useStoreAttendance, useStoreAttendanceSelects, useStoreEmployeeSelects } from '@/store'
import type { AttendanceMarkCreatePayload, AttendanceMarkUpdatePayload } from '@/types'
import {
  attendanceMarkCreateValidationRules,
} from '@/validators'

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

type PendingAction =
  | { mode: 'create', payload: AttendanceMarkCreatePayload }
  | { mode: 'update', payload: AttendanceMarkUpdatePayload }
  | null

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

export default function AttendanceFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editAttendanceId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editAttendanceId) && editAttendanceId > 0

  const [form, setForm] = useState({ ...initialAttendanceMarkForm })
  const [editingMarkId, setEditingMarkId] = useState<number | null>(null)
  const [editingAttendanceId, setEditingAttendanceId] = useState<number | null>(null)
  const [editCostCenterLabel, setEditCostCenterLabel] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const attendanceMarks = useStoreAttendance((s) => s.attendanceMarks)
  const loadingAttendanceMarks = useStoreAttendance((s) => s.loadingAttendanceMarks)
  const detailError = useStoreAttendance((s) => s.operationStatus.detail.error)
  const createMarkSubmitting = useStoreAttendance((s) => s.createAttendanceMarkSubmitting)
  const updateMarkSubmitting = useStoreAttendance((s) => s.updateAttendanceMarkSubmitting)
  const createStatus = useStoreAttendance((s) => s.operationStatus.create)
  const updateStatus = useStoreAttendance((s) => s.operationStatus.update)
  const getAttendanceMarksByAttendance = useStoreAttendance((s) => s.getAttendanceMarksByAttendance)
  const clearAttendanceMarks = useStoreAttendance((s) => s.clearAttendanceMarks)
  const clearOperationStatus = useStoreAttendance((s) => s.clearOperationStatus)
  const createAttendanceMark = useStoreAttendance((s) => s.createAttendanceMark)
  const updateAttendanceMark = useStoreAttendance((s) => s.updateAttendanceMark)

  const attendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptions)
  const attendanceStatusOptions = useStoreAttendanceSelects((s) => s.attendanceStatusOptions)
  const attendanceMarkTypeOptions = useStoreAttendanceSelects((s) => s.attendanceMarkTypeOptions)
  const loadingAttendanceFormOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceFormOptions)
  const loadingAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceEmployeeOptions)
  const loadingAttendanceMarkTypeOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceMarkTypeOptions)
  const attendanceFormOptionsErrorMessage = useStoreAttendanceSelects((s) => s.attendanceFormOptionsErrorMessage)
  const attendanceEmployeeOptionsErrorMessage = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptionsErrorMessage)
  const attendanceMarkTypeOptionsErrorMessage = useStoreAttendanceSelects((s) => s.attendanceMarkTypeOptionsErrorMessage)
  const getAttendanceFormOptions = useStoreAttendanceSelects((s) => s.getAttendanceFormOptions)
  const getAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.getAttendanceEmployeeOptions)
  const getAttendanceMarkTypeOptions = useStoreAttendanceSelects((s) => s.getAttendanceMarkTypeOptions)
  const clearAttendanceFormOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceFormOptionsStatus)
  const clearAttendanceEmployeeOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceEmployeeOptionsStatus)
  const clearAttendanceMarkTypeOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceMarkTypeOptionsStatus)

  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)
  const costCenterOptionsErrorMessage = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const getCostCenterFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)
  const getProjectCostCenterOption = useStoreEmployeeSelects((s) => s.getProjectCostCenterOption)
  const clearCostCenterOptionsStatus = useStoreEmployeeSelects((s) => s.clearFormOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, attendanceMarkCreateValidationRules)

  const saving = createMarkSubmitting || updateMarkSubmitting
  const isUpdatingExistingMark = isEditMode && editingMarkId != null
  const submitLabel = isUpdatingExistingMark ? 'Guardar cambios' : 'Crear marca'
  const submitLoadingLabel = isUpdatingExistingMark ? 'Guardando cambios...' : 'Creando marca...'
  const headerTitle = isEditMode ? 'Editar marca' : 'Crear marca'
  const headerDescription = isEditMode
    ? 'Selecciona el tipo de marca para ver y actualizar sus datos.'
    : 'Registra una marca de entrada o salida para un trabajador.'
  const activeStatus = isUpdatingExistingMark ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving
    && !loadingAttendanceFormOptions
    && !loadingAttendanceEmployeeOptions
    && !loadingAttendanceMarkTypeOptions
    && !loadingCostCenterOptions
    && !(isEditMode && loadingAttendanceMarks)

  const markTypeSelectOptions = useMemo(
    () => attendanceMarkTypeOptions.map((opt) => ({ label: opt.name, value: opt.id })),
    [attendanceMarkTypeOptions],
  )
  const employeeSelectOptions = useMemo(
    () => attendanceEmployeeOptions.map((opt) => ({ label: opt.name, value: String(opt.id) })),
    [attendanceEmployeeOptions],
  )
  const attendanceStatusSelectOptions = useMemo(
    () => attendanceStatusOptions.map((opt) => ({ label: opt.name, value: String(opt.id) })),
    [attendanceStatusOptions],
  )
  const costCenterSelectOptions = useMemo(
    () => projectCostCenterOptions.map((opt) => ({ label: opt.name, value: String(opt.id) })),
    [projectCostCenterOptions],
  )

  const selectedAttendanceEmployee = attendanceEmployeeOptions.find((opt) => String(opt.id) === form.employeeId) ?? null
  const selectedEmployeeCostCenter = selectedAttendanceEmployee?.costCenter != null
    ? String(selectedAttendanceEmployee.costCenter)
    : ''
  const selectedEmployeeCostCenterOption = selectedEmployeeCostCenter
    ? costCenterSelectOptions.find((option) => option.value === selectedEmployeeCostCenter)
    : null
  const costCenterSelectOptionsForEmployee = selectedEmployeeCostCenter
    ? [selectedEmployeeCostCenterOption ?? { label: `Centro #${selectedEmployeeCostCenter}`, value: selectedEmployeeCostCenter }]
    : costCenterSelectOptions
  const shouldIncludeCurrentCostCenter = !selectedEmployeeCostCenter
    && isEditMode
    && form.costCenter.trim().length > 0
    && !costCenterSelectOptionsForEmployee.some((option) => option.value === form.costCenter)
  const costCenterSelectOptionsWithCurrent = shouldIncludeCurrentCostCenter
    ? [{ label: editCostCenterLabel || `Centro #${form.costCenter}`, value: form.costCenter }, ...costCenterSelectOptions]
    : costCenterSelectOptionsForEmployee

  const markTimeLabel = form.markType === AttendanceMarkType.CheckOut
    ? 'Salida'
    : form.markType === AttendanceMarkType.CheckIn
      ? 'Entrada'
      : 'Hora de marca'

  useEffect(() => {
    void getAttendanceFormOptions()
    void getAttendanceEmployeeOptions()
    void getAttendanceMarkTypeOptions()
    void getCostCenterFormOptions()
  }, [
    getAttendanceFormOptions,
    getAttendanceEmployeeOptions,
    getAttendanceMarkTypeOptions,
    getCostCenterFormOptions,
  ])

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearAttendanceMarks()
      clearAttendanceFormOptionsStatus()
      clearAttendanceEmployeeOptionsStatus()
      clearAttendanceMarkTypeOptionsStatus()
      clearCostCenterOptionsStatus()
    }
  }, [
    clearOperationStatus,
    clearAttendanceMarks,
    clearAttendanceFormOptionsStatus,
    clearAttendanceEmployeeOptionsStatus,
    clearAttendanceMarkTypeOptionsStatus,
    clearCostCenterOptionsStatus,
  ])

  useEffect(() => {
    if (!isEditMode) return
    let cancelled = false

    const load = async () => {
      const marks = await getAttendanceMarksByAttendance(editAttendanceId)
      if (cancelled) return
      if (!marks.length) {
        setEditingAttendanceId(editAttendanceId)
        return
      }
      const firstMark = marks[0]
      setEditingMarkId(firstMark.id)
      setEditingAttendanceId(firstMark.attendanceId ?? editAttendanceId)
      setForm(mapperAttendanceMarkToForm(firstMark))
      if (firstMark.costCenter != null) {
        setEditCostCenterLabel((firstMark.projectName ?? '').trim())
        void getProjectCostCenterOption(firstMark.costCenter)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [editAttendanceId, getAttendanceMarksByAttendance, getProjectCostCenterOption, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialAttendanceMarkForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleChangeMarkType = (value: string) => {
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
    if (!isEditMode) {
      setForm((prev) => ({ ...prev, markType: value }))
      return
    }
    const matching = attendanceMarks.find((mark) => mark.markType === value)
    if (matching) {
      setEditingMarkId(matching.id)
      setEditingAttendanceId(matching.attendanceId ?? editAttendanceId)
      setForm(mapperAttendanceMarkToForm(matching))
      if (matching.costCenter != null) {
        setEditCostCenterLabel((matching.projectName ?? '').trim())
        void getProjectCostCenterOption(matching.costCenter)
      }
      return
    }
    setEditingMarkId(null)
    setForm((prev) => ({ ...prev, markType: value, markTime: '', notes: '' }))
  }

  const handleChangeEmployee = (value: string) => {
    const employee = attendanceEmployeeOptions.find((opt) => String(opt.id) === value)
    const costCenter = employee?.costCenter != null ? String(employee.costCenter) : ''
    setForm((prev) => ({ ...prev, employeeId: value, costCenter }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleNormalizeMarkTime = () => {
    setForm((prev) => ({ ...prev, markTime: normalizeTimeInput(prev.markTime) }))
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    const basePayload = mapperCreateAttendanceMarkPayload(form)

    if (isUpdatingExistingMark && editingMarkId != null) {
      const payload = mapperUpdateAttendanceMarkPayload(editingMarkId, editingAttendanceId, form)
      setPendingAction({ mode: 'update', payload })
    } else {
      const payload: AttendanceMarkCreatePayload = isEditMode && editingAttendanceId != null
        ? { ...basePayload, attendanceId: editingAttendanceId }
        : basePayload
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
      ? await createAttendanceMark(pendingAction.payload)
      : await updateAttendanceMark(pendingAction.payload)
    if (success) {
      navigate(AUTH_ROUTE_ATTENDANCE)
      return
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? '¿Deseas guardar los cambios de la marca?'
    : '¿Deseas crear la marca?'
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editAttendanceId}` : 'MARK-NEW'
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

      {attendanceMarkTypeOptionsErrorMessage && (
        <AlertMessageComponent message={attendanceMarkTypeOptionsErrorMessage} tone="error" onClose={clearAttendanceMarkTypeOptionsStatus} />
      )}
      {attendanceFormOptionsErrorMessage && (
        <AlertMessageComponent message={attendanceFormOptionsErrorMessage} tone="error" onClose={clearAttendanceFormOptionsStatus} />
      )}
      {attendanceEmployeeOptionsErrorMessage && (
        <AlertMessageComponent message={attendanceEmployeeOptionsErrorMessage} tone="error" onClose={clearAttendanceEmployeeOptionsStatus} />
      )}
      {costCenterOptionsErrorMessage && (
        <AlertMessageComponent message={costCenterOptionsErrorMessage} tone="error" onClose={clearCostCenterOptionsStatus} />
      )}
      {isEditMode && detailError && (
        <AlertMessageComponent message={detailError} tone="error" onClose={() => clearOperationStatus('detail')} />
      )}
      {submitErrorMessage && (
        <AlertMessageComponent message={submitErrorMessage} tone="error" onClose={clearSubmitStatus} />
      )}
      {submitSuccessMessage && (
        <AlertMessageComponent message={submitSuccessMessage} tone="success" onClose={clearSubmitStatus} />
      )}

      <form className="space-y-10" onSubmit={handleSubmit}>
        {isEditMode && loadingAttendanceMarks && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando marcas de la asistencia...</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Tipo y trabajador" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Tipo de marca" />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectComponent
                value={form.markType}
                label="Tipo de marca"
                options={markTypeSelectOptions}
                loading={loadingAttendanceMarkTypeOptions}
                error={errors.markType}
                onValueChange={handleChangeMarkType}
                onValidation={onValidation('markType')}
                required
              />
            </div>
            {isEditMode && !loadingAttendanceMarks && form.markType && editingMarkId == null && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                Esta asistencia aún no tiene una marca de este tipo. Se creará una nueva.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.2" title="Relación laboral" />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectComponent
                value={form.employeeId}
                label="Trabajador"
                options={employeeSelectOptions}
                loading={loadingAttendanceEmployeeOptions}
                error={errors.employeeId}
                onValueChange={handleChangeEmployee}
                onValidation={onValidation('employeeId')}
                disabled={!form.markType}
                required
              />
              {!isEditMode && (
                <SelectComponent
                  value={form.statusId}
                  label="Estado de asistencia"
                  options={attendanceStatusSelectOptions}
                  loading={loadingAttendanceFormOptions}
                  onValueChange={handleChangeField('statusId')}
                  disabled={!form.markType}
                />
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="02" title="Marca" />

          <div className="space-y-3">
            <SubSectionLabel number="02.1" title="Jornada" />
            <div className="grid gap-4 md:grid-cols-2">
              <DatePickerComponent
                value={form.date}
                label="Fecha"
                error={errors.date}
                onValueChange={handleChangeField('date')}
                onValidation={onValidation('date')}
                disabled={!form.markType}
                required
              />
              <InputComponent
                value={form.markTime}
                label={markTimeLabel}
                type="text"
                inputMode="numeric"
                placeholder="08 o 08:00"
                maxLength={5}
                error={errors.markTime}
                onValueChange={handleChangeField('markTime')}
                onBlur={() => {
                  handleNormalizeMarkTime()
                  onValidation('markTime')()
                }}
                disabled={!form.markType}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="02.2" title="Proyecto" />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectComponent
                value={form.costCenter}
                label="Centro de costo"
                options={costCenterSelectOptionsWithCurrent}
                loading={loadingCostCenterOptions}
                disabled={!form.markType || Boolean(selectedEmployeeCostCenter)}
                onValueChange={handleChangeField('costCenter')}
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="02.3" title="Notas" />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Notas
              </label>
              <textarea
                value={form.notes}
                placeholder="Ej: Entrada manual"
                rows={4}
                disabled={!form.markType}
                className="r-md w-full resize-y border border-slate-200 bg-white px-2.5 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-400)]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-500"
                onChange={(e) => handleChangeField('notes')(e.target.value)}
              />
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
              onClick={() => navigate(AUTH_ROUTE_ATTENDANCE)}
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
        title={pendingAction?.mode === 'update' ? 'Confirmar actualización de marca' : 'Confirmar creación de marca'}
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
