import { DetailSectionHeaderComponent, SelectComponent } from '@/components'
import type { initialCreateProjectForm } from '@/factories'

type ProjectFormShape = typeof initialCreateProjectForm
type SelectOption = { label: string, value: string }

interface ProjectsFormClassificationSectionComponentProps {
  form: ProjectFormShape
  typeOptions: SelectOption[]
  statusOptions: SelectOption[]
  specialtyOptions: SelectOption[]
  loadingTypeOptions: boolean
  loadingStatusOptions: boolean
  loadingSpecialtyOptions: boolean
  onChangeField: (field: keyof ProjectFormShape) => (value: string) => void
}

export function ProjectsFormClassificationSectionComponent(props: ProjectsFormClassificationSectionComponentProps) {
  const {
    form,
    typeOptions,
    statusOptions,
    specialtyOptions,
    loadingTypeOptions,
    loadingStatusOptions,
    loadingSpecialtyOptions,
    onChangeField,
  } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="02" title="Clasificación" />
      <div className="grid gap-4 md:grid-cols-3">
        <SelectComponent
          value={form.typeId}
          label="Tipo de proyecto"
          options={typeOptions}
          loading={loadingTypeOptions}
          onValueChange={onChangeField('typeId')}
        />
        <SelectComponent
          value={form.statusId}
          label="Vigencia"
          options={statusOptions}
          loading={loadingStatusOptions}
          onValueChange={onChangeField('statusId')}
        />
        <SelectComponent
          value={form.specialtyId}
          label="Especialidad"
          options={specialtyOptions}
          loading={loadingSpecialtyOptions}
          onValueChange={onChangeField('specialtyId')}
        />
      </div>
    </section>
  )
}
