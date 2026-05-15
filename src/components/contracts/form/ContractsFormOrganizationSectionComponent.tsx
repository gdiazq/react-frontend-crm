import { DetailSectionHeaderComponent, SelectComponent } from '@/components'
import type { initialCreateContractForm } from '@/factories'

type ContractFormShape = typeof initialCreateContractForm
type ContractFormField = keyof ContractFormShape
type SelectOption = { label: string, value: string }

interface ContractsFormOrganizationSectionComponentProps {
  form: ContractFormShape
  errors: Partial<Record<ContractFormField, string>>
  companyOptions: SelectOption[]
  zoneOptions: SelectOption[]
  jobTitleOptions: SelectOption[]
  siteOptions: SelectOption[]
  laborUnionOptions: SelectOption[]
  onChangeField: (field: ContractFormField) => (value: string) => void
  onValidation: (field: ContractFormField) => () => void
}

export function ContractsFormOrganizationSectionComponent(props: ContractsFormOrganizationSectionComponentProps) {
  const {
    form,
    errors,
    companyOptions,
    zoneOptions,
    jobTitleOptions,
    siteOptions,
    laborUnionOptions,
    onChangeField,
    onValidation,
  } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="03" title="Organización y ubicación" />
      <div className="grid gap-4 md:grid-cols-3">
        <SelectComponent
          value={form.companyId}
          label="Empresa"
          options={companyOptions}
          error={errors.companyId}
          onValueChange={onChangeField('companyId')}
          onValidation={onValidation('companyId')}
          required
        />
        <SelectComponent
          value={form.zoneId}
          label="Zona"
          options={zoneOptions}
          error={errors.zoneId}
          onValueChange={onChangeField('zoneId')}
          onValidation={onValidation('zoneId')}
          required
        />
        <SelectComponent
          value={form.jobTitleId}
          label="Cargo"
          options={jobTitleOptions}
          error={errors.jobTitleId}
          onValueChange={onChangeField('jobTitleId')}
          onValidation={onValidation('jobTitleId')}
          required
        />
        <SelectComponent
          value={form.siteId}
          label="Sede"
          options={siteOptions}
          error={errors.siteId}
          onValueChange={onChangeField('siteId')}
          onValidation={onValidation('siteId')}
          required
        />
        <SelectComponent
          value={form.laborUnionId}
          label="Sindicato"
          options={laborUnionOptions}
          error={errors.laborUnionId}
          onValueChange={onChangeField('laborUnionId')}
          onValidation={onValidation('laborUnionId')}
          required
        />
      </div>
    </section>
  )
}
