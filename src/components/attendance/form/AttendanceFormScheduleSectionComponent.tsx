import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
} from '@/components'
import type { initialAttendanceMarkForm } from '@/factories'

type AttendanceMarkFormShape = typeof initialAttendanceMarkForm
type AttendanceMarkFormField = keyof AttendanceMarkFormShape

interface AttendanceFormScheduleSectionComponentProps {
  form: AttendanceMarkFormShape
  errors: Partial<Record<AttendanceMarkFormField, string>>
  markTimeLabel: string
  onChangeField: (field: AttendanceMarkFormField) => (value: string) => void
  onValidation: (field: AttendanceMarkFormField) => () => void
  onNormalizeMarkTime: () => void
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

export function AttendanceFormScheduleSectionComponent(props: AttendanceFormScheduleSectionComponentProps) {
  const { form, errors, markTimeLabel, onChangeField, onValidation, onNormalizeMarkTime } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="02" title="Jornada" />

      <div className="space-y-3">
        <SubSectionLabel number="02.1" title="Fecha y hora" />
        <div className="grid gap-4 md:grid-cols-2">
          <DatePickerComponent
            value={form.date}
            label="Fecha"
            error={errors.date}
            onValueChange={onChangeField('date')}
            onValidation={onValidation('date')}
            disabled={!form.markType}
            required
          />
          <InputComponent
            value={form.markTime}
            label={markTimeLabel}
            type="text"
            inputMode="numeric"
            placeholder="08 o 08:00"
            maxLength={5}
            error={errors.markTime}
            onValueChange={onChangeField('markTime')}
            onBlur={() => {
              onNormalizeMarkTime()
              onValidation('markTime')()
            }}
            disabled={!form.markType}
            required
          />
        </div>
      </div>
    </section>
  )
}
