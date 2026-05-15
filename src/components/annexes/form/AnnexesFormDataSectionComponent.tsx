import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SelectComponent,
} from '@/components'
import type { initialCreateAnnexForm } from '@/factories'

type AnnexFormShape = typeof initialCreateAnnexForm
type AnnexFormField = keyof AnnexFormShape
type SelectOption = { label: string, value: string }

interface AnnexesFormDataSectionComponentProps {
  form: AnnexFormShape
  errors: Partial<Record<AnnexFormField, string>>
  isEditMode: boolean
  employeeOptions: SelectOption[]
  annexTypeOptions: SelectOption[]
  loadingFormOptions: boolean
  onChangeField: (field: AnnexFormField) => (value: string) => void
  onValidation: (field: AnnexFormField) => () => void
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

export function AnnexesFormDataSectionComponent(props: AnnexesFormDataSectionComponentProps) {
  const { form, errors, isEditMode, employeeOptions, annexTypeOptions, loadingFormOptions, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos del anexo" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Relación contractual" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="ID trabajador"
            options={employeeOptions}
            loading={loadingFormOptions}
            error={errors.employeeId}
            disabled={isEditMode}
            onValueChange={onChangeField('employeeId')}
            onValidation={onValidation('employeeId')}
            required
          />
          <SelectComponent
            value={form.annexTypeId}
            label="Tipo de anexo"
            options={annexTypeOptions}
            loading={loadingFormOptions}
            error={errors.annexTypeId}
            onValueChange={onChangeField('annexTypeId')}
            onValidation={onValidation('annexTypeId')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Vigencia y descripción" />
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <DatePickerComponent
            value={form.date}
            label="Fecha"
            error={errors.date}
            onValueChange={onChangeField('date')}
            onValidation={onValidation('date')}
            required
          />
          <InputComponent
            value={form.description}
            label="Descripción"
            type="text"
            placeholder="Descripción opcional"
            onValueChange={onChangeField('description')}
          />
        </div>
      </div>
    </section>
  )
}
