import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateSafetyComplianceForm } from '@/factories'

type SafetyComplianceFormShape = typeof initialCreateSafetyComplianceForm
type SafetyComplianceFormField = keyof SafetyComplianceFormShape

interface SafetyComplianceFormDataSectionComponentProps {
  form: SafetyComplianceFormShape
  errors: Partial<Record<SafetyComplianceFormField, string>>
  onChangeField: (field: SafetyComplianceFormField) => (value: string) => void
  onValidation: (field: SafetyComplianceFormField) => () => void
}

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
    </div>
  )
}

export function SafetyComplianceFormDataSectionComponent(props: SafetyComplianceFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos de seguridad" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación del cumplimiento" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre cumplimiento de seguridad"
            type="text"
            placeholder="Ingresa el nombre del cumplimiento de seguridad"
            autoComplete="off"
            error={errors.name}
            onValueChange={onChangeField('name')}
            onBlur={onValidation('name')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Descripción operativa" />
        <div className="space-y-1.5">
          <label className="block text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Descripción
          </label>
          <textarea
            value={form.description}
            placeholder="Ingresa la descripción del cumplimiento de seguridad"
            autoComplete="off"
            rows={5}
            className="r-md min-h-28 w-full resize-y border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--accent-400)] focus:ring-2 focus:ring-[color:var(--accent-400)]/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
            onChange={(event) => onChangeField('description')(event.target.value)}
          />
        </div>
      </div>
    </section>
  )
}
