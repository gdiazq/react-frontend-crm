import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateProjectStatusForm } from '@/factories'

type ProjectStatusFormShape = typeof initialCreateProjectStatusForm
type ProjectStatusFormField = keyof ProjectStatusFormShape

interface ProjectStatusesFormDataSectionComponentProps {
  form: ProjectStatusFormShape
  errors: Partial<Record<ProjectStatusFormField, string>>
  onChangeField: (field: ProjectStatusFormField) => (value: string) => void
  onValidation: (field: ProjectStatusFormField) => () => void
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

export function ProjectStatusesFormDataSectionComponent(props: ProjectStatusesFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos de la vigencia" />
      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre vigencia proyecto"
            type="text"
            placeholder="Ingresa el nombre de la vigencia de proyecto"
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
            placeholder="Ingresa la descripción de la vigencia de proyecto"
            autoComplete="off"
            onValueChange={onChangeField('description')}
          />
        </div>
      </div>
    </section>
  )
}
