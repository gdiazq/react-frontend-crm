import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  OvertimeFormEmployeeTypeSectionComponent,
  OvertimeFormReasonSectionComponent,
  OvertimeFormScheduleSectionComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_OVERTIME } from '@/constant'
import { initialOvertimeForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateOvertimePayload,
  mapperOvertimeDetailToForm,
  mapperOvertimeEditEmployeeLabel,
  mapperOvertimeSelectOptions,
  mapperOvertimeTypeSelectOptions,
  mapperUpdateOvertimePayload,
} from '@/mappers'
import { useStoreAttendanceSelects, useStoreOvertime } from '@/store'
import type { OvertimeFormField, OvertimeTimeField } from '@/types'
import { normalizeTimeInput } from '@/utils'
import { overtimeCreateValidationRules } from '@/validators'

export default function OvertimeFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editOvertimeId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editOvertimeId) && editOvertimeId > 0

  const [form, setForm] = useState({ ...initialOvertimeForm })
  const [confirmOpen, setConfirmOpen] = useState(false)

  const overtimeDetail = useStoreOvertime((s) => s.overtimeDetail)
  const overtimeTypes = useStoreOvertime((s) => s.overtimeTypes)
  const loadingOvertimeDetail = useStoreOvertime((s) => s.operationLoading.detail)
  const loadingOvertimeTypes = useStoreOvertime((s) => s.loadingOvertimeTypes)
  const createSubmitting = useStoreOvertime((s) => s.operationLoading.create)
  const updateSubmitting = useStoreOvertime((s) => s.operationLoading.update)
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
  const loadingEmployeeOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceEmployeeOptions)
  const employeeOptionsError = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptionsErrorMessage)
  const getAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.getAttendanceEmployeeOptions)
  const clearEmployeeOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceEmployeeOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, overtimeCreateValidationRules)

  const saving = createSubmitting || updateSubmitting
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingOvertimeTypes && !loadingEmployeeOptions && !(isEditMode && loadingOvertimeDetail)
  const headerTitle = isEditMode ? 'Editar hora extra' : 'Crear hora extra'
  const headerDescription = isEditMode
    ? 'Actualiza el tipo, horario y motivo. La modificación quedará pendiente de aprobación.'
    : 'Registra un bloque de horas extras para revisión y aprobación.'
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear hora extra'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando hora extra...'

  const employeeSelectOptions = mapperOvertimeSelectOptions(attendanceEmployeeOptions)
  const overtimeTypeSelectOptions = mapperOvertimeTypeSelectOptions(overtimeTypes)
  const editEmployeeLabel = mapperOvertimeEditEmployeeLabel(overtimeDetail, employeeSelectOptions, form.employeeId)

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
      clearEmployeeOptionsStatus()
    }
  }, [clearOperationStatus, clearOvertimeDetail, clearEmployeeOptionsStatus])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: OvertimeFormField) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleNormalizeTime = (field: OvertimeTimeField) => {
    setForm((prev) => ({ ...prev, [field]: normalizeTimeInput(prev[field]) }))
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
  }

  const handleConfirmSave = async () => {
    if (saving || !validateAll()) return
    const success = isEditMode
      ? await updateOvertime(mapperUpdateOvertimePayload(editOvertimeId, form))
      : await createOvertime(mapperCreateOvertimePayload(form))
    if (success) {
      navigate(AUTH_ROUTE_OVERTIME)
      return
    }
    setConfirmOpen(false)
  }

  const confirmMessage = isEditMode
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

      {employeeOptionsError && (
        <AlertMessageComponent message={employeeOptionsError} tone="error" onClose={clearEmployeeOptionsStatus} />
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

        <OvertimeFormEmployeeTypeSectionComponent
          form={form}
          errors={errors}
          isEditMode={isEditMode}
          editEmployeeLabel={editEmployeeLabel}
          employeeOptions={employeeSelectOptions}
          overtimeTypeOptions={overtimeTypeSelectOptions}
          loadingEmployees={loadingEmployeeOptions}
          loadingOvertimeTypes={loadingOvertimeTypes}
          onChangeField={handleChangeField}
          onValidation={onValidation}
        />

        <OvertimeFormScheduleSectionComponent
          form={form}
          errors={errors}
          isEditMode={isEditMode}
          onChangeField={handleChangeField}
          onValidation={onValidation}
          onNormalizeTime={handleNormalizeTime}
        />

        <OvertimeFormReasonSectionComponent
          form={form}
          errors={errors}
          onChangeField={handleChangeField}
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
        title={isEditMode ? 'Confirmar actualización de hora extra' : 'Confirmar creación de hora extra'}
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
