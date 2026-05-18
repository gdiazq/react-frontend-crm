import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateProjectSpecialtyForm } from '@/factories'

type ProjectSpecialtyFormShape = typeof initialCreateProjectSpecialtyForm
type ProjectSpecialtyFormField = keyof ProjectSpecialtyFormShape

interface ProjectSpecialtiesFormDataSectionComponentProps {
  form: ProjectSpecialtyFormShape
  errors: Partial<Record<ProjectSpecialtyFormField, string>>
  onChangeField: (field: ProjectSpecialtyFormField) => (value: string) => void
  onValidation: (field: ProjectSpecialtyFormField) => () => void
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

export function ProjectSpecialtiesFormDataSectionComponent(props: ProjectSpecialtiesFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos de la especialidad" />
      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre especialidad proyecto"
            type="text"
            placeholder="Ingresa el nombre de la especialidad de proyecto"
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
            placeholder="Ingresa la descripción de la especialidad de proyecto"
            autoComplete="off"
            onValueChange={onChangeField('description')}
          />
        </div>
      </div>
    </section>
  )
}
