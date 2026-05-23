import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateQualityOfWorkForm } from '@/factories'

type QualityOfWorkFormShape = typeof initialCreateQualityOfWorkForm
type QualityOfWorkFormField = keyof QualityOfWorkFormShape

interface QualityOfWorkFormDataSectionComponentProps {
  form: QualityOfWorkFormShape
  errors: Partial<Record<QualityOfWorkFormField, string>>
  onChangeField: (field: QualityOfWorkFormField) => (value: string) => void
  onValidation: (field: QualityOfWorkFormField) => () => void
}

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
    </div>
  )
}

export function QualityOfWorkFormDataSectionComponent(props: QualityOfWorkFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos de calidad" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación del registro" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre calidad del trabajo"
            type="text"
            placeholder="Ingresa el nombre de la calidad del trabajo"
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
            placeholder="Ingresa la descripción de la calidad del trabajo"
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
