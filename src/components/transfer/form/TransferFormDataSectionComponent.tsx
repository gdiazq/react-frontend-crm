import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  SelectComponent,
} from '@/components'
import type { TransferCreateForm, TransferFormField, TransferSelectOption } from '@/types'

interface TransferFormDataSectionComponentProps {
  form: TransferCreateForm
  errors: Partial<Record<TransferFormField, string>>
  isEditMode: boolean
  employeeOptions: TransferSelectOption[]
  costCenterOptions: TransferSelectOption[]
  loadingEmployeeOptions: boolean
  loadingCostCenterOptions: boolean
  onChangeField: (field: TransferFormField) => (value: string) => void
  onValidation: (field: TransferFormField) => () => void
}

function SubSectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

export function TransferFormDataSectionComponent({
  form,
  errors,
  isEditMode,
  employeeOptions,
  costCenterOptions,
  loadingEmployeeOptions,
  loadingCostCenterOptions,
  onChangeField,
  onValidation,
}: TransferFormDataSectionComponentProps) {
  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos del traspaso" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Trabajador y destino" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={employeeOptions}
            error={errors.employeeId}
            disabled={isEditMode}
            loading={loadingEmployeeOptions}
            onValueChange={onChangeField('employeeId')}
            onValidation={onValidation('employeeId')}
            required
          />

          <SelectComponent
            value={form.toCostCenter}
            label="Centro de costo destino"
            options={costCenterOptions}
            error={errors.toCostCenter}
            loading={loadingCostCenterOptions}
            onValueChange={onChangeField('toCostCenter')}
            onValidation={onValidation('toCostCenter')}
            required
          />

          <DatePickerComponent
            value={form.effectiveDate}
            label="Fecha efectiva"
            error={errors.effectiveDate}
            onValueChange={onChangeField('effectiveDate')}
            onValidation={onValidation('effectiveDate')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Motivo del traspaso" />
        <div className="flex flex-col gap-1.5">
          <label className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Motivo <span className="ml-0.5 accent-text">*</span>
          </label>
          <textarea
            value={form.reason}
            placeholder="Ingresa el motivo del traspaso"
            rows={4}
            className={`r-md w-full resize-y border px-2.5 py-2 text-[13px] outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:placeholder:text-slate-500 ${
              errors.reason
                ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-400/30 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-200'
                : 'border-slate-200 bg-white text-slate-800 focus:border-[var(--accent-500)] dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100'
            }`}
            onChange={(e) => onChangeField('reason')(e.target.value)}
            onBlur={onValidation('reason')}
          />
          {errors.reason && (
            <p className="num text-[11px] text-rose-500 dark:text-rose-400">{errors.reason}</p>
          )}
        </div>
      </div>
    </section>
  )
}
