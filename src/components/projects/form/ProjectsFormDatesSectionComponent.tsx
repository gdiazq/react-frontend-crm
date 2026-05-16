import { DatePickerComponent, DetailSectionHeaderComponent } from '@/components'
import type { initialCreateProjectForm } from '@/factories'

type ProjectFormShape = typeof initialCreateProjectForm

interface ProjectsFormDatesSectionComponentProps {
  form: ProjectFormShape
  onChangeField: (field: keyof ProjectFormShape) => (value: string) => void
}

export function ProjectsFormDatesSectionComponent(props: ProjectsFormDatesSectionComponentProps) {
  const { form, onChangeField } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="04" title="Fechas" />
      <div className="grid gap-4 md:grid-cols-2">
        <DatePickerComponent value={form.startDate} label="Fecha inicio" onValueChange={onChangeField('startDate')} />
        <DatePickerComponent value={form.realStartDate} label="Fecha inicio real" onValueChange={onChangeField('realStartDate')} />
        <DatePickerComponent value={form.endDate} label="Fecha fin" onValueChange={onChangeField('endDate')} />
        <DatePickerComponent value={form.realEndDate} label="Fecha fin real" onValueChange={onChangeField('realEndDate')} />
      </div>
    </section>
  )
}
