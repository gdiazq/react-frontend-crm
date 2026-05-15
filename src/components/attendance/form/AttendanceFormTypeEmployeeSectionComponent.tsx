import {
  DetailSectionHeaderComponent,
  SelectComponent,
} from '@/components'
import type { initialAttendanceMarkForm } from '@/factories'

type AttendanceMarkFormShape = typeof initialAttendanceMarkForm
type AttendanceMarkFormField = keyof AttendanceMarkFormShape
type SelectOption = { label: string, value: string }

interface AttendanceFormTypeEmployeeSectionComponentProps {
  form: AttendanceMarkFormShape
  errors: Partial<Record<AttendanceMarkFormField, string>>
  isEditMode: boolean
  loadingAttendanceMarks: boolean
  editingMarkId: number | null
  markTypeOptions: SelectOption[]
  employeeOptions: SelectOption[]
  attendanceStatusOptions: SelectOption[]
  loadingMarkTypeOptions: boolean
  loadingEmployeeOptions: boolean
  loadingAttendanceFormOptions: boolean
  onChangeMarkType: (value: string) => void
  onChangeEmployee: (value: string) => void
  onChangeField: (field: AttendanceMarkFormField) => (value: string) => void
  onValidation: (field: AttendanceMarkFormField) => () => void
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

export function AttendanceFormTypeEmployeeSectionComponent(props: AttendanceFormTypeEmployeeSectionComponentProps) {
  const {
    form,
    errors,
    isEditMode,
    loadingAttendanceMarks,
    editingMarkId,
    markTypeOptions,
    employeeOptions,
    attendanceStatusOptions,
    loadingMarkTypeOptions,
    loadingEmployeeOptions,
    loadingAttendanceFormOptions,
    onChangeMarkType,
    onChangeEmployee,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Tipo y trabajador" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Tipo de marca" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.markType}
            label="Tipo de marca"
            options={markTypeOptions}
            loading={loadingMarkTypeOptions}
            error={errors.markType}
            onValueChange={onChangeMarkType}
            onValidation={onValidation('markType')}
            required
          />
        </div>
        {isEditMode && !loadingAttendanceMarks && form.markType && editingMarkId == null && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Esta asistencia aún no tiene una marca de este tipo. Se creará una nueva.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Relación laboral" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={employeeOptions}
            loading={loadingEmployeeOptions}
            error={errors.employeeId}
            onValueChange={onChangeEmployee}
            onValidation={onValidation('employeeId')}
            disabled={!form.markType}
            required
          />
          {!isEditMode && (
            <SelectComponent
              value={form.statusId}
              label="Estado de asistencia"
              options={attendanceStatusOptions}
              loading={loadingAttendanceFormOptions}
              onValueChange={onChangeField('statusId')}
              disabled={!form.markType}
            />
          )}
        </div>
      </div>
    </section>
  )
}
