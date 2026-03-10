import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { mapperCreateContractPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreContractSelects, useStoreContracts } from '@/store'
import type { ContractCreatePayload, ContractSelectOption } from '@/types'
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

export default function ContractsFormDashboardPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...initialCreateContractForm })
  const [contractFiles, setContractFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<ContractCreatePayload | null>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  const createContractSubmitting = useStoreContracts((s) => s.createContractSubmitting)
  const createContractErrorMessage = useStoreContracts((s) => s.createContractErrorMessage)
  const createContractSuccessMessage = useStoreContracts((s) => s.createContractSuccessMessage)
  const mutationCreateContract = useStoreContracts((s) => s.mutationCreateContract)
  const clearCreateContractStatus = useStoreContracts((s) => s.clearCreateContractStatus)

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

  const saving = createContractSubmitting
  const submitLabel = 'Crear contrato'
  const submitLoadingLabel = 'Creando contrato...'
  const canSubmit = !saving && !loadingFormOptions

  const selectEmployeesWithoutContract = toSelectOptions(employeeWithoutContractOptions)
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
      clearCreateContractStatus()
    }
  }, [clearCreateContractStatus, clearFormOptionsStatus, getFormOptions])

  const clearSubmitStatus = () => {
    clearCreateContractStatus()
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
    if (createContractErrorMessage || createContractSuccessMessage) clearSubmitStatus()
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
    setPendingPayload(mapperCreateContractPayload(form))
    setPendingFiles([...contractFiles])
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
    setPendingPayload(null)
    setPendingFiles([])
  }

  const handleConfirmSave = async () => {
    if (!pendingPayload || saving) return

    const success = await mutationCreateContract(pendingPayload, pendingFiles)
    if (success) {
      navigate(AUTH_ROUTE_CONTRACTS)
    }

    setConfirmOpen(false)
    setPendingPayload(null)
    setPendingFiles([])
  }

  const handleAddFiles = (incomingFiles: File[]) => {
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

    if (nextFiles.length > CONTRACT_FILES_MAX_COUNT) {
      setContractFiles(nextFiles.slice(0, CONTRACT_FILES_MAX_COUNT))
      setFilesError(messages.contracts.status.errors.filesMaxCountError)
    } else if (hasFileSizeError) {
      setContractFiles(nextFiles)
      setFilesError(messages.contracts.status.errors.filesMaxSizeError)
    } else {
      setContractFiles(nextFiles)
      setFilesError(null)
    }

    if (createContractErrorMessage || createContractSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveFile = (index: number) => {
    setContractFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
    setFilesError(null)
    if (createContractErrorMessage || createContractSuccessMessage) clearSubmitStatus()
  }

  const handleClearFiles = () => {
    setContractFiles([])
    setFilesError(null)
    if (createContractErrorMessage || createContractSuccessMessage) clearSubmitStatus()
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Crear contrato</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Completa los datos para registrar un nuevo contrato.
        </p>
      </header>

      {formOptionsErrorMessage && (
        <AlertMessageComponent
          message={formOptionsErrorMessage}
          tone="error"
          onClose={clearFormOptionsStatus}
        />
      )}

      {createContractErrorMessage && (
        <AlertMessageComponent
          message={createContractErrorMessage}
          tone="error"
          onClose={clearSubmitStatus}
        />
      )}

      {createContractSuccessMessage && (
        <AlertMessageComponent
          message={createContractSuccessMessage}
          tone="success"
          onClose={clearSubmitStatus}
        />
      )}

      <form
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        <SectionTitle title="Datos base" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={selectEmployeesWithoutContract}
            error={errors.employeeId}
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
          error={filesError}
          maxFiles={CONTRACT_FILES_MAX_COUNT}
          disabled={saving}
          helperText="Opcional. Maximo 5 archivos y 10 MB por archivo."
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onClearFiles={handleClearFiles}
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
        title="Confirmar creacion de contrato"
        message={`¿Deseas crear el contrato ${form.name}?`}
        confirmLabel={submitLabel}
        cancelLabel="Cancelar"
        loading={saving}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmSave() }}
      />
    </section>
  )
}
