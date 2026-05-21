import { AlertMessageComponent, DetailSectionHeaderComponent } from '@/components'
import type { SettlementQuizQuestionGroup } from '@/types'

const textareaClassName = 'r-md min-h-28 w-full resize-y border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--accent-400)] focus:ring-2 focus:ring-[color:var(--accent-400)]/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500'

interface SettlementFormQuizSectionComponentProps {
  groups: SettlementQuizQuestionGroup[]
  answersByQuestionId: Record<number, string>
  loading: boolean
  errorMessage: string | null
  onAnswerChange: (questionId: number, value: string) => void
  onClearError: () => void
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

export function SettlementFormQuizSectionComponent({
  groups,
  answersByQuestionId,
  loading,
  errorMessage,
  onAnswerChange,
  onClearError,
}: SettlementFormQuizSectionComponentProps) {
  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="03" title="Quiz de salida" />
      {errorMessage && <AlertMessageComponent message={errorMessage} tone="error" onClose={onClearError} />}
      {loading && <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando preguntas del quiz de salida...</p>}
      {!loading && groups.length === 0 && (
        <p className="text-[13px] text-slate-600 dark:text-slate-300">No hay preguntas configuradas para este trabajador.</p>
      )}
      {!loading && groups.length > 0 && (
        <div className="space-y-5">
          {groups.map((group, index) => (
            <article key={group.groupId} className="r-lg space-y-3 border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/30">
              <SubSectionLabel number={`03.${index + 1}`} title={group.groupName} />
              <div className="grid gap-4">
                {group.questions.map((question) => (
                  <div key={question.id} className="flex flex-col gap-1">
                    <label htmlFor={`settlement-quiz-answer-${question.id}`} className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                      {question.name}
                    </label>
                    <textarea
                      id={`settlement-quiz-answer-${question.id}`}
                      value={answersByQuestionId[question.id] || ''}
                      placeholder="Ingresa tu respuesta"
                      rows={3}
                      className={textareaClassName}
                      onChange={(event) => onAnswerChange(question.id, event.target.value)}
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
