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
import { AUTH_ROUTE_CONTRACTS } from '@/constant'
import { initialCreateContractForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperContractDetailToForm, mapperCreateContractPayload, mapperUpdateContractPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreContractSelects, useStoreContracts } from '@/store'
import type { ContractCreatePayload, ContractDocument, ContractSelectOption, ContractUpdatePayload } from '@/types'
import { contractsCreateValidationRules } from '@/validators'

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</h2>
}

const toSelectOptions = (options: ContractSelectOption[]) =>
  options.map((option) => ({ label: option.name, value: String(option.id) }))

function isIndefiniteContractType(label: string): boolean {
  return label.trim().toLowerCase().includes('indefinido')
}

const CONTRACT_FILES_MAX_COUNT = 5
const CONTRACT_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024

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
  const [existingDocuments, setExistingDocuments] = useState<ContractDocument[]>([])
  const [contractFiles, setContractFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingContractDetail = useStoreContracts((s) => s.loadingContractDetail)
  const detailError = useStoreContracts((s) => s.operationStatus.detail.error)
  const createContractSubmitting = useStoreContracts((s) => s.createContractSubmitting)
  const updateContractSubmitting = useStoreContracts((s) => s.updateContractSubmitting)
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
      setExistingDocuments(detail.documents ?? [])
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
    const maxNewFiles = Math.max(0, CONTRACT_FILES_MAX_COUNT - existingDocuments.length)
    if (maxNewFiles === 0) {
      setFilesError(messages.contracts.status.errors.filesMaxCountError)
      return
    }

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

  const handleRemoveExistingFile = (index: number) => {
    setExistingDocuments((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearExistingFiles = () => {
    setExistingDocuments([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del contrato ${form.name}?`
    : `¿Deseas crear el contrato ${form.name}?`

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
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

      <form
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        {isEditMode && loadingContractDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del contrato...</p>
        )}

        <SectionTitle title="Datos base" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={selectEmployees}
            error={errors.employeeId}
            disabled={isEditMode}
            onValueChange={handleFieldValueChange('employeeId')}
            onValidation={onValidation('employeeId')}
            required
          />

          <InputComponent
            value={form.name}
            label="Nombre contrato"
            type="text"
            placeholder="Ingresa el nombre del contrato"
            error={errors.name}
            onValueChange={handleFieldValueChange('name')}
            onBlur={onValidation('name')}
            required
          />

          <InputComponent
            value={form.contractNumber}
            label="Numero contrato"
            type="text"
            placeholder="Ingresa el numero de contrato"
            error={errors.contractNumber}
            onValueChange={handleFieldValueChange('contractNumber')}
            onBlur={onValidation('contractNumber')}
            required
          />

          <SelectComponent
            value={form.contractTypeId}
            label="Tipo contrato"
            options={selectContractTypes}
            error={errors.contractTypeId}
            onValueChange={handleFieldValueChange('contractTypeId')}
            onValidation={onValidation('contractTypeId')}
            required
          />

          <SelectComponent
            value={form.safetyGroupId}
            label="Agrupacion seguridad"
            options={selectSafetyGroups}
            error={errors.safetyGroupId}
            onValueChange={handleFieldValueChange('safetyGroupId')}
            onValidation={onValidation('safetyGroupId')}
            required
          />
        </div>

        <SectionTitle title="Condiciones contractuales" />
        <div className="grid gap-4 md:grid-cols-3">
          <InputComponent
            value={form.baseSalary}
            label="Sueldo base"
            type="text"
            placeholder="Ingresa el sueldo base"
            error={errors.baseSalary}
            onValueChange={handleFieldValueChange('baseSalary')}
            onBlur={onValidation('baseSalary')}
            required
          />

          <InputComponent
            value={form.agreedSalary}
            label="Sueldo acordado"
            type="text"
            placeholder="Ingresa el sueldo acordado"
            error={errors.agreedSalary}
            onValueChange={handleFieldValueChange('agreedSalary')}
            onBlur={onValidation('agreedSalary')}
            required
          />

          <InputComponent
            value={form.weeklyWorkHours}
            label="Horas semanales"
            type="text"
            placeholder="Ingresa las horas semanales"
            error={errors.weeklyWorkHours}
            onValueChange={handleFieldValueChange('weeklyWorkHours')}
            onBlur={onValidation('weeklyWorkHours')}
            required
          />

          <InputComponent
            value={form.workDays}
            label="Dias de trabajo"
            type="text"
            placeholder="Ingresa los dias de trabajo"
            error={errors.workDays}
            onValueChange={handleFieldValueChange('workDays')}
            onBlur={onValidation('workDays')}
            required
          />

          <InputComponent
            value={form.startDate}
            label="Fecha inicio"
            type="date"
            error={errors.startDate}
            onValueChange={handleFieldValueChange('startDate')}
            onBlur={onValidation('startDate')}
            required
          />

          {!hideEndDate && (
            <InputComponent
              value={form.endDate}
              label="Fecha termino"
              type="date"
              onValueChange={handleFieldValueChange('endDate')}
            />
          )}

          <SelectComponent
            value={form.mealTypeId}
            label="Tipo colacion"
            options={selectMealTypes}
            error={errors.mealTypeId}
            onValueChange={handleFieldValueChange('mealTypeId')}
            onValidation={onValidation('mealTypeId')}
            required
          />

          <SelectComponent
            value={form.transportTypeId}
            label="Tipo movilizacion"
            options={selectTransportTypes}
            error={errors.transportTypeId}
            onValueChange={handleFieldValueChange('transportTypeId')}
            onValidation={onValidation('transportTypeId')}
            required
          />
        </div>

        <SectionTitle title="Organizacion y ubicacion" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.companyId}
            label="Empresa"
            options={selectCompanies}
            error={errors.companyId}
            onValueChange={handleFieldValueChange('companyId')}
            onValidation={onValidation('companyId')}
            required
          />

          <SelectComponent
            value={form.zoneId}
            label="Zona"
            options={selectZones}
            error={errors.zoneId}
            onValueChange={handleFieldValueChange('zoneId')}
            onValidation={onValidation('zoneId')}
            required
          />

          <SelectComponent
            value={form.jobTitleId}
            label="Cargo"
            options={selectJobTitles}
            error={errors.jobTitleId}
            onValueChange={handleFieldValueChange('jobTitleId')}
            onValidation={onValidation('jobTitleId')}
            required
          />

          <SelectComponent
            value={form.siteId}
            label="Sede"
            options={selectSites}
            error={errors.siteId}
            onValueChange={handleFieldValueChange('siteId')}
            onValidation={onValidation('siteId')}
            required
          />

          <SelectComponent
            value={form.laborUnionId}
            label="Sindicato"
            options={selectLaborUnions}
            error={errors.laborUnionId}
            onValueChange={handleFieldValueChange('laborUnionId')}
            onValidation={onValidation('laborUnionId')}
            required
          />
        </div>

        <SectionTitle title="Detalle" />
        <InputComponent
          value={form.contractDetail}
          label="Detalle del contrato"
          type="text"
          placeholder="Ingresa el detalle del contrato"
          onValueChange={handleFieldValueChange('contractDetail')}
        />

        <SectionTitle title="Adjuntos" />
        <FileDropzoneComponent
          files={contractFiles}
          existingFiles={existingDocuments}
          error={filesError}
          maxFiles={CONTRACT_FILES_MAX_COUNT}
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
