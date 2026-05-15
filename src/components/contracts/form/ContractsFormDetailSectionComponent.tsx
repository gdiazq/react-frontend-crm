import { DetailSectionHeaderComponent, InputComponent } from '@/components'
import type { initialCreateContractForm } from '@/factories'

type ContractFormShape = typeof initialCreateContractForm
type ContractFormField = keyof ContractFormShape

interface ContractsFormDetailSectionComponentProps {
  form: ContractFormShape
  onChangeField: (field: ContractFormField) => (value: string) => void
}

export function ContractsFormDetailSectionComponent(props: ContractsFormDetailSectionComponentProps) {
  const { form, onChangeField } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="04" title="Detalle" />
      <InputComponent
        value={form.contractDetail}
        label="Detalle del contrato"
        type="text"
        placeholder="Ingresa el detalle del contrato"
        onValueChange={onChangeField('contractDetail')}
      />
    </section>
  )
}
