import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateRoleForm } from '@/factories'

type RoleFormShape = typeof initialCreateRoleForm
type RoleFormField = keyof RoleFormShape

interface RolesFormDataSectionComponentProps {
  form: RoleFormShape
  errors: Partial<Record<RoleFormField, string>>
  onChangeField: (field: RoleFormField) => (value: string) => void
  onValidation: (field: RoleFormField) => () => void
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

export function RolesFormDataSectionComponent(props: RolesFormDataSectionComponentProps) {
  const { form, errors, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos del rol" />
      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Identificación" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.name}
            label="Nombre del rol"
            type="text"
            placeholder="Ingresa el nombre del rol"
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
            placeholder="Ingresa la descripción"
            autoComplete="off"
            onValueChange={onChangeField('description')}
          />
        </div>
      </div>
    </section>
  )
}
