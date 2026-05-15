import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SelectComponent,
} from '@/components'
import type { initialCreateContractForm } from '@/factories'

type ContractFormShape = typeof initialCreateContractForm
type ContractFormField = keyof ContractFormShape
type SelectOption = { label: string, value: string }

interface ContractsFormConditionsSectionComponentProps {
  form: ContractFormShape
  errors: Partial<Record<ContractFormField, string>>
  hideEndDate: boolean
  mealTypeOptions: SelectOption[]
  transportTypeOptions: SelectOption[]
  onChangeField: (field: ContractFormField) => (value: string) => void
  onValidation: (field: ContractFormField) => () => void
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

export function ContractsFormConditionsSectionComponent(props: ContractsFormConditionsSectionComponentProps) {
  const { form, errors, hideEndDate, mealTypeOptions, transportTypeOptions, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="02" title="Condiciones contractuales" />

      <div className="space-y-3">
        <SubSectionLabel number="02.1" title="Remuneración" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.baseSalary}
            label="Sueldo base"
            type="text"
            placeholder="Ingresa el sueldo base"
            error={errors.baseSalary}
            onValueChange={onChangeField('baseSalary')}
            onBlur={onValidation('baseSalary')}
            required
          />
          <InputComponent
            value={form.agreedSalary}
            label="Sueldo acordado"
            type="text"
            placeholder="Ingresa el sueldo acordado"
            error={errors.agreedSalary}
            onValueChange={onChangeField('agreedSalary')}
            onBlur={onValidation('agreedSalary')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="02.2" title="Jornada y vigencia" />
        <div className="grid gap-4 md:grid-cols-3">
          <InputComponent
            value={form.weeklyWorkHours}
            label="Horas semanales"
            type="text"
            placeholder="Ingresa las horas semanales"
            error={errors.weeklyWorkHours}
            onValueChange={onChangeField('weeklyWorkHours')}
            onBlur={onValidation('weeklyWorkHours')}
            required
          />
          <InputComponent
            value={form.workDays}
            label="Días de trabajo"
            type="text"
            placeholder="Ingresa los días de trabajo"
            error={errors.workDays}
            onValueChange={onChangeField('workDays')}
            onBlur={onValidation('workDays')}
            required
          />
          <DatePickerComponent
            value={form.startDate}
            label="Fecha inicio"
            error={errors.startDate}
            onValueChange={onChangeField('startDate')}
            onValidation={onValidation('startDate')}
            required
          />
          {!hideEndDate && (
            <DatePickerComponent
              value={form.endDate}
              label="Fecha término"
              onValueChange={onChangeField('endDate')}
            />
          )}
          <SelectComponent
            value={form.mealTypeId}
            label="Tipo colación"
            options={mealTypeOptions}
            error={errors.mealTypeId}
            onValueChange={onChangeField('mealTypeId')}
            onValidation={onValidation('mealTypeId')}
            required
          />
          <SelectComponent
            value={form.transportTypeId}
            label="Tipo movilización"
            options={transportTypeOptions}
            error={errors.transportTypeId}
            onValueChange={onChangeField('transportTypeId')}
            onValidation={onValidation('transportTypeId')}
            required
          />
        </div>
      </div>
    </section>
  )
}
