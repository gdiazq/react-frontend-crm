import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  SaveConfirmComponent,
  TransferFormAttachmentsSectionComponent,
  TransferFormDataSectionComponent,
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
  mapperTransferExistingFiles,
  mapperTransferSelectOptions,
  mapperTransferSelectOptionsWithCurrent,
  mapperUpdateTransferPayload,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreTransfer, useStoreSettlementSelects } from '@/store'
import type {
  TransferDocument,
  TransferFormField,
} from '@/types'
import { mergeUniqueFiles } from '@/utils'
import { transferCreateValidationRules } from '@/validators'

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

  const loadingTransferDetail = useStoreTransfer((s) => s.operationLoading.detail)
  const detailError = useStoreTransfer((s) => s.operationStatus.detail.error)
  const createTransferSubmitting = useStoreTransfer((s) => s.operationLoading.create)
  const updateTransferSubmitting = useStoreTransfer((s) => s.operationLoading.update)
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

  const projectCostCenterOptions = useStoreTransfer((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreTransfer((s) => s.loadingProjectCostCenterOptions)
  const costCenterOptionsErrorMessage = useStoreTransfer((s) => s.projectCostCenterOptionsErrorMessage)
  const getProjectCostCenterOptions = useStoreTransfer((s) => s.getProjectCostCenterOptions)
  const getProjectCostCenterOption = useStoreTransfer((s) => s.getProjectCostCenterOption)
  const clearCostCenterOptionsStatus = useStoreTransfer((s) => s.clearProjectCostCenterOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, transferCreateValidationRules)

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

  const selectEmployees = mapperTransferSelectOptionsWithCurrent(
    mapperTransferSelectOptions(employeeWithContractOptions),
    {
      enabled: isEditMode,
      value: form.employeeId,
      label: editEmployeeLabel,
      fallbackLabel: `Trabajador #${form.employeeId}`,
    },
  )

  const selectCostCenters = mapperTransferSelectOptionsWithCurrent(
    mapperTransferSelectOptions(projectCostCenterOptions),
    {
      enabled: isEditMode,
      value: form.toCostCenter,
      label: editCostCenterLabel,
      fallbackLabel: `Centro #${form.toCostCenter}`,
    },
  )
  const existingFiles = mapperTransferExistingFiles(existingDocuments)

  useEffect(() => {
    void getEmployeeWithContractOptions()
    void getProjectCostCenterOptions()

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
    getProjectCostCenterOptions,
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

  const handleChangeField = (field: TransferFormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleFieldValueChange = (field: TransferFormField) => (value: string) => {
    handleChangeField(field, value)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (transferFiles.length > TRANSFER_FILES_MAX_COUNT) {
      setFilesError(messages.transfer.status.errors.filesMaxCountError)
      return
    }

    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
  }

  const handleConfirmSave = async () => {
    if (saving || !validateAll()) return
    if (transferFiles.length > TRANSFER_FILES_MAX_COUNT) {
      setFilesError(messages.transfer.status.errors.filesMaxCountError)
      return
    }

    const files = [...transferFiles]
    const success = isEditMode
      ? await updateTransfer(mapperUpdateTransferPayload(editTransferId, form), files)
      : await createTransfer(mapperCreateTransferPayload(form), files)

    if (success) {
      navigate(AUTH_ROUTE_TRANSFERS)
      return
    }

    setConfirmOpen(false)
  }

  const handleAddFiles = (incomingFiles: File[]) => {
    const maxNewFiles = Math.max(0, TRANSFER_FILES_MAX_COUNT - existingDocuments.length)
    const result = mergeUniqueFiles({
      currentFiles: transferFiles,
      incomingFiles,
      maxFiles: maxNewFiles,
      maxFileSizeBytes: TRANSFER_FILE_MAX_SIZE_BYTES,
    })

    if (result.exceededMaxFiles) {
      setTransferFiles(result.files)
      setFilesError(messages.transfer.status.errors.filesMaxCountError)
    } else if (result.exceededFileSize) {
      setTransferFiles(result.files)
      setFilesError(messages.transfer.status.errors.filesMaxSizeError)
    } else {
      setTransferFiles(result.files)
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

  const confirmMessage = isEditMode
    ? '¿Deseas guardar los cambios del traspaso?'
    : '¿Deseas crear el traspaso?'
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editTransferId}` : 'TRF-NEW'
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
          {heroTrailing && (
            <span className="display-it text-slate-500 dark:text-slate-400"> {heroTrailing}</span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
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

      <form className="space-y-10" onSubmit={handleSubmit}>
        {isEditMode && loadingTransferDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del traspaso…</p>
        )}

        <TransferFormDataSectionComponent
          form={form}
          errors={errors}
          isEditMode={isEditMode}
          employeeOptions={selectEmployees}
          costCenterOptions={selectCostCenters}
          loadingEmployeeOptions={loadingEmployeeWithContractOptions}
          loadingCostCenterOptions={loadingCostCenterOptions}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <TransferFormAttachmentsSectionComponent
          transferFiles={transferFiles}
          existingFiles={existingFiles}
          filesError={filesError}
          saving={saving}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onRemoveExistingFile={handleRemoveExistingFile}
          onClearFiles={handleClearFiles}
          onClearExistingFiles={handleClearExistingFiles}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
          <p className="num text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            FIN DEL REGISTRO · {new Date().toLocaleDateString('es-CL')}
          </p>
          <div className="flex flex-wrap gap-2">
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
