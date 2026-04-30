import { type ReactNode, useState } from 'react'
import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DetailSectionDropdownComponent } from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { SettlementDetailView } from '@/types'
import { resolveApprovalTone } from '@/utils'

interface SettlementDetailComponentProps {
  detail: SettlementDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
  onDownloadDocument?: (fileId: number) => void
}

type SettlementDetailTabKey = 'general' | 'conditions' | 'quiz' | 'documents' | 'dates'

interface SettlementDetailContentProps {
  detail: SettlementDetailView
  activeTab: SettlementDetailTabKey
  onTabChange: (tab: SettlementDetailTabKey) => void
  onEdit?: () => void
  onDownloadDocument?: (fileId: number) => void
}

export function SettlementDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
  onDownloadDocument,
}: SettlementDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<SettlementDetailTabKey>('general')

  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del acuerdo de término..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <SettlementDetailContent
          detail={detail}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEdit={onEdit}
          onDownloadDocument={onDownloadDocument}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

function SettlementDetailContent({
  detail,
  activeTab,
  onTabChange,
  onEdit,
  onDownloadDocument,
}: SettlementDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.statusDisplay)
  const rehireEligible = detail.rehireEligibleDisplay === 'Si'
  const description = (
    <>
      Finiquito programado para el <span className="num">{detail.endDateDisplay || '—'}</span> por{' '}
      <span className="num">{detail.legalTerminationCauseNameDisplay || '—'}</span>.
    </>
  )
  const tabSelectOptions = [
    { value: 'general', label: 'Información general' },
    { value: 'conditions', label: 'Condiciones de término' },
    { value: 'quiz', label: 'Quiz de salida' },
    { value: 'documents', label: 'Adjuntos' },
    { value: 'dates', label: 'Fechas' },
  ]

  const renderTabContent = (): ReactNode => {
    if (activeTab === 'general') {
      return (
        <section>
          <DetailSectionHeaderComponent number="01" title="Información general" />
          <div className="grid gap-x-10 md:grid-cols-2">
            <DetailFieldCardComponent title="Trabajador" value={detail.employeeFullNameDisplay} />
            <DetailFieldCardComponent title="Identificación" value={detail.employeeIdentificationDisplay} mono />
          </div>
          {detail.observationsDisplay !== '-' && (
            <div className="mt-3">
              <DetailFieldCardComponent
                title="Observaciones"
                value={detail.observationsDisplay}
                valueClassName="whitespace-pre-line"
              />
            </div>
          )}
        </section>
      )
    }

    if (activeTab === 'conditions') {
      return (
        <section>
          <DetailSectionHeaderComponent number="02" title="Condiciones" />
          <div className="grid gap-x-10 md:grid-cols-2">
            <DetailFieldCardComponent title="Causa legal" value={detail.legalTerminationCauseNameDisplay} />
            <DetailFieldCardComponent title="Calidad del trabajo" value={detail.qualityOfWorkNameDisplay} />
            <DetailFieldCardComponent title="Cumplimiento seguridad" value={detail.safetyComplianceNameDisplay} />
            <DetailFieldCardComponent title="Recontratable" value={detail.rehireEligibleDisplay} />
            {detail.noReHiredCauseNameDisplay !== '-' && (
              <DetailFieldCardComponent title="Causa no recontratación" value={detail.noReHiredCauseNameDisplay} />
            )}
          </div>
        </section>
      )
    }

    if (activeTab === 'documents') {
      if (detail.documents.length === 0) {
        return (
          <section>
            <DetailSectionHeaderComponent number="04" title="Adjuntos" />
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Sin adjuntos.</p>
          </section>
        )
      }
      return (
        <section>
          <DetailSectionHeaderComponent number="04" title="Adjuntos" />
          <ul className="space-y-2">
            {detail.documents.map((file) => (
              <li
                key={file.id}
                className="r-lg flex items-center justify-between gap-3 border border-slate-200 px-3 py-2 dark:border-white/10"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-slate-800 dark:text-slate-100">{file.fileName}</p>
                  <p className="num text-[11px] text-slate-400 dark:text-slate-500">{file.sizeDisplay}</p>
                </div>
                <button
                  type="button"
                  disabled={!onDownloadDocument}
                  onClick={() => onDownloadDocument?.(file.id)}
                  className="inline-flex cursor-pointer items-center r-full bg-emerald-100 px-3 py-1 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                >
                  Descargar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )
    }

    if (activeTab === 'quiz') {
      if (detail.quizAnswers.length === 0) {
        return (
          <section>
            <DetailSectionHeaderComponent number="03" title="Quiz de salida" />
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Sin respuestas del quiz de salida.</p>
          </section>
        )
      }

      const groupedQuizAnswers: Array<{ groupName: string; answers: typeof detail.quizAnswers }> = []
      detail.quizAnswers.forEach((quizAnswer) => {
        const group = groupedQuizAnswers.find((item) => item.groupName === quizAnswer.questionGroupNameDisplay)
        if (group) {
          group.answers.push(quizAnswer)
          return
        }
        groupedQuizAnswers.push({
          groupName: quizAnswer.questionGroupNameDisplay,
          answers: [quizAnswer],
        })
      })

      return (
        <section>
          <DetailSectionHeaderComponent number="03" title="Quiz de salida" />
          <div className="space-y-4">
            {groupedQuizAnswers.map((group, index) => (
              <article key={group.groupName} className="r-lg border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/30">
                <div className="mb-3 flex items-center gap-3">
                  <span className="num text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-600)] dark:text-[color:var(--accent-300)]">
                    03.{index + 1}
                  </span>
                  <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {group.groupName}
                  </h3>
                </div>
                <div className="space-y-3">
                  {group.answers.map((quizAnswer) => (
                    <article key={quizAnswer.questionId} className="r-md border border-slate-200 p-3 dark:border-white/10">
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">{quizAnswer.questionTextDisplay}</p>
                      <p className="mt-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300">{quizAnswer.answerDisplay}</p>
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )
    }

    return (
      <section>
        <DetailSectionHeaderComponent number="05" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.createdAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Finiquito creado</p>
            </div>
          </li>
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.endDateDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Fecha de término</p>
            </div>
          </li>
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.updatedAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Última actualización</p>
            </div>
          </li>
        </ol>
      </section>
    )
  }

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        eyebrowLabel="Finiquito"
        eyebrowId={detail.employeeIdentificationDisplay}
        displayName={detail.employeeFullNameDisplay}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.statusDisplay || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={rehireEligible ? 'ok' : 'bad'} dot>
              {rehireEligible ? 'Recontratable' : 'No recontratable'}
            </DetailBadgeComponent>
          </>
        }
        actions={<HeroActionButtons onEdit={onEdit} />}
      />

      <article className="r-lg border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Sección"
          options={tabSelectOptions}
          onValueChange={(value) => onTabChange(value as SettlementDetailTabKey)}
        />
      </article>

      <article>
        {renderTabContent()}
      </article>
    </section>
  )
}

function HeroActionButtons({ onEdit }: { onEdit?: () => void }) {
  if (!onEdit) return null

  return (
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex items-center gap-1.5 r-md accent-bg h-9 px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
    >
      <IconEdit />
      Editar
    </button>
  )
}
