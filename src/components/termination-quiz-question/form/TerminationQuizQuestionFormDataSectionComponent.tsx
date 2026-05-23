import { DetailSectionHeaderComponent, InputComponent, SelectComponent } from '@/components'
import type { TerminationQuizQuestionCreateForm } from '@/types'

interface TerminationQuizQuestionSelectOption {
  label: string
  value: string
}

interface TerminationQuizQuestionFormDataSectionComponentProps {
  form: TerminationQuizQuestionCreateForm
  errors: Partial<Record<keyof TerminationQuizQuestionCreateForm, string>>
  employeeOptions: TerminationQuizQuestionSelectOption[]
  loadingEmployeeOptions: boolean
  onChangeField: (field: keyof TerminationQuizQuestionCreateForm) => (value: string) => void
  onValidation: (field: keyof TerminationQuizQuestionCreateForm) => () => void
}

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
    </div>
  )
}

function RequiredOption({ selected, label, onSelect }: { selected: boolean, label: string, onSelect: () => void }) {
  return (
    <label
      className={`r-full inline-flex h-9 cursor-pointer items-center gap-2 border px-3 text-[12.5px] font-medium transition ${
        selected
          ? 'border-[color:var(--accent-400)] accent-bg-soft accent-text'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-white/20'
      }`}
    >
      <input
        type="radio"
        name="required"
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span className={`h-1.5 w-1.5 r-full ${selected ? 'accent-bg' : 'bg-slate-300 dark:bg-slate-600'}`} />
      {label}
    </label>
  )
}

export function TerminationQuizQuestionFormDataSectionComponent(props: TerminationQuizQuestionFormDataSectionComponentProps) {
  const { form, errors, employeeOptions, loadingEmployeeOptions, onChangeField, onValidation } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos de la pregunta" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Contenido" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.question}
            label="Pregunta"
            type="text"
            placeholder="Ingresa el texto de la pregunta"
            autoComplete="off"
            error={errors.question}
            onValueChange={onChangeField('question')}
            onBlur={onValidation('question')}
            required
          />
          <InputComponent
            value={form.questionGroup}
            label="Grupo de pregunta"
            type="text"
            placeholder="Ingresa el grupo de pregunta"
            error={errors.questionGroup}
            onValueChange={onChangeField('questionGroup')}
            onBlur={onValidation('questionGroup')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Alcance y obligatoriedad" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="Empleado"
            options={employeeOptions}
            disabled={loadingEmployeeOptions}
            onValueChange={onChangeField('employeeId')}
          />

          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Requerida
            </label>
            <div className="flex flex-wrap gap-2">
              <RequiredOption selected={form.required === 'true'} label="Sí" onSelect={() => onChangeField('required')('true')} />
              <RequiredOption selected={form.required === 'false'} label="No" onSelect={() => onChangeField('required')('false')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
