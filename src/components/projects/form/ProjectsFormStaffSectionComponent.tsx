import { DetailSectionHeaderComponent, SelectComponent } from '@/components'
import type { initialCreateProjectForm } from '@/factories'

type ProjectFormShape = typeof initialCreateProjectForm
type SelectOption = { label: string, value: string }

interface ProjectsFormStaffSectionComponentProps {
  form: ProjectFormShape
  visitorOptions: SelectOption[]
  supervisorOptions: SelectOption[]
  representativeOptions: SelectOption[]
  loadingVisitorOptions: boolean
  loadingSupervisorOptions: boolean
  loadingRepresentativeOptions: boolean
  onChangeField: (field: keyof ProjectFormShape) => (value: string) => void
  onRepresentativesChange: (values: string[]) => void
}

export function ProjectsFormStaffSectionComponent(props: ProjectsFormStaffSectionComponentProps) {
  const {
    form,
    visitorOptions,
    supervisorOptions,
    representativeOptions,
    loadingVisitorOptions,
    loadingSupervisorOptions,
    loadingRepresentativeOptions,
    onChangeField,
    onRepresentativesChange,
  } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="03" title="Personal asignado" />
      <div className="grid gap-4 md:grid-cols-3">
        <SelectComponent
          value={form.visitorId}
          label="Visitador"
          options={visitorOptions}
          loading={loadingVisitorOptions}
          onValueChange={onChangeField('visitorId')}
        />
        <SelectComponent
          value={form.supervisorId}
          label="Supervisor"
          options={supervisorOptions}
          loading={loadingSupervisorOptions}
          onValueChange={onChangeField('supervisorId')}
        />
        <SelectComponent
          values={form.companyRepresentativeIds}
          label="Representantes de empresa"
          options={representativeOptions}
          loading={loadingRepresentativeOptions}
          multiple
          onValuesChange={onRepresentativesChange}
        />
      </div>
    </section>
  )
}
