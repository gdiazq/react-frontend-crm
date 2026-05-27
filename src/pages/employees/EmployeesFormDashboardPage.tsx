import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  EmployeesFormAddressSectionComponent,
  EmployeesFormContactSectionComponent,
  EmployeesFormEmergencyContactSectionComponent,
  EmployeesFormHealthSectionComponent,
  EmployeesFormPaymentSectionComponent,
  EmployeesFormPersonalSectionComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_EMPLOYEES } from '@/constant'
import { initialCreateEmployeeForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateEmployeePayload, mapperEmployeeDetailToForm, mapperUpdateEmployeePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreEmployeeSelects, useStoreEmployees } from '@/store'
import type { EmployeeCreatePayload, EmployeeSelectOption, EmployeeUpdatePayload } from '@/types'
import { employeesCreateValidationRules } from '@/validators'

type PendingAction =
  | { mode: 'create', payload: EmployeeCreatePayload }
  | { mode: 'update', payload: EmployeeUpdatePayload }
  | null

type HealthTariffUnit = 'uf' | 'pesos' | 'unknown'
type HealthInsuranceKind = 'fonasa' | 'isapre' | 'unknown'

const toSelectOptions = (options: EmployeeSelectOption[]) =>
  options.map((option) => ({ label: option.name, value: String(option.id) }))

function resolveHealthTariffUnit(label: string): HealthTariffUnit {
  const normalized = label.toLowerCase().trim()
  if (normalized.includes('uf') || normalized.includes('u.f')) return 'uf'
  if (normalized.includes('peso') || normalized.includes('clp') || normalized.includes('$')) return 'pesos'
  return 'unknown'
}

function resolveHealthInsuranceKind(label: string): HealthInsuranceKind {
  const normalized = label.toLowerCase().trim()
  if (normalized.includes('fonasa')) return 'fonasa'
  if (normalized.length > 0) return 'isapre'
  return 'unknown'
}

export default function EmployeesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editEmployeeId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editEmployeeId) && editEmployeeId > 0

  const [form, setForm] = useState({ ...initialCreateEmployeeForm })
  const [editMeta, setEditMeta] = useState<{ statusId: number, active: boolean, rehireEligible: boolean } | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingEmployeeDetail = useStoreEmployees((s) => s.operationLoading.detail)
  const detailError = useStoreEmployees((s) => s.operationStatus.detail.error)
  const createEmployeeSubmitting = useStoreEmployees((s) => s.operationLoading.create)
  const updateEmployeeSubmitting = useStoreEmployees((s) => s.operationLoading.update)
  const createStatus = useStoreEmployees((s) => s.operationStatus.create)
  const updateStatus = useStoreEmployees((s) => s.operationStatus.update)
  const getEmployeeDetail = useStoreEmployees((s) => s.getEmployeeDetail)
  const clearEmployeeDetail = useStoreEmployees((s) => s.clearEmployeeDetail)
  const clearOperationStatus = useStoreEmployees((s) => s.clearOperationStatus)
  const createEmployee = useStoreEmployees((s) => s.createEmployee)
  const updateEmployee = useStoreEmployees((s) => s.updateEmployee)

  const identificationTypeOptions = useStoreEmployeeSelects((s) => s.identificationTypeOptions)
  const genderOptions = useStoreEmployeeSelects((s) => s.genderOptions)
  const maritalStatusOptions = useStoreEmployeeSelects((s) => s.maritalStatusOptions)
  const educationLevelOptions = useStoreEmployeeSelects((s) => s.educationLevelOptions)
  const driverLicenseOptions = useStoreEmployeeSelects((s) => s.driverLicenseOptions)
  const professionOptions = useStoreEmployeeSelects((s) => s.professionOptions)
  const nationalityOptions = useStoreEmployeeSelects((s) => s.nationalityOptions)
  const expatOptions = useStoreEmployeeSelects((s) => s.expatOptions)
  const emergencyContactRelationshipOptions = useStoreEmployeeSelects((s) => s.emergencyContactRelationshipOptions)
  const regionOptions = useStoreEmployeeSelects((s) => s.regionOptions)
  const communeOptions = useStoreEmployeeSelects((s) => s.communeOptions)
  const cityOptions = useStoreEmployeeSelects((s) => s.cityOptions)
  const familyAllowanceTierOptions = useStoreEmployeeSelects((s) => s.familyAllowanceTierOptions)
  const retirementStatusOptions = useStoreEmployeeSelects((s) => s.retirementStatusOptions)
  const pensionStatusOptions = useStoreEmployeeSelects((s) => s.pensionStatusOptions)
  const afpOptions = useStoreEmployeeSelects((s) => s.afpOptions)
  const healthInsuranceOptions = useStoreEmployeeSelects((s) => s.healthInsuranceOptions)
  const healthInsuranceTariffOptions = useStoreEmployeeSelects((s) => s.healthInsuranceTariffOptions)
  const paymentMethodOptions = useStoreEmployeeSelects((s) => s.paymentMethodOptions)
  const bankOptions = useStoreEmployeeSelects((s) => s.bankOptions)

  const loadingFormOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)
  const loadingCommuneOptions = useStoreEmployeeSelects((s) => s.loadingCommuneOptions)
  const loadingCityOptions = useStoreEmployeeSelects((s) => s.loadingCityOptions)
  const formOptionsErrorMessage = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const communeOptionsErrorMessage = useStoreEmployeeSelects((s) => s.communeOptionsErrorMessage)
  const cityOptionsErrorMessage = useStoreEmployeeSelects((s) => s.cityOptionsErrorMessage)
  const getFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)
  const getCommuneOptions = useStoreEmployeeSelects((s) => s.getCommuneOptions)
  const getCityOptions = useStoreEmployeeSelects((s) => s.getCityOptions)
  const clearFormOptionsStatus = useStoreEmployeeSelects((s) => s.clearFormOptionsStatus)
  const clearCommuneOptionsStatus = useStoreEmployeeSelects((s) => s.clearCommuneOptionsStatus)
  const clearCityOptionsStatus = useStoreEmployeeSelects((s) => s.clearCityOptionsStatus)
  const resetLocationOptions = useStoreEmployeeSelects((s) => s.resetLocationOptions)

  const { errors, validateAll, onValidation } = useFormValidation(form, employeesCreateValidationRules)

  const saving = createEmployeeSubmitting || updateEmployeeSubmitting
  const headerTitle = isEditMode ? messages.employees.ui.editEmployeeTitle : messages.employees.ui.createEmployeeTitle
  const headerDescription = isEditMode ? messages.employees.ui.editEmployeeDescription : messages.employees.ui.createEmployeeDescription
  const submitLabel = isEditMode ? messages.employees.ui.updateEmployeeSubmit : messages.employees.ui.createEmployeeSubmit
  const submitLoadingLabel = isEditMode ? messages.employees.ui.updateEmployeeSubmitting : messages.employees.ui.createEmployeeSubmitting
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingFormOptions

  const selectIdentificationTypes = toSelectOptions(identificationTypeOptions)
  const selectGenders = toSelectOptions(genderOptions)
  const selectMaritalStatuses = toSelectOptions(maritalStatusOptions)
  const selectEducationLevels = toSelectOptions(educationLevelOptions)
  const selectDriverLicenses = toSelectOptions(driverLicenseOptions)
  const selectProfessions = toSelectOptions(professionOptions)
  const selectNationalities = toSelectOptions(nationalityOptions)
  const selectExpats = toSelectOptions(expatOptions)
  const selectEmergencyRelationships = toSelectOptions(emergencyContactRelationshipOptions)
  const selectRegions = toSelectOptions(regionOptions)
  const selectCommunes = toSelectOptions(communeOptions)
  const selectCities = toSelectOptions(cityOptions)
  const selectFamilyAllowanceTiers = toSelectOptions(familyAllowanceTierOptions)
  const selectRetirementStatuses = toSelectOptions(retirementStatusOptions)
  const selectPensionStatuses = toSelectOptions(pensionStatusOptions)
  const selectAfps = toSelectOptions(afpOptions)
  const selectHealthInsurances = toSelectOptions(healthInsuranceOptions)
  const selectHealthInsuranceTariffs = toSelectOptions(healthInsuranceTariffOptions)
  const selectPaymentMethods = toSelectOptions(paymentMethodOptions)
  const selectBanks = toSelectOptions(bankOptions)
  const selectedHealthInsuranceLabel = selectHealthInsurances.find((option) => option.value === form.healthInsuranceId)?.label ?? ''
  const selectedHealthInsuranceKind = resolveHealthInsuranceKind(selectedHealthInsuranceLabel)
  const showHealthInsuranceIsapreFields = selectedHealthInsuranceKind === 'isapre'
  const selectedTariffLabel = selectHealthInsuranceTariffs.find((option) => option.value === form.healthInsuranceTariffId)?.label ?? ''
  const selectedTariffUnit = resolveHealthTariffUnit(selectedTariffLabel)
  const showHealthInsuranceUFInput = showHealthInsuranceIsapreFields && selectedTariffUnit === 'uf'
  const showHealthInsurancePesosInput = showHealthInsuranceIsapreFields && selectedTariffUnit === 'pesos'

  useEffect(() => {
    void getFormOptions()

    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearEmployeeDetail()
      clearFormOptionsStatus()
      clearCommuneOptionsStatus()
      clearCityOptionsStatus()
      resetLocationOptions()
    }
  }, [
    clearCityOptionsStatus,
    clearCommuneOptionsStatus,
    clearOperationStatus,
    clearEmployeeDetail,
    clearFormOptionsStatus,
    getFormOptions,
    resetLocationOptions,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getEmployeeDetail(String(editEmployeeId))
      if (!detail || cancelled) return

      setForm(mapperEmployeeDetailToForm(detail))
      setEditMeta({
        statusId: detail.status?.id ?? 0,
        active: detail.active,
        rehireEligible: detail.rehireEligible,
      })
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editEmployeeId, getEmployeeDetail, isEditMode])

  useEffect(() => {
    const regionId = Number(form.regionId)
    if (!Number.isInteger(regionId) || regionId <= 0) {
      resetLocationOptions()
      return
    }
    void getCommuneOptions(regionId)
  }, [form.regionId, getCommuneOptions, resetLocationOptions])

  useEffect(() => {
    const communeId = Number(form.communeId)
    if (!Number.isInteger(communeId) || communeId <= 0) {
      return
    }
    void getCityOptions(communeId)
  }, [form.communeId, getCityOptions])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateEmployeeForm, value: string) => {
    setForm((prev) => {
      if (field === 'regionId') {
        return { ...prev, regionId: value, communeId: '', cityId: '' }
      }
      if (field === 'communeId') {
        return { ...prev, communeId: value, cityId: '' }
      }
      if (field === 'healthInsuranceTariffId') {
        const nextTariffLabel = selectHealthInsuranceTariffs.find((option) => option.value === value)?.label ?? ''
        const nextTariffUnit = resolveHealthTariffUnit(nextTariffLabel)
        if (nextTariffUnit === 'uf') {
          return { ...prev, healthInsuranceTariffId: value, healthInsurancePesos: '' }
        }
        if (nextTariffUnit === 'pesos') {
          return { ...prev, healthInsuranceTariffId: value, healthInsuranceUF: '' }
        }
        return { ...prev, healthInsuranceTariffId: value }
      }
      if (field === 'healthInsuranceId') {
        const nextHealthInsuranceLabel = selectHealthInsurances.find((option) => option.value === value)?.label ?? ''
        const nextHealthInsuranceKind = resolveHealthInsuranceKind(nextHealthInsuranceLabel)
        if (nextHealthInsuranceKind === 'fonasa') {
          return {
            ...prev,
            healthInsuranceId: value,
            healthInsuranceTariffId: '',
            isapreFun: '',
            healthInsuranceUF: '',
            healthInsurancePesos: '',
          }
        }
        return { ...prev, healthInsuranceId: value }
      }
      return { ...prev, [field]: value }
    })

    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }
  const handleFieldValueChange = (field: keyof typeof initialCreateEmployeeForm) => (value: string) => {
    handleChangeField(field, value)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    if (isEditMode) {
      if (!editMeta) return
      const payload = mapperUpdateEmployeePayload(editEmployeeId, form, editMeta)
      setPendingAction({ mode: 'update', payload })
    } else {
      const payload = mapperCreateEmployeePayload(form)
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
      ? await createEmployee(pendingAction.payload)
      : await updateEmployee(pendingAction.payload)
    if (success) {
      navigate(AUTH_ROUTE_EMPLOYEES)
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? `¿Deseas guardar los cambios del trabajador ${form.firstName} ${form.paternalLastName}?`
    : `¿Deseas crear al trabajador ${form.firstName} ${form.paternalLastName}?`

  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editEmployeeId}` : 'REG-NEW'
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

      {communeOptionsErrorMessage && (
        <AlertMessageComponent
          message={communeOptionsErrorMessage}
          tone="error"
          onClose={clearCommuneOptionsStatus}
        />
      )}

      {cityOptionsErrorMessage && (
        <AlertMessageComponent
          message={cityOptionsErrorMessage}
          tone="error"
          onClose={clearCityOptionsStatus}
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
        {isEditMode && loadingEmployeeDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del trabajador…</p>
        )}

        <EmployeesFormPersonalSectionComponent
          form={form}
          errors={errors}
          identificationTypeOptions={selectIdentificationTypes}
          genderOptions={selectGenders}
          maritalStatusOptions={selectMaritalStatuses}
          nationalityOptions={selectNationalities}
          educationLevelOptions={selectEducationLevels}
          professionOptions={selectProfessions}
          driverLicenseOptions={selectDriverLicenses}
          expatOptions={selectExpats}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <EmployeesFormContactSectionComponent
          form={form}
          errors={errors}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <EmployeesFormEmergencyContactSectionComponent
          form={form}
          errors={errors}
          emergencyRelationshipOptions={selectEmergencyRelationships}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <EmployeesFormAddressSectionComponent
          form={form}
          errors={errors}
          regionOptions={selectRegions}
          communeOptions={selectCommunes}
          cityOptions={selectCities}
          loadingCommuneOptions={loadingCommuneOptions}
          loadingCityOptions={loadingCityOptions}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <EmployeesFormHealthSectionComponent
          form={form}
          errors={errors}
          familyAllowanceTierOptions={selectFamilyAllowanceTiers}
          retirementStatusOptions={selectRetirementStatuses}
          pensionStatusOptions={selectPensionStatuses}
          afpOptions={selectAfps}
          healthInsuranceOptions={selectHealthInsurances}
          healthInsuranceTariffOptions={selectHealthInsuranceTariffs}
          showHealthInsuranceIsapreFields={showHealthInsuranceIsapreFields}
          showHealthInsuranceUFInput={showHealthInsuranceUFInput}
          showHealthInsurancePesosInput={showHealthInsurancePesosInput}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <EmployeesFormPaymentSectionComponent
          form={form}
          errors={errors}
          paymentMethodOptions={selectPaymentMethods}
          bankOptions={selectBanks}
          onChangeField={handleFieldValueChange}
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
              onClick={() => navigate(AUTH_ROUTE_EMPLOYEES)}
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
        title={isEditMode ? 'Confirmar actualización de trabajador' : 'Confirmar creación de trabajador'}
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
