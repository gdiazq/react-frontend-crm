import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  ContractsFormAttachmentsSectionComponent,
  ContractsFormBaseSectionComponent,
  ContractsFormConditionsSectionComponent,
  ContractsFormDetailSectionComponent,
  ContractsFormOrganizationSectionComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_CONTRACTS } from '@/constant'
import {
  CONTRACT_FILE_MAX_SIZE_BYTES,
  CONTRACT_FILES_MAX_COUNT,
  initialCreateContractForm,
} from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperContractDetailToForm, mapperCreateContractPayload, mapperUpdateContractPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreContractSelects, useStoreContracts } from '@/store'
import type { ContractCreatePayload, ContractSelectOption, ContractUpdatePayload } from '@/types'
import { contractsCreateValidationRules } from '@/validators'

const toSelectOptions = (options: ContractSelectOption[]) =>
  options.map((option) => ({ label: option.name, value: String(option.id) }))

function isIndefiniteContractType(label: string): boolean {
  return label.trim().toLowerCase().includes('indefinido')
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

type PendingAction =
  | { mode: 'create', payload: ContractCreatePayload, files: File[] }
  | { mode: 'update', payload: ContractUpdatePayload, files: File[] }
  | null

export default function ContractsFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editContractId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editContractId) && editContractId > 0
  const [form, setForm] = useState({ ...initialCreateContractForm })
  const [editEmployeeLabel, setEditEmployeeLabel] = useState('')
  const [contractFiles, setContractFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingContractDetail = useStoreContracts((s) => s.operationLoading.detail)
  const detailError = useStoreContracts((s) => s.operationStatus.detail.error)
  const createContractSubmitting = useStoreContracts((s) => s.operationLoading.create)
  const updateContractSubmitting = useStoreContracts((s) => s.operationLoading.update)
  const createStatus = useStoreContracts((s) => s.operationStatus.create)
  const updateStatus = useStoreContracts((s) => s.operationStatus.update)
  const getContractDetail = useStoreContracts((s) => s.getContractDetail)
  const clearContractDetail = useStoreContracts((s) => s.clearContractDetail)
  const clearOperationStatus = useStoreContracts((s) => s.clearOperationStatus)
  const createContract = useStoreContracts((s) => s.createContract)
  const updateContract = useStoreContracts((s) => s.updateContract)

  const employeeWithoutContractOptions = useStoreContractSelects((s) => s.employeeWithoutContractOptions)
  const contractTypeOptions = useStoreContractSelects((s) => s.contractTypeOptions)
  const safetyGroupOptions = useStoreContractSelects((s) => s.safetyGroupOptions)
  const companyOptions = useStoreContractSelects((s) => s.companyOptions)
  const zoneOptions = useStoreContractSelects((s) => s.zoneOptions)
  const jobTitleOptions = useStoreContractSelects((s) => s.jobTitleOptions)
  const siteOptions = useStoreContractSelects((s) => s.siteOptions)
  const laborUnionOptions = useStoreContractSelects((s) => s.laborUnionOptions)
  const mealTypeOptions = useStoreContractSelects((s) => s.mealTypeOptions)
  const transportTypeOptions = useStoreContractSelects((s) => s.transportTypeOptions)
  const loadingFormOptions = useStoreContractSelects((s) => s.loadingFormOptions)
  const formOptionsErrorMessage = useStoreContractSelects((s) => s.formOptionsErrorMessage)
  const getFormOptions = useStoreContractSelects((s) => s.getFormOptions)
  const clearFormOptionsStatus = useStoreContractSelects((s) => s.clearFormOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, contractsCreateValidationRules)

  const saving = createContractSubmitting || updateContractSubmitting
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear contrato'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando contrato...'
  const headerTitle = isEditMode ? 'Editar contrato' : 'Crear contrato'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del contrato seleccionado.'
    : 'Completa los datos para registrar un nuevo contrato.'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingFormOptions

  const selectEmployeesWithoutContract = toSelectOptions(employeeWithoutContractOptions)
  const shouldIncludeCurrentEmployee = isEditMode
    && form.employeeId.trim().length > 0
    && !selectEmployeesWithoutContract.some((option) => option.value === form.employeeId)
  const selectEmployees = shouldIncludeCurrentEmployee
    ? [{ label: editEmployeeLabel || `Trabajador #${form.employeeId}`, value: form.employeeId }, ...selectEmployeesWithoutContract]
    : selectEmployeesWithoutContract
  const selectContractTypes = toSelectOptions(contractTypeOptions)
  const selectSafetyGroups = toSelectOptions(safetyGroupOptions)
  const selectCompanies = toSelectOptions(companyOptions)
  const selectZones = toSelectOptions(zoneOptions)
  const selectJobTitles = toSelectOptions(jobTitleOptions)
  const selectSites = toSelectOptions(siteOptions)
  const selectLaborUnions = toSelectOptions(laborUnionOptions)
  const selectMealTypes = toSelectOptions(mealTypeOptions)
  const selectTransportTypes = toSelectOptions(transportTypeOptions)
  const selectedContractTypeLabel = selectContractTypes.find((option) => option.value === form.contractTypeId)?.label ?? ''
  const hideEndDate = isIndefiniteContractType(selectedContractTypeLabel)

  useEffect(() => {
    void getFormOptions()

    return () => {
      clearFormOptionsStatus()
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearContractDetail()
    }
  }, [
    clearOperationStatus,
    clearContractDetail,
    clearFormOptionsStatus,
    getFormOptions,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getContractDetail(String(editContractId))
      if (!detail || cancelled) return

      setForm(mapperContractDetailToForm(detail))
      setEditEmployeeLabel((detail.employeeName ?? '').trim())
      setContractFiles([])
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editContractId, getContractDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateContractForm, value: string) => {
    setForm((prev) => {
      if (field === 'contractTypeId') {
        const nextContractTypeLabel = selectContractTypes.find((option) => option.value === value)?.label ?? ''
        const nextHideEndDate = isIndefiniteContractType(nextContractTypeLabel)
        if (nextHideEndDate) {
          return { ...prev, contractTypeId: value, endDate: '' }
        }
      }
      return { ...prev, [field]: value }
    })
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleFieldValueChange = (field: keyof typeof initialCreateContractForm) => (value: string) => {
    handleChangeField(field, value)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (contractFiles.length > CONTRACT_FILES_MAX_COUNT) {
      setFilesError(messages.contracts.status.errors.filesMaxCountError)
      return
    }

    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateContractPayload(editContractId, form), files: [...contractFiles] })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateContractPayload(form), files: [...contractFiles] })
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
      ? await createContract(pendingAction.payload, pendingAction.files)
      : await updateContract(pendingAction.payload, pendingAction.files)
    if (success) {
      navigate(AUTH_ROUTE_CONTRACTS)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleAddFiles = (incomingFiles: File[]) => {
    const maxNewFiles = CONTRACT_FILES_MAX_COUNT

    const nextFiles: File[] = []
    const existingKeys = new Set<string>()
    let hasFileSizeError = false

    contractFiles.forEach((file) => {
      const key = fileKey(file)
      if (!existingKeys.has(key)) {
        existingKeys.add(key)
        nextFiles.push(file)
      }
    })

    incomingFiles.forEach((file) => {
      if (file.size > CONTRACT_FILE_MAX_SIZE_BYTES) {
        hasFileSizeError = true
        return
      }
      const key = fileKey(file)
      if (existingKeys.has(key)) return
      existingKeys.add(key)
      nextFiles.push(file)
    })

    if (nextFiles.length > maxNewFiles) {
      setContractFiles(nextFiles.slice(0, maxNewFiles))
      setFilesError(messages.contracts.status.errors.filesMaxCountError)
    } else if (hasFileSizeError) {
      setContractFiles(nextFiles)
      setFilesError(messages.contracts.status.errors.filesMaxSizeError)
    } else {
      setContractFiles(nextFiles)
      setFilesError(null)
    }

    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveFile = (index: number) => {
    setContractFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearFiles = () => {
    setContractFiles([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del contrato ${form.name}?`
    : `¿Deseas crear el contrato ${form.name}?`
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editContractId}` : 'CTR-NEW'
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

      {formOptionsErrorMessage && (
        <AlertMessageComponent
          message={formOptionsErrorMessage}
          tone="error"
          onClose={clearFormOptionsStatus}
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
        {isEditMode && loadingContractDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del contrato…</p>
        )}

        <ContractsFormBaseSectionComponent
          form={form}
          errors={errors}
          isEditMode={isEditMode}
          employeeOptions={selectEmployees}
          contractTypeOptions={selectContractTypes}
          safetyGroupOptions={selectSafetyGroups}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <ContractsFormConditionsSectionComponent
          form={form}
          errors={errors}
          hideEndDate={hideEndDate}
          mealTypeOptions={selectMealTypes}
          transportTypeOptions={selectTransportTypes}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <ContractsFormOrganizationSectionComponent
          form={form}
          errors={errors}
          companyOptions={selectCompanies}
          zoneOptions={selectZones}
          jobTitleOptions={selectJobTitles}
          siteOptions={selectSites}
          laborUnionOptions={selectLaborUnions}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <ContractsFormDetailSectionComponent form={form} onChangeField={handleFieldValueChange} />

        <ContractsFormAttachmentsSectionComponent
          files={contractFiles}
          filesError={filesError}
          saving={saving}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onClearFiles={handleClearFiles}
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
              onClick={() => navigate(AUTH_ROUTE_CONTRACTS)}
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
        title={isEditMode ? 'Confirmar actualizacion de contrato' : 'Confirmar creacion de contrato'}
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
