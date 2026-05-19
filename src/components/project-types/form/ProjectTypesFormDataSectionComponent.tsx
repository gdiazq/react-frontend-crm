import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateProjectTypeForm } from '@/factories'

type ProjectTypeFormShape = typeof initialCreateProjectTypeForm
type ProjectTypeFormField = keyof ProjectTypeFormShape

interface ProjectTypesFormDataSectionComponentProps {
  form: ProjectTypeFormShape
  errors: Partial<Record<ProjectTypeFormField, string>>
  onChangeField: (field: ProjectTypeFormField) => (value: string) => void
  onValidation: (field: ProjectTypeFormField) => () => void
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

export function ProjectTypesFormDataSectionComponent(props: ProjectTypesFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos del tipo" />
      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre tipo proyecto"
            type="text"
            placeholder="Ingresa el nombre del tipo de proyecto"
            autoComplete="off"
            error={errors.name}
            onValueChange={onChangeField('name')}
            onBlur={onValidation('name')}
            required
          />
          <InputComponent
            value={form.description}
            label="Descripción"
            type="text"
            placeholder="Ingresa la descripción del tipo de proyecto"
            autoComplete="off"
            onValueChange={onChangeField('description')}
          />
        </div>
      </div>
    </section>
  )
}
