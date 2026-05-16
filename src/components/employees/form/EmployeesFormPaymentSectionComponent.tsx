import { DetailSectionHeaderComponent, InputComponent, SelectComponent } from '@/components'
import type { initialCreateEmployeeForm } from '@/factories'

type EmployeeFormShape = typeof initialCreateEmployeeForm
type EmployeeFormField = keyof EmployeeFormShape
type SelectOption = { label: string, value: string }

interface EmployeesFormPaymentSectionComponentProps {
  form: EmployeeFormShape
  errors: Partial<Record<EmployeeFormField, string>>
  paymentMethodOptions: SelectOption[]
  bankOptions: SelectOption[]
  onChangeField: (field: EmployeeFormField) => (value: string) => void
  onValidation: (field: EmployeeFormField) => () => void
}

export function EmployeesFormPaymentSectionComponent(props: EmployeesFormPaymentSectionComponentProps) {
  const { form, errors, paymentMethodOptions, bankOptions, onChangeField, onValidation } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="06" title="Pago y tallas" />
      <div className="grid gap-4 md:grid-cols-3">
        <SelectComponent
          value={form.paymentMethodId}
          label="Forma pago"
          options={paymentMethodOptions}
          error={errors.paymentMethodId}
          onValueChange={onChangeField('paymentMethodId')}
          onValidation={onValidation('paymentMethodId')}
          required
        />
        <SelectComponent
          value={form.bankId}
          label="Banco"
          options={bankOptions}
          error={errors.bankId}
          onValueChange={onChangeField('bankId')}
          onValidation={onValidation('bankId')}
          required
        />
        <InputComponent
          value={form.bankAccount}
          label="Cuenta bancaria"
          type="text"
          placeholder="Ingresa la cuenta bancaria"
          error={errors.bankAccount}
          onValueChange={onChangeField('bankAccount')}
          onBlur={onValidation('bankAccount')}
          required
        />
        <InputComponent
          value={form.clothingSize}
          label="Talla ropa"
          type="text"
          placeholder="Ingresa talla de ropa"
          error={errors.clothingSize}
          onValueChange={onChangeField('clothingSize')}
          onBlur={onValidation('clothingSize')}
          required
        />
        <InputComponent
          value={form.shoeSize}
          label="Talla zapato"
          type="text"
          placeholder="Ingresa talla de zapato"
          error={errors.shoeSize}
          onValueChange={onChangeField('shoeSize')}
          onBlur={onValidation('shoeSize')}
          required
        />
        <InputComponent
          value={form.pantSize}
          label="Talla pantalón"
          type="text"
          placeholder="Ingresa talla de pantalón"
          error={errors.pantSize}
          onValueChange={onChangeField('pantSize')}
          onBlur={onValidation('pantSize')}
          required
        />
      </div>
    </section>
  )
}
