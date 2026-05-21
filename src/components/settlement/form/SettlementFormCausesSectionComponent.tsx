import { DetailSectionHeaderComponent, SelectComponent } from '@/components'
import { initialCreateSettlementForm } from '@/factories'

type SettlementFormShape = typeof initialCreateSettlementForm
type SettlementFormField = keyof SettlementFormShape
type SelectOption = { label: string, value: string }

interface SettlementFormCausesSectionComponentProps {
  form: SettlementFormShape
  errors: Partial<Record<SettlementFormField, string>>
  legalTerminationCauseOptions: SelectOption[]
  qualityOfWorkOptions: SelectOption[]
  safetyComplianceOptions: SelectOption[]
  noRehireCauseOptions: SelectOption[]
  onChangeField: (field: SettlementFormField) => (value: string) => void
  onValidation: (field: SettlementFormField) => () => void
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

export function SettlementFormCausesSectionComponent({
  form,
  errors,
  legalTerminationCauseOptions,
  qualityOfWorkOptions,
  safetyComplianceOptions,
  noRehireCauseOptions,
  onChangeField,
  onValidation,
}: SettlementFormCausesSectionComponentProps) {
  return (
    <section className="space-y-6">
      <DetailSectionHeaderComponent number="02" title="Causas del finiquito" />
      <div className="space-y-3">
        <SubSectionLabel number="02.1" title="Evaluación de salida" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.legalTerminationCauseId}
            label="Causa terminación"
            options={legalTerminationCauseOptions}
            error={errors.legalTerminationCauseId}
            onValueChange={onChangeField('legalTerminationCauseId')}
            onValidation={onValidation('legalTerminationCauseId')}
            required
          />

          <SelectComponent
            value={form.qualityOfWorkId}
            label="Calidad del trabajo"
            options={qualityOfWorkOptions}
            error={errors.qualityOfWorkId}
            onValueChange={onChangeField('qualityOfWorkId')}
            onValidation={onValidation('qualityOfWorkId')}
            required
          />

          <SelectComponent
            value={form.safetyComplianceId}
            label="Cumplimiento seguridad"
            options={safetyComplianceOptions}
            error={errors.safetyComplianceId}
            onValueChange={onChangeField('safetyComplianceId')}
            onValidation={onValidation('safetyComplianceId')}
            required
          />

          {form.rehireEligible === 'false' && (
            <SelectComponent
              value={form.noReHiredCauseId}
              label="Causa no recontratación"
              options={noRehireCauseOptions}
              onValueChange={onChangeField('noReHiredCauseId')}
            />
          )}
        </div>
      </div>
    </section>
  )
}
