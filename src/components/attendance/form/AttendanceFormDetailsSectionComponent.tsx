import {
  DetailSectionHeaderComponent,
  SelectComponent,
} from '@/components'
import type { initialAttendanceMarkForm } from '@/factories'

type AttendanceMarkFormShape = typeof initialAttendanceMarkForm
type AttendanceMarkFormField = keyof AttendanceMarkFormShape
type SelectOption = { label: string, value: string }

interface AttendanceFormDetailsSectionComponentProps {
  form: AttendanceMarkFormShape
  costCenterOptions: SelectOption[]
  loadingCostCenterOptions: boolean
  costCenterDisabled: boolean
  onChangeField: (field: AttendanceMarkFormField) => (value: string) => void
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

export function AttendanceFormDetailsSectionComponent(props: AttendanceFormDetailsSectionComponentProps) {
  const { form, costCenterOptions, loadingCostCenterOptions, costCenterDisabled, onChangeField } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="03" title="Detalles" />

      <div className="space-y-3">
        <SubSectionLabel number="03.1" title="Proyecto" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.costCenter}
            label="Centro de costo"
            options={costCenterOptions}
            loading={loadingCostCenterOptions}
            disabled={costCenterDisabled}
            onValueChange={onChangeField('costCenter')}
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="03.2" title="Notas" />
        <div className="flex flex-col gap-1.5">
          <label className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Notas
          </label>
          <textarea
            value={form.notes}
            placeholder="Ej: Entrada manual"
            rows={4}
            disabled={!form.markType}
            className="r-md w-full resize-y border border-slate-200 bg-white px-2.5 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-400)]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-500"
            onChange={(e) => onChangeField('notes')(e.target.value)}
          />
        </div>
      </div>
    </section>
  )
}
