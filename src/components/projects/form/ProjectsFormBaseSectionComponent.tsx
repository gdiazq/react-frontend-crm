import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateProjectForm } from '@/factories'

type ProjectFormShape = typeof initialCreateProjectForm
type ProjectValidationField = Exclude<keyof ProjectFormShape, 'companyRepresentativeIds'>

interface ProjectsFormBaseSectionComponentProps {
  form: ProjectFormShape
  errors: Partial<Record<ProjectValidationField, string>>
  onChangeField: (field: keyof ProjectFormShape) => (value: string) => void
  onValidation: (field: ProjectValidationField) => () => void
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

export function ProjectsFormBaseSectionComponent(props: ProjectsFormBaseSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos básicos" />
      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación y ubicación" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.costCenter}
            label="Centro de costo"
            type="number"
            placeholder="Ingresa el centro de costo"
            error={errors.costCenter}
            onValueChange={onChangeField('costCenter')}
            onBlur={onValidation('costCenter')}
            required
          />
          <InputComponent
            value={form.name}
            label="Nombre"
            type="text"
            placeholder="Ingresa el nombre del proyecto"
            error={errors.name}
            onValueChange={onChangeField('name')}
            onBlur={onValidation('name')}
            required
          />
          <InputComponent
            value={form.address}
            label="Dirección"
            type="text"
            placeholder="Ingresa la dirección"
            onValueChange={onChangeField('address')}
          />
          <InputComponent
            value={form.description}
            label="Descripción"
            type="text"
            placeholder="Ingresa una descripción"
            onValueChange={onChangeField('description')}
          />
        </div>
      </div>
    </section>
  )
}
