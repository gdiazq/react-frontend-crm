import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_EMPLOYEES } from '@/constant'
import { initialCreateEmployeeForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateEmployeePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreEmployeeSelects, useStoreEmployees } from '@/store'
import type { EmployeeCreatePayload, EmployeeSelectOption } from '@/types'
import { employeesCreateValidationRules } from '@/validators'

type PendingAction = { payload: EmployeeCreatePayload } | null

const toSelectOptions = (options: EmployeeSelectOption[]) =>
  options.map((option) => ({ label: option.name, value: String(option.id) }))

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</h2>
}

export default function EmployeesFormDashboardPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...initialCreateEmployeeForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const createEmployeeSubmitting = useStoreEmployees((s) => s.createEmployeeSubmitting)
  const createEmployeeErrorMessage = useStoreEmployees((s) => s.createEmployeeErrorMessage)
  const createEmployeeSuccessMessage = useStoreEmployees((s) => s.createEmployeeSuccessMessage)
  const mutationCreateEmployee = useStoreEmployees((s) => s.mutationCreateEmployee)
  const clearCreateEmployeeStatus = useStoreEmployees((s) => s.clearCreateEmployeeStatus)

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

  const saving = createEmployeeSubmitting
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

  useEffect(() => {
    void getFormOptions()

    return () => {
      clearCreateEmployeeStatus()
      clearFormOptionsStatus()
      clearCommuneOptionsStatus()
      clearCityOptionsStatus()
      resetLocationOptions()
    }
  }, [
    clearCityOptionsStatus,
    clearCommuneOptionsStatus,
    clearCreateEmployeeStatus,
    clearFormOptionsStatus,
    getFormOptions,
    resetLocationOptions,
  ])

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
    clearCreateEmployeeStatus()
  }

  const handleChangeField = (field: keyof typeof initialCreateEmployeeForm, value: string) => {
    setForm((prev) => {
      if (field === 'regionId') {
        return { ...prev, regionId: value, communeId: '', cityId: '' }
      }
      if (field === 'communeId') {
        return { ...prev, communeId: value, cityId: '' }
      }
      return { ...prev, [field]: value }
    })

    if (createEmployeeErrorMessage || createEmployeeSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    const payload = mapperCreateEmployeePayload(form)
    setPendingAction({ payload })
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleConfirmSave = async () => {
    if (!pendingAction || saving) return
    const success = await mutationCreateEmployee(pendingAction.payload)
    if (success) {
      navigate(AUTH_ROUTE_EMPLOYEES)
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const confirmMessage = `¿Deseas crear al trabajador ${form.firstName} ${form.paternalLastName}?`

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{messages.employees.ui.createEmployeeTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{messages.employees.ui.createEmployeeDescription}</p>
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

      {createEmployeeErrorMessage && (
        <AlertMessageComponent
          message={createEmployeeErrorMessage}
          tone="error"
          onClose={clearSubmitStatus}
        />
      )}

      {createEmployeeSuccessMessage && (
        <AlertMessageComponent
          message={createEmployeeSuccessMessage}
          tone="success"
          onClose={clearSubmitStatus}
        />
      )}

      <form
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        <SectionTitle title="Datos personales" />
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Identificacion y nacimiento</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <SelectComponent value={form.identificationTypeId} label="Tipo identificacion" options={selectIdentificationTypes} error={errors.identificationTypeId} onValueChange={(value) => handleChangeField('identificationTypeId', value)} onValidation={onValidation('identificationTypeId')} required />
            <InputComponent value={form.identification} label="Identificacion" type="text" placeholder="Ingresa la identificacion" error={errors.identification} onValueChange={(value) => handleChangeField('identification', value)} onBlur={onValidation('identification')} required />
            <InputComponent value={form.birthDate} label="Fecha nacimiento" type="date" error={errors.birthDate} onValueChange={(value) => handleChangeField('birthDate', value)} onBlur={onValidation('birthDate')} required />
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre completo</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <InputComponent value={form.firstName} label="Nombre" type="text" placeholder="Ingresa el nombre" error={errors.firstName} onValueChange={(value) => handleChangeField('firstName', value)} onBlur={onValidation('firstName')} required />
            <InputComponent value={form.paternalLastName} label="Apellido paterno" type="text" placeholder="Ingresa el apellido paterno" error={errors.paternalLastName} onValueChange={(value) => handleChangeField('paternalLastName', value)} onBlur={onValidation('paternalLastName')} required />
            <InputComponent value={form.maternalLastName} label="Apellido materno" type="text" placeholder="Ingresa el apellido materno" error={errors.maternalLastName} onValueChange={(value) => handleChangeField('maternalLastName', value)} onBlur={onValidation('maternalLastName')} required />
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Perfil personal</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <SelectComponent value={form.genderId} label="Genero" options={selectGenders} error={errors.genderId} onValueChange={(value) => handleChangeField('genderId', value)} onValidation={onValidation('genderId')} required />
            <SelectComponent value={form.maritalStatusId} label="Estado civil" options={selectMaritalStatuses} error={errors.maritalStatusId} onValueChange={(value) => handleChangeField('maritalStatusId', value)} onValidation={onValidation('maritalStatusId')} required />
            <SelectComponent value={form.nationalityId} label="Nacionalidad" options={selectNationalities} error={errors.nationalityId} onValueChange={(value) => handleChangeField('nationalityId', value)} onValidation={onValidation('nationalityId')} required />
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Perfil laboral base</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <SelectComponent value={form.educationLevelId} label="Nivel educacional" options={selectEducationLevels} error={errors.educationLevelId} onValueChange={(value) => handleChangeField('educationLevelId', value)} onValidation={onValidation('educationLevelId')} required />
            <SelectComponent value={form.professionId} label="Profesion" options={selectProfessions} error={errors.professionId} onValueChange={(value) => handleChangeField('professionId', value)} onValidation={onValidation('professionId')} required />
            <SelectComponent value={form.driverLicenseId} label="Licencia conducir" options={selectDriverLicenses} error={errors.driverLicenseId} onValueChange={(value) => handleChangeField('driverLicenseId', value)} onValidation={onValidation('driverLicenseId')} required />
            <SelectComponent value={form.expatId} label="Expatriado" options={selectExpats} error={errors.expatId} onValueChange={(value) => handleChangeField('expatId', value)} onValidation={onValidation('expatId')} required />
          </div>
        </div>

        <SectionTitle title="Contacto" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent value={form.personalEmail} label="Email personal" type="email" placeholder="Ingresa el email personal" error={errors.personalEmail} onValueChange={(value) => handleChangeField('personalEmail', value)} onBlur={onValidation('personalEmail')} required />
          <InputComponent value={form.phone} label="Telefono" type="tel" placeholder="Ingresa el telefono" error={errors.phone} onValueChange={(value) => handleChangeField('phone', value)} onBlur={onValidation('phone')} required />
          <InputComponent value={form.corporateEmail} label="Email corporativo" type="email" placeholder="Ingresa el email corporativo" error={errors.corporateEmail} onValueChange={(value) => handleChangeField('corporateEmail', value)} onBlur={onValidation('corporateEmail')} required />
          <InputComponent value={form.phone2} label="Telefono" type="tel" placeholder="Ingresa el telefono secundario" onValueChange={(value) => handleChangeField('phone2', value)} />
        </div>

        <SectionTitle title="Contacto de emergencia" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent value={form.emergencyContactRelationshipId} label="Parentesco" options={selectEmergencyRelationships} error={errors.emergencyContactRelationshipId} onValueChange={(value) => handleChangeField('emergencyContactRelationshipId', value)} onValidation={onValidation('emergencyContactRelationshipId')} required />
          <InputComponent value={form.emergencyContactName} label="Nombre contacto emergencia" type="text" placeholder="Ingresa el nombre del contacto" error={errors.emergencyContactName} onValueChange={(value) => handleChangeField('emergencyContactName', value)} onBlur={onValidation('emergencyContactName')} required />
          <InputComponent value={form.emergencyContactPhone} label="Telefono emergencia" type="tel" placeholder="Ingresa el telefono de emergencia" error={errors.emergencyContactPhone} onValueChange={(value) => handleChangeField('emergencyContactPhone', value)} onBlur={onValidation('emergencyContactPhone')} required />
          <InputComponent value={form.emergencyContactPhone2} label="Telefono emergencia 2" type="tel" placeholder="Ingresa el telefono secundario" onValueChange={(value) => handleChangeField('emergencyContactPhone2', value)} />
        </div>

        <SectionTitle title="Direccion" />
        <div className="grid gap-4 md:grid-cols-3">
          <InputComponent value={form.streetName} label="Calle" type="text" placeholder="Ingresa la calle" error={errors.streetName} onValueChange={(value) => handleChangeField('streetName', value)} onBlur={onValidation('streetName')} required />
          <InputComponent value={form.streetNumber} label="Numero" type="text" placeholder="Ingresa el numero" error={errors.streetNumber} onValueChange={(value) => handleChangeField('streetNumber', value)} onBlur={onValidation('streetNumber')} required />
          <InputComponent value={form.postalCode} label="Codigo postal" type="text" placeholder="Ingresa el codigo postal" error={errors.postalCode} onValueChange={(value) => handleChangeField('postalCode', value)} onBlur={onValidation('postalCode')} required />
          <InputComponent value={form.department} label="Departamento" type="text" placeholder="Ingresa el departamento" onValueChange={(value) => handleChangeField('department', value)} />
          <InputComponent value={form.village} label="Villa" type="text" placeholder="Ingresa la villa" onValueChange={(value) => handleChangeField('village', value)} />
          <InputComponent value={form.block} label="Block" type="text" placeholder="Ingresa el block" onValueChange={(value) => handleChangeField('block', value)} />
          <SelectComponent value={form.regionId} label="Region" options={selectRegions} error={errors.regionId} onValueChange={(value) => handleChangeField('regionId', value)} onValidation={onValidation('regionId')} required />
          <SelectComponent value={form.communeId} label="Comuna" options={selectCommunes} error={errors.communeId} disabled={loadingCommuneOptions || !form.regionId} onValueChange={(value) => handleChangeField('communeId', value)} onValidation={onValidation('communeId')} required />
          <SelectComponent value={form.cityId} label="Ciudad" options={selectCities} error={errors.cityId} disabled={loadingCityOptions || !form.communeId} onValueChange={(value) => handleChangeField('cityId', value)} onValidation={onValidation('cityId')} required />
        </div>

        <SectionTitle title="Prevision y salud" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent value={form.familyAllowanceTierId} label="Tramo carga familiar" options={selectFamilyAllowanceTiers} error={errors.familyAllowanceTierId} onValueChange={(value) => handleChangeField('familyAllowanceTierId', value)} onValidation={onValidation('familyAllowanceTierId')} required />
          <SelectComponent value={form.retirementStatusId} label="Estado retiro" options={selectRetirementStatuses} error={errors.retirementStatusId} onValueChange={(value) => handleChangeField('retirementStatusId', value)} onValidation={onValidation('retirementStatusId')} required />
          <SelectComponent value={form.pensionStatusId} label="Estado pension" options={selectPensionStatuses} error={errors.pensionStatusId} onValueChange={(value) => handleChangeField('pensionStatusId', value)} onValidation={onValidation('pensionStatusId')} required />
          <SelectComponent value={form.afpId} label="AFP" options={selectAfps} error={errors.afpId} onValueChange={(value) => handleChangeField('afpId', value)} onValidation={onValidation('afpId')} required />
          <SelectComponent value={form.healthInsuranceId} label="Prevision salud" options={selectHealthInsurances} error={errors.healthInsuranceId} onValueChange={(value) => handleChangeField('healthInsuranceId', value)} onValidation={onValidation('healthInsuranceId')} required />
          <SelectComponent value={form.healthInsuranceTariffId} label="Tarifa salud" options={selectHealthInsuranceTariffs} onValueChange={(value) => handleChangeField('healthInsuranceTariffId', value)} />
          <InputComponent value={form.isapreFun} label="Isapre FUN" type="text" placeholder="Ingresa isapre FUN" onValueChange={(value) => handleChangeField('isapreFun', value)} />
          <InputComponent value={form.healthInsuranceUF} label="Salud UF" type="number" placeholder="Ingresa valor en UF" onValueChange={(value) => handleChangeField('healthInsuranceUF', value)} />
          <InputComponent value={form.healthInsurancePesos} label="Salud Pesos" type="number" placeholder="Ingresa valor en pesos" onValueChange={(value) => handleChangeField('healthInsurancePesos', value)} />
        </div>

        <SectionTitle title="Pago y tallas" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent value={form.paymentMethodId} label="Forma pago" options={selectPaymentMethods} error={errors.paymentMethodId} onValueChange={(value) => handleChangeField('paymentMethodId', value)} onValidation={onValidation('paymentMethodId')} required />
          <SelectComponent value={form.bankId} label="Banco" options={selectBanks} error={errors.bankId} onValueChange={(value) => handleChangeField('bankId', value)} onValidation={onValidation('bankId')} required />
          <InputComponent value={form.bankAccount} label="Cuenta bancaria" type="text" placeholder="Ingresa la cuenta bancaria" error={errors.bankAccount} onValueChange={(value) => handleChangeField('bankAccount', value)} onBlur={onValidation('bankAccount')} required />
          <InputComponent value={form.clothingSize} label="Talla ropa" type="text" placeholder="Ingresa talla de ropa" error={errors.clothingSize} onValueChange={(value) => handleChangeField('clothingSize', value)} onBlur={onValidation('clothingSize')} required />
          <InputComponent value={form.shoeSize} label="Talla zapato" type="text" placeholder="Ingresa talla de zapato" error={errors.shoeSize} onValueChange={(value) => handleChangeField('shoeSize', value)} onBlur={onValidation('shoeSize')} required />
          <InputComponent value={form.pantSize} label="Talla pantalon" type="text" placeholder="Ingresa talla de pantalon" error={errors.pantSize} onValueChange={(value) => handleChangeField('pantSize', value)} onBlur={onValidation('pantSize')} required />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent type="button" variant="outline" disabled={saving} label="Volver" onClick={() => navigate(AUTH_ROUTE_EMPLOYEES)} />
          <ButtonComponent type="submit" variant="primary" disabled={!canSubmit} label={saving ? messages.employees.ui.createEmployeeSubmitting : messages.employees.ui.createEmployeeSubmit} />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar creacion de trabajador"
        message={confirmMessage}
        confirmLabel={messages.employees.ui.createEmployeeSubmit}
        cancelLabel="Cancelar"
        loading={saving}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmSave() }}
      />
    </section>
  )
}
