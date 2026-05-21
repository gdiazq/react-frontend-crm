import { DetailSectionHeaderComponent } from '@/components'

const textareaClassName = 'r-md min-h-28 w-full resize-y border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--accent-400)] focus:ring-2 focus:ring-[color:var(--accent-400)]/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500'

interface SettlementFormAdditionalSectionComponentProps {
  sectionNumber: string
  observations: string
  onObservationsChange: (value: string) => void
}

export function SettlementFormAdditionalSectionComponent({ sectionNumber, observations, onObservationsChange }: SettlementFormAdditionalSectionComponentProps) {
  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number={sectionNumber} title="Datos adicionales" />
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Observaciones</label>
        <textarea
          value={observations}
          placeholder="Ingresa observaciones (opcional)"
          rows={4}
          className={textareaClassName}
          onChange={(event) => onObservationsChange(event.target.value)}
        />
      </div>
    </section>
  )
}
