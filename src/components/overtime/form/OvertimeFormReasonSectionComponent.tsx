import { DetailSectionHeaderComponent } from '@/components'
import type { OvertimeCreateForm, OvertimeFormField } from '@/types'

interface OvertimeFormReasonSectionComponentProps {
  form: OvertimeCreateForm
  errors: Partial<Record<OvertimeFormField, string>>
  onChangeField: (field: OvertimeFormField) => (value: string) => void
  onValidation: (field: OvertimeFormField) => () => void
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

export function OvertimeFormReasonSectionComponent(props: OvertimeFormReasonSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="03" title="Motivo" />
      <div className="space-y-3">
        <SubSectionLabel number="03.1" title="Justificación" />
        <div className="flex flex-col gap-1.5">
          <label className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Motivo<span className="ml-0.5 accent-text">*</span>
          </label>
          <textarea
            value={form.reason}
            placeholder="Ej: Cierre de obra"
            rows={4}
            className={`r-md w-full resize-y border bg-white px-2.5 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              errors.reason
                ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-400/30 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-200'
                : 'border-slate-200 focus:border-[var(--accent-500)] dark:border-white/10'
            }`}
            onChange={(event) => onChangeField('reason')(event.target.value)}
            onBlur={onValidation('reason')}
          />
          {errors.reason && <p className="num text-[11px] text-rose-500 dark:text-rose-400">{errors.reason}</p>}
        </div>
      </div>
    </section>
  )
}
