import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
} from '@/components'
import type { initialOvertimeForm } from '@/factories'

type OvertimeFormShape = typeof initialOvertimeForm
type OvertimeFormField = keyof OvertimeFormShape

interface OvertimeFormScheduleSectionComponentProps {
  form: OvertimeFormShape
  errors: Partial<Record<OvertimeFormField, string>>
  isEditMode: boolean
  onChangeField: (field: OvertimeFormField) => (value: string) => void
  onValidation: (field: OvertimeFormField) => () => void
  onNormalizeTime: (field: 'startTime' | 'endTime') => void
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

export function OvertimeFormScheduleSectionComponent(props: OvertimeFormScheduleSectionComponentProps) {
  const { form, errors, isEditMode, onChangeField, onValidation, onNormalizeTime } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="02" title="Bloque horario" />

      <div className="space-y-3">
        <SubSectionLabel number="02.1" title="Fecha y horas" />
        <div className="grid gap-4 md:grid-cols-3">
          <DatePickerComponent
            value={form.date}
            label="Fecha"
            error={errors.date}
            onValueChange={onChangeField('date')}
            onValidation={onValidation('date')}
            disabled={isEditMode}
            required
          />
          <InputComponent
            value={form.startTime}
            label="Inicio"
            type="text"
            inputMode="numeric"
            placeholder="19 o 19:30"
            maxLength={5}
            error={errors.startTime}
            onValueChange={onChangeField('startTime')}
            onBlur={() => {
              onNormalizeTime('startTime')
              onValidation('startTime')()
            }}
            required
          />
          <InputComponent
            value={form.endTime}
            label="Término"
            type="text"
            inputMode="numeric"
            placeholder="21 o 21:00"
            maxLength={5}
            error={errors.endTime}
            onValueChange={onChangeField('endTime')}
            onBlur={() => {
              onNormalizeTime('endTime')
              onValidation('endTime')()
            }}
            required
          />
        </div>
        <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
          Puedes escribir solo la hora, por ejemplo 8 o 20. El sistema la normaliza a formato 24 horas.
        </p>
      </div>
    </section>
  )
}
