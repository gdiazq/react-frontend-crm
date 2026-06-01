import {
  DetailSectionHeaderComponent,
  InputComponent,
  SelectComponent,
} from '@/components'
import type { OvertimeCreateForm, OvertimeFormField, OvertimeFormSelectOption } from '@/types'

interface OvertimeFormEmployeeTypeSectionComponentProps {
  form: OvertimeCreateForm
  errors: Partial<Record<OvertimeFormField, string>>
  isEditMode: boolean
  editEmployeeLabel: string
  employeeOptions: OvertimeFormSelectOption[]
  overtimeTypeOptions: OvertimeFormSelectOption[]
  loadingEmployees: boolean
  loadingOvertimeTypes: boolean
  onChangeField: (field: OvertimeFormField) => (value: string) => void
  onValidation: (field: OvertimeFormField) => () => void
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

export function OvertimeFormEmployeeTypeSectionComponent(props: OvertimeFormEmployeeTypeSectionComponentProps) {
  const {
    form,
    errors,
    isEditMode,
    editEmployeeLabel,
    employeeOptions,
    overtimeTypeOptions,
    loadingEmployees,
    loadingOvertimeTypes,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Trabajador y tipo" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Relación laboral" />
        <div className="grid gap-4 md:grid-cols-2">
          {isEditMode ? (
            <InputComponent value={editEmployeeLabel} label="Trabajador" disabled />
          ) : (
            <SelectComponent
              value={form.employeeId}
              label="Trabajador"
              options={employeeOptions}
              loading={loadingEmployees}
              error={errors.employeeId}
              onValueChange={onChangeField('employeeId')}
              onValidation={onValidation('employeeId')}
              required
            />
          )}
          <SelectComponent
            value={form.overtimeTypeId}
            label="Tipo de hora extra"
            options={overtimeTypeOptions}
            loading={loadingOvertimeTypes}
            error={errors.overtimeTypeId}
            onValueChange={onChangeField('overtimeTypeId')}
            onValidation={onValidation('overtimeTypeId')}
            required
          />
        </div>
      </div>
    </section>
  )
}
