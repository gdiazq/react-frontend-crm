import { DetailSectionHeaderComponent, InputComponent, SelectComponent } from '@/components'
import type { initialCreateEmployeeForm } from '@/factories'

type EmployeeFormShape = typeof initialCreateEmployeeForm
type EmployeeFormField = keyof EmployeeFormShape
type SelectOption = { label: string, value: string }

interface EmployeesFormAddressSectionComponentProps {
  form: EmployeeFormShape
  errors: Partial<Record<EmployeeFormField, string>>
  regionOptions: SelectOption[]
  communeOptions: SelectOption[]
  cityOptions: SelectOption[]
  loadingCommuneOptions: boolean
  loadingCityOptions: boolean
  onChangeField: (field: EmployeeFormField) => (value: string) => void
  onValidation: (field: EmployeeFormField) => () => void
}

export function EmployeesFormAddressSectionComponent(props: EmployeesFormAddressSectionComponentProps) {
  const {
    form,
    errors,
    regionOptions,
    communeOptions,
    cityOptions,
    loadingCommuneOptions,
    loadingCityOptions,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="04" title="Dirección" />
      <div className="grid gap-4 md:grid-cols-3">
        <InputComponent
          value={form.streetName}
          label="Calle"
          type="text"
          placeholder="Ingresa la calle"
          error={errors.streetName}
          onValueChange={onChangeField('streetName')}
          onBlur={onValidation('streetName')}
          required
        />
        <InputComponent
          value={form.streetNumber}
          label="Número"
          type="text"
          placeholder="Ingresa el número"
          error={errors.streetNumber}
          onValueChange={onChangeField('streetNumber')}
          onBlur={onValidation('streetNumber')}
          required
        />
        <InputComponent
          value={form.postalCode}
          label="Código postal"
          type="text"
          placeholder="Ingresa el código postal"
          error={errors.postalCode}
          onValueChange={onChangeField('postalCode')}
          onBlur={onValidation('postalCode')}
          required
        />
        <InputComponent
          value={form.department}
          label="Departamento"
          type="text"
          placeholder="Ingresa el departamento"
          onValueChange={onChangeField('department')}
        />
        <InputComponent
          value={form.village}
          label="Villa"
          type="text"
          placeholder="Ingresa la villa"
          onValueChange={onChangeField('village')}
        />
        <InputComponent
          value={form.block}
          label="Block"
          type="text"
          placeholder="Ingresa el block"
          onValueChange={onChangeField('block')}
        />
        <SelectComponent
          value={form.regionId}
          label="Región"
          options={regionOptions}
          error={errors.regionId}
          onValueChange={onChangeField('regionId')}
          onValidation={onValidation('regionId')}
          required
        />
        <SelectComponent
          value={form.communeId}
          label="Comuna"
          options={communeOptions}
          error={errors.communeId}
          disabled={loadingCommuneOptions || !form.regionId}
          onValueChange={onChangeField('communeId')}
          onValidation={onValidation('communeId')}
          required
        />
        <SelectComponent
          value={form.cityId}
          label="Ciudad"
          options={cityOptions}
          error={errors.cityId}
          disabled={loadingCityOptions || !form.communeId}
          onValueChange={onChangeField('cityId')}
          onValidation={onValidation('cityId')}
          required
        />
      </div>
    </section>
  )
}
