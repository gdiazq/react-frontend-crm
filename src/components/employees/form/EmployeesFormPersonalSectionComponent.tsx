import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SelectComponent,
} from '@/components'
import type { initialCreateEmployeeForm } from '@/factories'

type EmployeeFormShape = typeof initialCreateEmployeeForm
type EmployeeFormField = keyof EmployeeFormShape
type SelectOption = { label: string, value: string }

interface EmployeesFormPersonalSectionComponentProps {
  form: EmployeeFormShape
  errors: Partial<Record<EmployeeFormField, string>>
  identificationTypeOptions: SelectOption[]
  genderOptions: SelectOption[]
  maritalStatusOptions: SelectOption[]
  nationalityOptions: SelectOption[]
  educationLevelOptions: SelectOption[]
  professionOptions: SelectOption[]
  driverLicenseOptions: SelectOption[]
  expatOptions: SelectOption[]
  onChangeField: (field: EmployeeFormField) => (value: string) => void
  onValidation: (field: EmployeeFormField) => () => void
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

export function EmployeesFormPersonalSectionComponent(props: EmployeesFormPersonalSectionComponentProps) {
  const {
    form,
    errors,
    identificationTypeOptions,
    genderOptions,
    maritalStatusOptions,
    nationalityOptions,
    educationLevelOptions,
    professionOptions,
    driverLicenseOptions,
    expatOptions,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos personales" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación y nacimiento" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.identificationTypeId}
            label="Tipo identificación"
            options={identificationTypeOptions}
            error={errors.identificationTypeId}
            onValueChange={onChangeField('identificationTypeId')}
            onValidation={onValidation('identificationTypeId')}
            required
          />
          <InputComponent
            value={form.identification}
            label="Identificación"
            type="text"
            placeholder="Ingresa la identificación"
            error={errors.identification}
            onValueChange={onChangeField('identification')}
            onBlur={onValidation('identification')}
            required
          />
          <DatePickerComponent
            value={form.birthDate}
            label="Fecha nacimiento"
            error={errors.birthDate}
            onValueChange={onChangeField('birthDate')}
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
            onValueChange={onChangeField('firstName')}
            onBlur={onValidation('firstName')}
            required
          />
          <InputComponent
            value={form.paternalLastName}
            label="Apellido paterno"
            type="text"
            placeholder="Ingresa el apellido paterno"
            error={errors.paternalLastName}
            onValueChange={onChangeField('paternalLastName')}
            onBlur={onValidation('paternalLastName')}
            required
          />
          <InputComponent
            value={form.maternalLastName}
            label="Apellido materno"
            type="text"
            placeholder="Ingresa el apellido materno"
            error={errors.maternalLastName}
            onValueChange={onChangeField('maternalLastName')}
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
            options={genderOptions}
            error={errors.genderId}
            onValueChange={onChangeField('genderId')}
            onValidation={onValidation('genderId')}
            required
          />
          <SelectComponent
            value={form.maritalStatusId}
            label="Estado civil"
            options={maritalStatusOptions}
            error={errors.maritalStatusId}
            onValueChange={onChangeField('maritalStatusId')}
            onValidation={onValidation('maritalStatusId')}
            required
          />
          <SelectComponent
            value={form.nationalityId}
            label="Nacionalidad"
            options={nationalityOptions}
            error={errors.nationalityId}
            onValueChange={onChangeField('nationalityId')}
            onValidation={onValidation('nationalityId')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.4" title="Perfil laboral base" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.educationLevelId}
            label="Nivel educacional"
            options={educationLevelOptions}
            error={errors.educationLevelId}
            onValueChange={onChangeField('educationLevelId')}
            onValidation={onValidation('educationLevelId')}
            required
          />
          <SelectComponent
            value={form.professionId}
            label="Profesión"
            options={professionOptions}
            error={errors.professionId}
            onValueChange={onChangeField('professionId')}
            onValidation={onValidation('professionId')}
            required
          />
          <SelectComponent
            value={form.driverLicenseId}
            label="Licencia conducir"
            options={driverLicenseOptions}
            error={errors.driverLicenseId}
            onValueChange={onChangeField('driverLicenseId')}
            onValidation={onValidation('driverLicenseId')}
            required
          />
          <SelectComponent
            value={form.expatId}
            label="Expatriado"
            options={expatOptions}
            error={errors.expatId}
            onValueChange={onChangeField('expatId')}
            onValidation={onValidation('expatId')}
            required
          />
        </div>
      </div>
    </section>
  )
}
