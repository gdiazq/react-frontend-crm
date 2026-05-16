import { DetailSectionHeaderComponent, InputComponent, SelectComponent } from '@/components'
import type { initialCreateEmployeeForm } from '@/factories'

type EmployeeFormShape = typeof initialCreateEmployeeForm
type EmployeeFormField = keyof EmployeeFormShape
type SelectOption = { label: string, value: string }

interface EmployeesFormEmergencyContactSectionComponentProps {
  form: EmployeeFormShape
  errors: Partial<Record<EmployeeFormField, string>>
  emergencyRelationshipOptions: SelectOption[]
  onChangeField: (field: EmployeeFormField) => (value: string) => void
  onValidation: (field: EmployeeFormField) => () => void
}

export function EmployeesFormEmergencyContactSectionComponent(props: EmployeesFormEmergencyContactSectionComponentProps) {
  const { form, errors, emergencyRelationshipOptions, onChangeField, onValidation } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="03" title="Contacto de emergencia" />
      <div className="grid gap-4 md:grid-cols-2">
        <SelectComponent
          value={form.emergencyContactRelationshipId}
          label="Parentesco"
          options={emergencyRelationshipOptions}
          error={errors.emergencyContactRelationshipId}
          onValueChange={onChangeField('emergencyContactRelationshipId')}
          onValidation={onValidation('emergencyContactRelationshipId')}
          required
        />
        <InputComponent
          value={form.emergencyContactName}
          label="Nombre contacto"
          type="text"
          placeholder="Ingresa el nombre del contacto"
          error={errors.emergencyContactName}
          onValueChange={onChangeField('emergencyContactName')}
          onBlur={onValidation('emergencyContactName')}
          required
        />
        <InputComponent
          value={form.emergencyContactPhone}
          label="Teléfono emergencia"
          type="tel"
          placeholder="Ingresa el teléfono de emergencia"
          error={errors.emergencyContactPhone}
          onValueChange={onChangeField('emergencyContactPhone')}
          onBlur={onValidation('emergencyContactPhone')}
          required
        />
        <InputComponent
          value={form.emergencyContactPhone2}
          label="Teléfono emergencia 2"
          type="tel"
          placeholder="Ingresa el teléfono secundario"
          onValueChange={onChangeField('emergencyContactPhone2')}
        />
      </div>
    </section>
  )
}
