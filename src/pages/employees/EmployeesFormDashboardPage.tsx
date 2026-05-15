import { useEffect, useState } from 'react'
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

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
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
  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)

  const loadingFormOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)
  const loadingCommuneOptions = useStoreEmployeeSelects((s) => s.loadingCommuneOptions)
  const loadingCityOptions = useStoreEmployeeSelects((s) => s.loadingCityOptions)
  const formOptionsErrorMessage = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const communeOptionsErrorMessage = useStoreEmployeeSelects((s) => s.communeOptionsErrorMessage)
  const cityOptionsErrorMessage = useStoreEmployeeSelects((s) => s.cityOptionsErrorMessage)
  const getFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)
  const getProjectCostCenterOption = useStoreEmployeeSelects((s) => s.getProjectCostCenterOption)
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
  const selectProjectCostCenters = toSelectOptions(projectCostCenterOptions)
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
      if (detail.costCenter != null) {
        void getProjectCostCenterOption(detail.costCenter)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editEmployeeId, getEmployeeDetail, getProjectCostCenterOption, isEditMode])

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

  useEffect(() => {
    if (!showHealthInsuranceIsapreFields) {
      setForm((prev) => {
        if (
          prev.healthInsuranceTariffId === '' &&
          prev.isapreFun === '' &&
          prev.healthInsuranceUF === '' &&
          prev.healthInsurancePesos === ''
        ) {
          return prev
        }
        return {
          ...prev,
          healthInsuranceTariffId: '',
          isapreFun: '',
          healthInsuranceUF: '',
          healthInsurancePesos: '',
        }
      })
    }
  }, [showHealthInsuranceIsapreFields])

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

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos personales" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Identificación y nacimiento" />
            <div className="grid gap-4 md:grid-cols-3">
              <SelectComponent
                value={form.identificationTypeId}
                label="Tipo identificación"
                options={selectIdentificationTypes}
                error={errors.identificationTypeId}
                onValueChange={handleFieldValueChange('identificationTypeId')}
                onValidation={onValidation('identificationTypeId')}
                required
              />
              <InputComponent
                value={form.identification}
                label="Identificación"
                type="text"
                placeholder="Ingresa la identificación"
                error={errors.identification}
                onValueChange={handleFieldValueChange('identification')}
                onBlur={onValidation('identification')}
                required
              />
              <DatePickerComponent
                value={form.birthDate}
                label="Fecha nacimiento"
                error={errors.birthDate}
                onValueChange={handleFieldValueChange('birthDate')}
                onValidation={onValidation('birthDate')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.2" title="Nombre completo" />
            <div className="grid gap-4 md:grid-cols-3">
              <InputComponent
                value={form.firstName}
                label="Nombre"
                type="text"
                placeholder="Ingresa el nombre"
                error={errors.firstName}
                onValueChange={handleFieldValueChange('firstName')}
                onBlur={onValidation('firstName')}
                required
              />
              <InputComponent
                value={form.paternalLastName}
                label="Apellido paterno"
                type="text"
                placeholder="Ingresa el apellido paterno"
                error={errors.paternalLastName}
                onValueChange={handleFieldValueChange('paternalLastName')}
                onBlur={onValidation('paternalLastName')}
                required
              />
              <InputComponent
                value={form.maternalLastName}
                label="Apellido materno"
                type="text"
                placeholder="Ingresa el apellido materno"
                error={errors.maternalLastName}
                onValueChange={handleFieldValueChange('maternalLastName')}
                onBlur={onValidation('maternalLastName')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.3" title="Perfil personal" />
            <div className="grid gap-4 md:grid-cols-3">
              <SelectComponent
                value={form.genderId}
                label="Género"
                options={selectGenders}
                error={errors.genderId}
                onValueChange={handleFieldValueChange('genderId')}
                onValidation={onValidation('genderId')}
                required
              />
              <SelectComponent
                value={form.maritalStatusId}
                label="Estado civil"
                options={selectMaritalStatuses}
                error={errors.maritalStatusId}
                onValueChange={handleFieldValueChange('maritalStatusId')}
                onValidation={onValidation('maritalStatusId')}
                required
              />
              <SelectComponent
                value={form.nationalityId}
                label="Nacionalidad"
                options={selectNationalities}
                error={errors.nationalityId}
                onValueChange={handleFieldValueChange('nationalityId')}
                onValidation={onValidation('nationalityId')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.4" title="Perfil laboral base" />
            <div className="grid gap-4 md:grid-cols-3">
              <SelectComponent
                value={form.costCenter}
                label="Proyecto"
                options={selectProjectCostCenters}
                error={errors.costCenter}
                onValueChange={handleFieldValueChange('costCenter')}
                onValidation={onValidation('costCenter')}
                required
              />
              <SelectComponent
                value={form.educationLevelId}
                label="Nivel educacional"
                options={selectEducationLevels}
                error={errors.educationLevelId}
                onValueChange={handleFieldValueChange('educationLevelId')}
                onValidation={onValidation('educationLevelId')}
                required
              />
              <SelectComponent
                value={form.professionId}
                label="Profesión"
                options={selectProfessions}
                error={errors.professionId}
                onValueChange={handleFieldValueChange('professionId')}
                onValidation={onValidation('professionId')}
                required
              />
              <SelectComponent
                value={form.driverLicenseId}
                label="Licencia conducir"
                options={selectDriverLicenses}
                error={errors.driverLicenseId}
                onValueChange={handleFieldValueChange('driverLicenseId')}
                onValidation={onValidation('driverLicenseId')}
                required
              />
              <SelectComponent
                value={form.expatId}
                label="Expatriado"
                options={selectExpats}
                error={errors.expatId}
                onValueChange={handleFieldValueChange('expatId')}
                onValidation={onValidation('expatId')}
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="02" title="Contacto" />
          <div className="grid gap-4 md:grid-cols-2">
            <InputComponent
              value={form.personalEmail}
              label="Email personal"
              type="email"
              placeholder="Ingresa el email personal"
              error={errors.personalEmail}
              onValueChange={handleFieldValueChange('personalEmail')}
              onBlur={onValidation('personalEmail')}
              required
            />
            <InputComponent
              value={form.phone}
              label="Teléfono"
              type="tel"
              placeholder="Ingresa el teléfono"
              error={errors.phone}
              onValueChange={handleFieldValueChange('phone')}
              onBlur={onValidation('phone')}
              required
            />
            <InputComponent
              value={form.corporateEmail}
              label="Email corporativo"
              type="email"
              placeholder="Ingresa el email corporativo"
              error={errors.corporateEmail}
              onValueChange={handleFieldValueChange('corporateEmail')}
              onBlur={onValidation('corporateEmail')}
              required
            />
            <InputComponent
              value={form.phone2}
              label="Teléfono secundario"
              type="tel"
              placeholder="Ingresa el teléfono secundario"
              onValueChange={handleFieldValueChange('phone2')}
            />
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="03" title="Contacto de emergencia" />
          <div className="grid gap-4 md:grid-cols-2">
            <SelectComponent
              value={form.emergencyContactRelationshipId}
              label="Parentesco"
              options={selectEmergencyRelationships}
              error={errors.emergencyContactRelationshipId}
              onValueChange={handleFieldValueChange('emergencyContactRelationshipId')}
              onValidation={onValidation('emergencyContactRelationshipId')}
              required
            />
            <InputComponent
              value={form.emergencyContactName}
              label="Nombre contacto"
              type="text"
              placeholder="Ingresa el nombre del contacto"
              error={errors.emergencyContactName}
              onValueChange={handleFieldValueChange('emergencyContactName')}
              onBlur={onValidation('emergencyContactName')}
              required
            />
            <InputComponent
              value={form.emergencyContactPhone}
              label="Teléfono emergencia"
              type="tel"
              placeholder="Ingresa el teléfono de emergencia"
              error={errors.emergencyContactPhone}
              onValueChange={handleFieldValueChange('emergencyContactPhone')}
              onBlur={onValidation('emergencyContactPhone')}
              required
            />
            <InputComponent
              value={form.emergencyContactPhone2}
              label="Teléfono emergencia 2"
              type="tel"
              placeholder="Ingresa el teléfono secundario"
              onValueChange={handleFieldValueChange('emergencyContactPhone2')}
            />
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="04" title="Dirección" />
          <div className="grid gap-4 md:grid-cols-3">
            <InputComponent
              value={form.streetName}
              label="Calle"
              type="text"
              placeholder="Ingresa la calle"
              error={errors.streetName}
              onValueChange={handleFieldValueChange('streetName')}
              onBlur={onValidation('streetName')}
              required
            />
            <InputComponent
              value={form.streetNumber}
              label="Número"
              type="text"
              placeholder="Ingresa el número"
              error={errors.streetNumber}
              onValueChange={handleFieldValueChange('streetNumber')}
              onBlur={onValidation('streetNumber')}
              required
            />
            <InputComponent
              value={form.postalCode}
              label="Código postal"
              type="text"
              placeholder="Ingresa el código postal"
              error={errors.postalCode}
              onValueChange={handleFieldValueChange('postalCode')}
              onBlur={onValidation('postalCode')}
              required
            />
            <InputComponent
              value={form.department}
              label="Departamento"
              type="text"
              placeholder="Ingresa el departamento"
              onValueChange={handleFieldValueChange('department')}
            />
            <InputComponent
              value={form.village}
              label="Villa"
              type="text"
              placeholder="Ingresa la villa"
              onValueChange={handleFieldValueChange('village')}
            />
            <InputComponent
              value={form.block}
              label="Block"
              type="text"
              placeholder="Ingresa el block"
              onValueChange={handleFieldValueChange('block')}
            />
            <SelectComponent
              value={form.regionId}
              label="Región"
              options={selectRegions}
              error={errors.regionId}
              onValueChange={handleFieldValueChange('regionId')}
              onValidation={onValidation('regionId')}
              required
            />
            <SelectComponent
              value={form.communeId}
              label="Comuna"
              options={selectCommunes}
              error={errors.communeId}
              disabled={loadingCommuneOptions || !form.regionId}
              onValueChange={handleFieldValueChange('communeId')}
              onValidation={onValidation('communeId')}
              required
            />
            <SelectComponent
              value={form.cityId}
              label="Ciudad"
              options={selectCities}
              error={errors.cityId}
              disabled={loadingCityOptions || !form.communeId}
              onValueChange={handleFieldValueChange('cityId')}
              onValidation={onValidation('cityId')}
              required
            />
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="05" title="Previsión y salud" />
          <div className="grid gap-4 md:grid-cols-3">
            <SelectComponent
              value={form.familyAllowanceTierId}
              label="Tramo carga familiar"
              options={selectFamilyAllowanceTiers}
              error={errors.familyAllowanceTierId}
              onValueChange={handleFieldValueChange('familyAllowanceTierId')}
              onValidation={onValidation('familyAllowanceTierId')}
              required
            />
            <SelectComponent
              value={form.retirementStatusId}
              label="Estado retiro"
              options={selectRetirementStatuses}
              error={errors.retirementStatusId}
              onValueChange={handleFieldValueChange('retirementStatusId')}
              onValidation={onValidation('retirementStatusId')}
              required
            />
            <SelectComponent
              value={form.pensionStatusId}
              label="Estado pensión"
              options={selectPensionStatuses}
              error={errors.pensionStatusId}
              onValueChange={handleFieldValueChange('pensionStatusId')}
              onValidation={onValidation('pensionStatusId')}
              required
            />
            <SelectComponent
              value={form.afpId}
              label="AFP"
              options={selectAfps}
              error={errors.afpId}
              onValueChange={handleFieldValueChange('afpId')}
              onValidation={onValidation('afpId')}
              required
            />
            <SelectComponent
              value={form.healthInsuranceId}
              label="Previsión salud"
              options={selectHealthInsurances}
              error={errors.healthInsuranceId}
              onValueChange={handleFieldValueChange('healthInsuranceId')}
              onValidation={onValidation('healthInsuranceId')}
              required
            />
            {showHealthInsuranceIsapreFields && (
              <SelectComponent
                value={form.healthInsuranceTariffId}
                label="Tarifa salud"
                options={selectHealthInsuranceTariffs}
                onValueChange={handleFieldValueChange('healthInsuranceTariffId')}
              />
            )}
            {showHealthInsuranceIsapreFields && (
              <InputComponent
                value={form.isapreFun}
                label="Isapre FUN"
                type="text"
                placeholder="Ingresa isapre FUN"
                onValueChange={handleFieldValueChange('isapreFun')}
              />
            )}
            {showHealthInsuranceUFInput && (
              <InputComponent
                value={form.healthInsuranceUF}
                label="Salud UF"
                type="number"
                placeholder="Ingresa valor en UF"
                onValueChange={handleFieldValueChange('healthInsuranceUF')}
              />
            )}
            {showHealthInsurancePesosInput && (
              <InputComponent
                value={form.healthInsurancePesos}
                label="Salud Pesos"
                type="number"
                placeholder="Ingresa valor en pesos"
                onValueChange={handleFieldValueChange('healthInsurancePesos')}
              />
            )}
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="06" title="Pago y tallas" />
          <div className="grid gap-4 md:grid-cols-3">
            <SelectComponent
              value={form.paymentMethodId}
              label="Forma pago"
              options={selectPaymentMethods}
              error={errors.paymentMethodId}
              onValueChange={handleFieldValueChange('paymentMethodId')}
              onValidation={onValidation('paymentMethodId')}
              required
            />
            <SelectComponent
              value={form.bankId}
              label="Banco"
              options={selectBanks}
              error={errors.bankId}
              onValueChange={handleFieldValueChange('bankId')}
              onValidation={onValidation('bankId')}
              required
            />
            <InputComponent
              value={form.bankAccount}
              label="Cuenta bancaria"
              type="text"
              placeholder="Ingresa la cuenta bancaria"
              error={errors.bankAccount}
              onValueChange={handleFieldValueChange('bankAccount')}
              onBlur={onValidation('bankAccount')}
              required
            />
            <InputComponent
              value={form.clothingSize}
              label="Talla ropa"
              type="text"
              placeholder="Ingresa talla de ropa"
              error={errors.clothingSize}
              onValueChange={handleFieldValueChange('clothingSize')}
              onBlur={onValidation('clothingSize')}
              required
            />
            <InputComponent
              value={form.shoeSize}
              label="Talla zapato"
              type="text"
              placeholder="Ingresa talla de zapato"
              error={errors.shoeSize}
              onValueChange={handleFieldValueChange('shoeSize')}
              onBlur={onValidation('shoeSize')}
              required
            />
            <InputComponent
              value={form.pantSize}
              label="Talla pantalón"
              type="text"
              placeholder="Ingresa talla de pantalón"
              error={errors.pantSize}
              onValueChange={handleFieldValueChange('pantSize')}
              onBlur={onValidation('pantSize')}
              required
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
