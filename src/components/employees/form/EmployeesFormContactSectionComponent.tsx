import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateEmployeeForm } from '@/factories'

type EmployeeFormShape = typeof initialCreateEmployeeForm
type EmployeeFormField = keyof EmployeeFormShape

interface EmployeesFormContactSectionComponentProps {
  form: EmployeeFormShape
  errors: Partial<Record<EmployeeFormField, string>>
  onChangeField: (field: EmployeeFormField) => (value: string) => void
  onValidation: (field: EmployeeFormField) => () => void
}

export function EmployeesFormContactSectionComponent(props: EmployeesFormContactSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="02" title="Contacto" />
      <div className="grid gap-4 md:grid-cols-2">
        <InputComponent
          value={form.personalEmail}
          label="Email personal"
          type="email"
          placeholder="Ingresa el email personal"
          error={errors.personalEmail}
          onValueChange={onChangeField('personalEmail')}
          onBlur={onValidation('personalEmail')}
          required
        />
        <InputComponent
          value={form.phone}
          label="Teléfono"
          type="tel"
          placeholder="Ingresa el teléfono"
          error={errors.phone}
          onValueChange={onChangeField('phone')}
          onBlur={onValidation('phone')}
          required
        />
        <InputComponent
          value={form.corporateEmail}
          label="Email corporativo"
          type="email"
          placeholder="Ingresa el email corporativo"
          error={errors.corporateEmail}
          onValueChange={onChangeField('corporateEmail')}
          onBlur={onValidation('corporateEmail')}
          required
        />
        <InputComponent
          value={form.phone2}
          label="Teléfono secundario"
          type="tel"
          placeholder="Ingresa el teléfono secundario"
          onValueChange={onChangeField('phone2')}
        />
      </div>
    </section>
  )
}
