import {
  DatePickerComponent,
  DetailSectionHeaderComponent,
  InputComponent,
  SelectComponent,
} from '@/components'
import type { LeaveCreateForm, LeaveFormField, LeaveFormSelectOption } from '@/types'

interface LeavesFormDataSectionComponentProps {
  form: LeaveCreateForm
  errors: Partial<Record<LeaveFormField, string>>
  dateRangeError: string | null
  isEditMode: boolean
  employeeOptions: LeaveFormSelectOption[]
  leaveTypeOptions: LeaveFormSelectOption[]
  halfDayOptions: LeaveFormSelectOption[]
  loadingFormOptions: boolean
  onChangeField: (field: LeaveFormField) => (value: string) => void
  onValidation: (field: LeaveFormField) => () => void
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

export function LeavesFormDataSectionComponent(props: LeavesFormDataSectionComponentProps) {
  const {
    form,
    errors,
    dateRangeError,
    isEditMode,
    employeeOptions,
    leaveTypeOptions,
    halfDayOptions,
    loadingFormOptions,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos del permiso" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Relación contractual" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={employeeOptions}
            loading={loadingFormOptions}
            error={errors.employeeId}
            disabled={isEditMode}
            onValueChange={onChangeField('employeeId')}
            onValidation={onValidation('employeeId')}
            required
          />
          <SelectComponent
            value={form.leaveTypeId}
            label="Tipo de permiso"
            options={leaveTypeOptions}
            loading={loadingFormOptions}
            error={errors.leaveTypeId}
            onValueChange={onChangeField('leaveTypeId')}
            onValidation={onValidation('leaveTypeId')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Vigencia" />
        <div className="grid gap-4 md:grid-cols-3">
          <DatePickerComponent
            value={form.startDate}
            label="Inicio"
            error={errors.startDate || dateRangeError}
            onValueChange={onChangeField('startDate')}
            onValidation={onValidation('startDate')}
            required
          />
          <DatePickerComponent
            value={form.endDate}
            label="Fin"
            error={errors.endDate || dateRangeError}
            onValueChange={onChangeField('endDate')}
            onValidation={onValidation('endDate')}
            required
          />
          <SelectComponent
            value={form.halfDay}
            label="Medio día"
            options={halfDayOptions}
            error={errors.halfDay}
            onValueChange={onChangeField('halfDay')}
            onValidation={onValidation('halfDay')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.3" title="Motivo" />
        <InputComponent
          value={form.reason}
          label="Motivo"
          type="text"
          placeholder="Ej: Licencia médica"
          error={errors.reason}
          onValueChange={onChangeField('reason')}
          onBlur={onValidation('reason')}
          required
        />
      </div>
    </section>
  )
}
