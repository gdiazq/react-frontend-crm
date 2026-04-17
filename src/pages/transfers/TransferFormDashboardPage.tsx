import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  FileDropzoneComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_TRANSFERS } from '@/constant'
import {
  initialCreateTransferForm,
  TRANSFER_FILES_MAX_COUNT,
  TRANSFER_FILE_MAX_SIZE_BYTES,
} from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperTransferDetailToForm,
  mapperCreateTransferPayload,
  mapperUpdateTransferPayload,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreTransfer, useStoreSettlementSelects, useStoreEmployeeSelects } from '@/store'
import type {
  TransferCreatePayload,
  TransferUpdatePayload,
  TransferDocument,
} from '@/types'
import { transferCreateValidationRules } from '@/validators'

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</h2>
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

type PendingAction =
  | { mode: 'create'; payload: TransferCreatePayload; files: File[] }
  | { mode: 'update'; payload: TransferUpdatePayload; files: File[] }
  | null

export default function TransferFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editTransferId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editTransferId) && editTransferId > 0

  const [form, setForm] = useState({ ...initialCreateTransferForm })
  const [editEmployeeLabel, setEditEmployeeLabel] = useState('')
  const [editCostCenterLabel, setEditCostCenterLabel] = useState('')
  const [existingDocuments, setExistingDocuments] = useState<TransferDocument[]>([])
  const [transferFiles, setTransferFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingTransferDetail = useStoreTransfer((s) => s.loadingTransferDetail)
  const detailError = useStoreTransfer((s) => s.operationStatus.detail.error)
  const createTransferSubmitting = useStoreTransfer((s) => s.createTransferSubmitting)
  const updateTransferSubmitting = useStoreTransfer((s) => s.updateTransferSubmitting)
  const createStatus = useStoreTransfer((s) => s.operationStatus.create)
  const updateStatus = useStoreTransfer((s) => s.operationStatus.update)
  const getTransferDetail = useStoreTransfer((s) => s.getTransferDetail)
  const clearTransferDetail = useStoreTransfer((s) => s.clearTransferDetail)
  const clearOperationStatus = useStoreTransfer((s) => s.clearOperationStatus)
  const createTransfer = useStoreTransfer((s) => s.createTransfer)
  const updateTransfer = useStoreTransfer((s) => s.updateTransfer)

  const employeeWithContractOptions = useStoreSettlementSelects((s) => s.employeeWithContractOptions)
  const loadingEmployeeWithContractOptions = useStoreSettlementSelects((s) => s.loadingEmployeeWithContractOptions)
  const employeeWithContractOptionsErrorMessage = useStoreSettlementSelects((s) => s.employeeWithContractOptionsErrorMessage)
  const getEmployeeWithContractOptions = useStoreSettlementSelects((s) => s.getEmployeeWithContractOptions)
  const clearEmployeeWithContractOptionsStatus = useStoreSettlementSelects((s) => s.clearEmployeeWithContractOptionsStatus)

  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)
  const costCenterOptionsErrorMessage = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const getCostCenterFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)
  const getProjectCostCenterOption = useStoreEmployeeSelects((s) => s.getProjectCostCenterOption)
  const clearCostCenterOptionsStatus = useStoreEmployeeSelects((s) => s.clearFormOptionsStatus)

  const validatableForm = {
    employeeId: form.employeeId,
    toCostCenter: form.toCostCenter,
    effectiveDate: form.effectiveDate,
    reason: form.reason,
  }
  const { errors, validateAll, onValidation } = useFormValidation(validatableForm, transferCreateValidationRules)

  const saving = createTransferSubmitting || updateTransferSubmitting
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear traspaso'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando traspaso...'
  const headerTitle = isEditMode ? 'Editar traspaso' : 'Crear traspaso'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del traspaso seleccionado.'
    : 'Completa los datos para registrar un nuevo traspaso.'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingEmployeeWithContractOptions && !loadingCostCenterOptions

  const selectEmployees = employeeWithContractOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const shouldIncludeCurrentEmployee = isEditMode
    && form.employeeId.trim().length > 0
    && !selectEmployees.some((option) => option.value === form.employeeId)
  const selectEmployeesWithCurrent = shouldIncludeCurrentEmployee
    ? [{ label: editEmployeeLabel || `Trabajador #${form.employeeId}`, value: form.employeeId }, ...selectEmployees]
    : selectEmployees

  const selectCostCenters = projectCostCenterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const shouldIncludeCurrentCostCenter = isEditMode
    && form.toCostCenter.trim().length > 0
    && !selectCostCenters.some((option) => option.value === form.toCostCenter)
  const selectCostCentersWithCurrent = shouldIncludeCurrentCostCenter
    ? [{ label: editCostCenterLabel || `Centro #${form.toCostCenter}`, value: form.toCostCenter }, ...selectCostCenters]
    : selectCostCenters

  useEffect(() => {
    void getEmployeeWithContractOptions()
    void getCostCenterFormOptions()

    return () => {
      clearEmployeeWithContractOptionsStatus()
      clearCostCenterOptionsStatus()
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearTransferDetail()
    }
  }, [
    clearEmployeeWithContractOptionsStatus,
    clearCostCenterOptionsStatus,
    clearOperationStatus,
    clearTransferDetail,
    getEmployeeWithContractOptions,
    getCostCenterFormOptions,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getTransferDetail(String(editTransferId))
      if (!detail || cancelled) return

      const mapped = mapperTransferDetailToForm(detail)
      setForm(mapped)
      setEditEmployeeLabel((detail.employeeFullName ?? '').trim())
      setEditCostCenterLabel((detail.toCostCenterName ?? '').trim())
      setExistingDocuments(detail.documents ?? [])
      setTransferFiles([])

      void getProjectCostCenterOption(detail.toCostCenter)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editTransferId, getTransferDetail, getProjectCostCenterOption, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateTransferForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleFieldValueChange = (field: keyof typeof initialCreateTransferForm) => (value: string) => {
    handleChangeField(field, value)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (transferFiles.length > TRANSFER_FILES_MAX_COUNT) {
      setFilesError(messages.transfer.status.errors.filesMaxCountError)
      return
    }

    if (isEditMode) {
      setPendingAction({
        mode: 'update',
        payload: mapperUpdateTransferPayload(editTransferId, form),
        files: [...transferFiles],
      })
    } else {
      setPendingAction({
        mode: 'create',
        payload: mapperCreateTransferPayload(form),
        files: [...transferFiles],
      })
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
      ? await createTransfer(pendingAction.payload, pendingAction.files)
      : await updateTransfer(pendingAction.payload, pendingAction.files)

    if (success) {
      navigate(AUTH_ROUTE_TRANSFERS)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleAddFiles = (incomingFiles: File[]) => {
    const maxNewFiles = Math.max(0, TRANSFER_FILES_MAX_COUNT - existingDocuments.length)
    if (maxNewFiles === 0) {
      setFilesError(messages.transfer.status.errors.filesMaxCountError)
      return
    }

    const nextFiles: File[] = []
    const existingKeys = new Set<string>()
    let hasFileSizeError = false

    transferFiles.forEach((file) => {
      const key = fileKey(file)
      if (!existingKeys.has(key)) {
        existingKeys.add(key)
        nextFiles.push(file)
      }
    })

    incomingFiles.forEach((file) => {
      if (file.size > TRANSFER_FILE_MAX_SIZE_BYTES) {
        hasFileSizeError = true
        return
      }
      const key = fileKey(file)
      if (existingKeys.has(key)) return
      existingKeys.add(key)
      nextFiles.push(file)
    })

    if (nextFiles.length > maxNewFiles) {
      setTransferFiles(nextFiles.slice(0, maxNewFiles))
      setFilesError(messages.transfer.status.errors.filesMaxCountError)
    } else if (hasFileSizeError) {
      setTransferFiles(nextFiles)
      setFilesError(messages.transfer.status.errors.filesMaxSizeError)
    } else {
      setTransferFiles(nextFiles)
      setFilesError(null)
    }

    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveFile = (index: number) => {
    setTransferFiles((prev) => prev.filter((_, i) => i !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearFiles = () => {
    setTransferFiles([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveExistingFile = (index: number) => {
    setExistingDocuments((prev) => prev.filter((_, i) => i !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearExistingFiles = () => {
    setExistingDocuments([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? '¿Deseas guardar los cambios del traspaso?'
    : '¿Deseas crear el traspaso?'

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {headerDescription}
        </p>
      </header>

      {employeeWithContractOptionsErrorMessage && (
        <AlertMessageComponent
          message={employeeWithContractOptionsErrorMessage}
          tone="error"
          onClose={clearEmployeeWithContractOptionsStatus}
        />
      )}

      {costCenterOptionsErrorMessage && (
        <AlertMessageComponent
          message={costCenterOptionsErrorMessage}
          tone="error"
          onClose={clearCostCenterOptionsStatus}
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
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        {isEditMode && loadingTransferDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del traspaso...</p>
        )}

        <SectionTitle title="Datos del trabajador" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={selectEmployeesWithCurrent}
            error={errors.employeeId}
            disabled={isEditMode}
            loading={loadingEmployeeWithContractOptions}
            onValueChange={handleFieldValueChange('employeeId')}
            onValidation={onValidation('employeeId')}
            required
          />

          <SelectComponent
            value={form.toCostCenter}
            label="Centro de costo destino"
            options={selectCostCentersWithCurrent}
            error={errors.toCostCenter}
            loading={loadingCostCenterOptions}
            onValueChange={handleFieldValueChange('toCostCenter')}
            onValidation={onValidation('toCostCenter')}
            required
          />

          <InputComponent
            value={form.effectiveDate}
            label="Fecha efectiva"
            type="date"
            error={errors.effectiveDate}
            onValueChange={handleFieldValueChange('effectiveDate')}
            onBlur={onValidation('effectiveDate')}
            required
          />
        </div>

        <SectionTitle title="Motivo del traspaso" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Motivo <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.reason}
            placeholder="Ingresa el motivo del traspaso"
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            onChange={(e) => handleFieldValueChange('reason')(e.target.value)}
            onBlur={onValidation('reason')}
          />
          {errors.reason && (
            <p className="text-xs text-red-500">{errors.reason}</p>
          )}
        </div>

        <SectionTitle title="Documentos" />
        <FileDropzoneComponent
          files={transferFiles}
          existingFiles={existingDocuments.map((doc) => ({ id: doc.id, fileName: doc.fileName, size: 0, url: doc.url }))}
          error={filesError}
          maxFiles={TRANSFER_FILES_MAX_COUNT}
          disabled={saving}
          helperText="Opcional. Maximo 5 archivos y 10 MB por archivo."
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onRemoveExistingFile={handleRemoveExistingFile}
          onClearFiles={handleClearFiles}
          onClearExistingFiles={handleClearExistingFiles}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            label="Volver"
            disabled={saving}
            onClick={() => navigate(AUTH_ROUTE_TRANSFERS)}
          />
          <ButtonComponent
            type="submit"
            variant="primary"
            label={saving ? submitLoadingLabel : submitLabel}
            disabled={!canSubmit}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de traspaso' : 'Confirmar creacion de traspaso'}
        message={confirmMessage}
        confirmLabel={submitLabel}
        cancelLabel="Cancelar"
        loading={saving}
        onConfirm={() => { void handleConfirmSave() }}
        onClose={handleCloseConfirm}
      />
    </section>
  )
}
