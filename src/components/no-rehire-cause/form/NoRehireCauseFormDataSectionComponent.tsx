import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateNoRehireCauseForm } from '@/factories'

type NoRehireCauseFormShape = typeof initialCreateNoRehireCauseForm
type NoRehireCauseFormField = keyof NoRehireCauseFormShape

interface NoRehireCauseFormDataSectionComponentProps {
  form: NoRehireCauseFormShape
  errors: Partial<Record<NoRehireCauseFormField, string>>
  onChangeField: (field: NoRehireCauseFormField) => (value: string) => void
  onValidation: (field: NoRehireCauseFormField) => () => void
}

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
    </div>
  )
}

export function NoRehireCauseFormDataSectionComponent(props: NoRehireCauseFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos de no recontratación" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación de la causa" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre causa de no recontratación"
            type="text"
            placeholder="Ingresa el nombre de la causa de no recontratación"
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
            placeholder="Ingresa la descripción de la causa de no recontratación"
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
