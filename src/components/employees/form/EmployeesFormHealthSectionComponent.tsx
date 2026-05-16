import { DetailSectionHeaderComponent, InputComponent, SelectComponent } from '@/components'
import type { initialCreateEmployeeForm } from '@/factories'

type EmployeeFormShape = typeof initialCreateEmployeeForm
type EmployeeFormField = keyof EmployeeFormShape
type SelectOption = { label: string, value: string }

interface EmployeesFormHealthSectionComponentProps {
  form: EmployeeFormShape
  errors: Partial<Record<EmployeeFormField, string>>
  familyAllowanceTierOptions: SelectOption[]
  retirementStatusOptions: SelectOption[]
  pensionStatusOptions: SelectOption[]
  afpOptions: SelectOption[]
  healthInsuranceOptions: SelectOption[]
  healthInsuranceTariffOptions: SelectOption[]
  showHealthInsuranceIsapreFields: boolean
  showHealthInsuranceUFInput: boolean
  showHealthInsurancePesosInput: boolean
  onChangeField: (field: EmployeeFormField) => (value: string) => void
  onValidation: (field: EmployeeFormField) => () => void
}

export function EmployeesFormHealthSectionComponent(props: EmployeesFormHealthSectionComponentProps) {
  const {
    form,
    errors,
    familyAllowanceTierOptions,
    retirementStatusOptions,
    pensionStatusOptions,
    afpOptions,
    healthInsuranceOptions,
    healthInsuranceTariffOptions,
    showHealthInsuranceIsapreFields,
    showHealthInsuranceUFInput,
    showHealthInsurancePesosInput,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="05" title="Previsión y salud" />
      <div className="grid gap-4 md:grid-cols-3">
        <SelectComponent
          value={form.familyAllowanceTierId}
          label="Tramo carga familiar"
          options={familyAllowanceTierOptions}
          error={errors.familyAllowanceTierId}
          onValueChange={onChangeField('familyAllowanceTierId')}
          onValidation={onValidation('familyAllowanceTierId')}
          required
        />
        <SelectComponent
          value={form.retirementStatusId}
          label="Estado retiro"
          options={retirementStatusOptions}
          error={errors.retirementStatusId}
          onValueChange={onChangeField('retirementStatusId')}
          onValidation={onValidation('retirementStatusId')}
          required
        />
        <SelectComponent
          value={form.pensionStatusId}
          label="Estado pensión"
          options={pensionStatusOptions}
          error={errors.pensionStatusId}
          onValueChange={onChangeField('pensionStatusId')}
          onValidation={onValidation('pensionStatusId')}
          required
        />
        <SelectComponent
          value={form.afpId}
          label="AFP"
          options={afpOptions}
          error={errors.afpId}
          onValueChange={onChangeField('afpId')}
          onValidation={onValidation('afpId')}
          required
        />
        <SelectComponent
          value={form.healthInsuranceId}
          label="Previsión salud"
          options={healthInsuranceOptions}
          error={errors.healthInsuranceId}
          onValueChange={onChangeField('healthInsuranceId')}
          onValidation={onValidation('healthInsuranceId')}
          required
        />
        {showHealthInsuranceIsapreFields && (
          <SelectComponent
            value={form.healthInsuranceTariffId}
            label="Tarifa salud"
            options={healthInsuranceTariffOptions}
            onValueChange={onChangeField('healthInsuranceTariffId')}
          />
        )}
        {showHealthInsuranceIsapreFields && (
          <InputComponent
            value={form.isapreFun}
            label="Isapre FUN"
            type="text"
            placeholder="Ingresa isapre FUN"
            onValueChange={onChangeField('isapreFun')}
          />
        )}
        {showHealthInsuranceUFInput && (
          <InputComponent
            value={form.healthInsuranceUF}
            label="Salud UF"
            type="number"
            placeholder="Ingresa valor en UF"
            onValueChange={onChangeField('healthInsuranceUF')}
          />
        )}
        {showHealthInsurancePesosInput && (
          <InputComponent
            value={form.healthInsurancePesos}
            label="Salud Pesos"
            type="number"
            placeholder="Ingresa valor en pesos"
            onValueChange={onChangeField('healthInsurancePesos')}
          />
        )}
      </div>
    </section>
  )
}
