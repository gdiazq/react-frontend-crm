import { DetailSectionHeaderComponent, SelectComponent } from '@/components'

interface PermissionSelectOption {
  value: string
  label: string
}

interface RolesFormPermissionsSectionComponentProps {
  values: string[]
  options: PermissionSelectOption[]
  error: string | null
  loading: boolean
  disabled: boolean
  onValuesChange: (values: string[]) => void
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

export function RolesFormPermissionsSectionComponent(props: RolesFormPermissionsSectionComponentProps) {
  const { values, options, error, loading, disabled, onValuesChange } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="02" title="Permisos" />
      <div className="space-y-3">
        <SubSectionLabel number="02.1" title="Accesos asociados" />
        <SelectComponent
          label="Permisos"
          multiple
          disabled={disabled}
          options={options}
          values={values}
          placeholder="Selecciona permisos"
          helperText="Selecciona al menos un permiso para este rol."
          error={error}
          loading={loading}
          onValuesChange={onValuesChange}
        />
      </div>
    </section>
  )
}
