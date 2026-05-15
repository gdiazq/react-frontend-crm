import {
  DetailSectionHeaderComponent,
  InputComponent,
  SelectComponent,
} from '@/components'
import type { initialCreateContractForm } from '@/factories'

type ContractFormShape = typeof initialCreateContractForm
type ContractFormField = keyof ContractFormShape
type SelectOption = { label: string, value: string }

interface ContractsFormBaseSectionComponentProps {
  form: ContractFormShape
  errors: Partial<Record<ContractFormField, string>>
  isEditMode: boolean
  employeeOptions: SelectOption[]
  contractTypeOptions: SelectOption[]
  safetyGroupOptions: SelectOption[]
  onChangeField: (field: ContractFormField) => (value: string) => void
  onValidation: (field: ContractFormField) => () => void
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

export function ContractsFormBaseSectionComponent(props: ContractsFormBaseSectionComponentProps) {
  const {
    form,
    errors,
    isEditMode,
    employeeOptions,
    contractTypeOptions,
    safetyGroupOptions,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="01" title="Datos base" />

      <div className="space-y-3">
        <SubSectionLabel number="01.1" title="Trabajador y folio" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={employeeOptions}
            error={errors.employeeId}
            disabled={isEditMode}
            onValueChange={onChangeField('employeeId')}
            onValidation={onValidation('employeeId')}
            required
          />
          <InputComponent
            value={form.name}
            label="Nombre contrato"
            type="text"
            placeholder="Ingresa el nombre del contrato"
            error={errors.name}
            onValueChange={onChangeField('name')}
            onBlur={onValidation('name')}
            required
          />
          <InputComponent
            value={form.contractNumber}
            label="Número contrato"
            type="text"
            placeholder="Ingresa el número de contrato"
            error={errors.contractNumber}
            onValueChange={onChangeField('contractNumber')}
            onBlur={onValidation('contractNumber')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubSectionLabel number="01.2" title="Clasificación" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.contractTypeId}
            label="Tipo contrato"
            options={contractTypeOptions}
            error={errors.contractTypeId}
            onValueChange={onChangeField('contractTypeId')}
            onValidation={onValidation('contractTypeId')}
            required
          />
          <SelectComponent
            value={form.safetyGroupId}
            label="Agrupación seguridad"
            options={safetyGroupOptions}
            error={errors.safetyGroupId}
            onValueChange={onChangeField('safetyGroupId')}
            onValidation={onValidation('safetyGroupId')}
            required
          />
        </div>
      </div>
    </section>
  )
}
