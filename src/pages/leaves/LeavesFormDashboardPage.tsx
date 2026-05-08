import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DatePickerComponent,
  DetailSectionHeaderComponent,
  FileDropzoneComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_LEAVES } from '@/constant'
import { initialCreateLeaveForm, LEAVE_FILE_MAX_SIZE_BYTES, LEAVE_FILES_MAX_COUNT } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateLeavePayload, mapperLeaveDetailToForm, mapperUpdateLeavePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreLeaveSelects, useStoreLeaves } from '@/store'
import type { LeaveCreatePayload, LeaveUpdatePayload } from '@/types'
import { leavesCreateValidationRules } from '@/validators'

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

const halfDayOptions = [
  { label: 'No', value: 'false' },
  { label: 'Sí', value: 'true' },
]

type PendingAction =
  | { mode: 'create', payload: LeaveCreatePayload, files: File[] }
  | { mode: 'update', payload: LeaveUpdatePayload, files: File[] }
  | null

export default function LeavesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editLeaveId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editLeaveId) && editLeaveId > 0

  const [form, setForm] = useState({ ...initialCreateLeaveForm })
  const [leaveFiles, setLeaveFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [dateRangeError, setDateRangeError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingLeaveDetail = useStoreLeaves((s) => s.loadingLeaveDetail)
  const detailError = useStoreLeaves((s) => s.operationStatus.detail.error)
  const createLeaveSubmitting = useStoreLeaves((s) => s.createLeaveSubmitting)
  const updateLeaveSubmitting = useStoreLeaves((s) => s.updateLeaveSubmitting)
  const createStatus = useStoreLeaves((s) => s.operationStatus.create)
  const updateStatus = useStoreLeaves((s) => s.operationStatus.update)
  const getLeaveDetail = useStoreLeaves((s) => s.getLeaveDetail)
  const clearLeaveDetail = useStoreLeaves((s) => s.clearLeaveDetail)
  const clearOperationStatus = useStoreLeaves((s) => s.clearOperationStatus)
  const createLeave = useStoreLeaves((s) => s.createLeave)
  const updateLeave = useStoreLeaves((s) => s.updateLeave)

  const employeeWithContractOptions = useStoreLeaveSelects((s) => s.employeeWithContractOptions)
  const leaveTypeOptions = useStoreLeaveSelects((s) => s.leaveTypeOptions)
  const loadingLeaveFormOptions = useStoreLeaveSelects((s) => s.loadingLeaveFormOptions)
  const leaveFormOptionsErrorMessage = useStoreLeaveSelects((s) => s.leaveFormOptionsErrorMessage)
  const getLeaveFormOptions = useStoreLeaveSelects((s) => s.getLeaveFormOptions)
  const clearLeaveFormOptionsStatus = useStoreLeaveSelects((s) => s.clearLeaveFormOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, leavesCreateValidationRules)

  const saving = createLeaveSubmitting || updateLeaveSubmitting
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear permiso'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando permiso...'
  const headerTitle = isEditMode ? 'Editar permiso' : 'Crear permiso'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del permiso seleccionado. El cambio quedará pendiente de revisión si requiere aprobación.'
    : 'Completa los datos para registrar un nuevo permiso de trabajador.'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingLeaveFormOptions
  const employeeWithContractSelectOptions = employeeWithContractOptions.map((opt) => ({ label: opt.name, value: String(opt.id) }))
  const leaveTypeSelectOptions = leaveTypeOptions.map((opt) => ({ label: opt.name, value: String(opt.id) }))

  useEffect(() => {
    void getLeaveFormOptions()
  }, [getLeaveFormOptions])

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearLeaveDetail()
      clearLeaveFormOptionsStatus()
    }
  }, [clearOperationStatus, clearLeaveDetail, clearLeaveFormOptionsStatus])

  useEffect(() => {
    if (!isEditMode) return
    let cancelled = false

    const load = async () => {
      const detail = await getLeaveDetail(String(editLeaveId))
      if (!detail || cancelled) return
      setForm(mapperLeaveDetailToForm(detail))
      setLeaveFiles([])
      setDateRangeError(null)
    }

    void load()
    return () => { cancelled = true }
  }, [editLeaveId, getLeaveDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateLeaveForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setDateRangeError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const validateDateRange = () => {
    if (!form.startDate || !form.endDate) return true
    if (form.endDate >= form.startDate) return true
    setDateRangeError('La fecha fin no puede ser anterior a la fecha inicio.')
    return false
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (!validateDateRange()) return
    if (leaveFiles.length > LEAVE_FILES_MAX_COUNT) {
      setFilesError(messages.leaves.status.errors.filesMaxCountError)
      return
    }

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateLeavePayload(editLeaveId, form), files: [...leaveFiles] })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateLeavePayload(form), files: [...leaveFiles] })
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
      ? await createLeave(pendingAction.payload, pendingAction.files)
      : await updateLeave(pendingAction.payload, pendingAction.files)
    if (success) {
      navigate(AUTH_ROUTE_LEAVES)
      return
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleAddFiles = (incomingFiles: File[]) => {
    const nextFiles: File[] = []
    const existingKeys = new Set<string>()
    let hasFileSizeError = false

    leaveFiles.forEach((file) => {
      const key = fileKey(file)
      if (!existingKeys.has(key)) {
        existingKeys.add(key)
        nextFiles.push(file)
      }
    })

    incomingFiles.forEach((file) => {
      if (file.size > LEAVE_FILE_MAX_SIZE_BYTES) {
        hasFileSizeError = true
        return
      }
      const key = fileKey(file)
      if (existingKeys.has(key)) return
      existingKeys.add(key)
      nextFiles.push(file)
    })

    if (nextFiles.length > LEAVE_FILES_MAX_COUNT) {
      setLeaveFiles(nextFiles.slice(0, LEAVE_FILES_MAX_COUNT))
      setFilesError(messages.leaves.status.errors.filesMaxCountError)
    } else if (hasFileSizeError) {
      setLeaveFiles(nextFiles)
      setFilesError(messages.leaves.status.errors.filesMaxSizeError)
    } else {
      setLeaveFiles(nextFiles)
      setFilesError(null)
    }
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveFile = (index: number) => {
    setLeaveFiles((prev) => prev.filter((_, i) => i !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearFiles = () => {
    setLeaveFiles([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? '¿Deseas guardar los cambios del permiso?'
    : '¿Deseas crear el permiso?'
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editLeaveId}` : 'LEA-NEW'
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

      {leaveFormOptionsErrorMessage && (
        <AlertMessageComponent message={leaveFormOptionsErrorMessage} tone="error" onClose={clearLeaveFormOptionsStatus} />
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
        {isEditMode && loadingLeaveDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del permiso...</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos del permiso" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Relación contractual" />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectComponent
                value={form.employeeId}
                label="Trabajador"
                options={employeeWithContractSelectOptions}
                loading={loadingLeaveFormOptions}
                error={errors.employeeId}
                disabled={isEditMode}
                onValueChange={handleChangeField('employeeId')}
                onValidation={onValidation('employeeId')}
                required
              />
              <SelectComponent
                value={form.leaveTypeId}
                label="Tipo de permiso"
                options={leaveTypeSelectOptions}
                loading={loadingLeaveFormOptions}
                error={errors.leaveTypeId}
                onValueChange={handleChangeField('leaveTypeId')}
                onValidation={onValidation('leaveTypeId')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.2" title="Vigencia" />
            <div className="grid gap-4 md:grid-cols-3">
              <DatePickerComponent
                value={form.startDate}
                label="Inicio"
                error={errors.startDate || dateRangeError}
                onValueChange={handleChangeField('startDate')}
                onValidation={onValidation('startDate')}
                required
              />
              <DatePickerComponent
                value={form.endDate}
                label="Fin"
                error={errors.endDate || dateRangeError}
                onValueChange={handleChangeField('endDate')}
                onValidation={onValidation('endDate')}
                required
              />
              <SelectComponent
                value={form.halfDay}
                label="Medio día"
                options={halfDayOptions}
                error={errors.halfDay}
                onValueChange={handleChangeField('halfDay')}
                onValidation={onValidation('halfDay')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.3" title="Motivo" />
            <InputComponent
              value={form.reason}
              label="Motivo"
              type="text"
              placeholder="Ej: Licencia médica"
              error={errors.reason}
              onValueChange={handleChangeField('reason')}
              onBlur={onValidation('reason')}
              required
            />
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="02" title="Adjuntos" />
          <div className="space-y-3">
            <SubSectionLabel number="02.1" title="Documentos del permiso" />
            <FileDropzoneComponent
              files={leaveFiles}
              error={filesError}
              maxFiles={LEAVE_FILES_MAX_COUNT}
              disabled={saving}
              helperText="Opcional. Máximo 5 archivos y 10 MB por archivo."
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClearFiles={handleClearFiles}
            />
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
              onClick={() => navigate(AUTH_ROUTE_LEAVES)}
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
        title={isEditMode ? 'Confirmar actualización de permiso' : 'Confirmar creación de permiso'}
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
