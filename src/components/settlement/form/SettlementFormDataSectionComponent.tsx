import { DatePickerComponent, DetailSectionHeaderComponent, SelectComponent } from '@/components'
import { initialCreateSettlementForm } from '@/factories'

type SettlementFormShape = typeof initialCreateSettlementForm
type SettlementFormField = keyof SettlementFormShape
type SelectOption = { label: string, value: string }

interface SettlementFormDataSectionComponentProps {
  form: SettlementFormShape
  errors: Partial<Record<SettlementFormField, string>>
  isEditMode: boolean
  employeeOptions: SelectOption[]
  rehireOptions: SelectOption[]
  onEmployeeChange: (value: string) => void
  onChangeField: (field: SettlementFormField) => (value: string) => void
  onValidation: (field: SettlementFormField) => () => void
  onRehireEligibleChange: (value: string) => void
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

export function SettlementFormDataSectionComponent({
  form,
  errors,
  isEditMode,
  employeeOptions,
  rehireOptions,
  onEmployeeChange,
  onChangeField,
  onValidation,
  onRehireEligibleChange,
}: SettlementFormDataSectionComponentProps) {
  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos del trabajador" />
      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Trabajador y cierre" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={employeeOptions}
            error={errors.employeeId}
            disabled={isEditMode}
            onValueChange={onEmployeeChange}
            onValidation={onValidation('employeeId')}
            required
          />

          <DatePickerComponent
            value={form.endDate}
            label="Fecha finiquito"
            error={errors.endDate}
            onValueChange={onChangeField('endDate')}
            onValidation={onValidation('endDate')}
            required
          />

          <SelectComponent
            value={form.rehireEligible}
            label="Recontratable"
            options={rehireOptions}
            error={errors.rehireEligible}
            onValueChange={onRehireEligibleChange}
            onValidation={onValidation('rehireEligible')}
            required
          />
        </div>
      </div>
    </section>
  )
}
