import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DropdownActionsMenuComponent } from '@/components/ui/dropdown/DropdownActionsMenuComponent'
import type { RequestDetailView } from '@/types'
import { resolveApprovalTone, type DropdownAction } from '@/utils'

interface RequestDetailComponentProps {
  detail: RequestDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onApprove?: () => void
  onReject?: () => void
  moreActions?: DropdownAction[]
}

export function RequestDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onApprove,
  onReject,
  moreActions,
}: RequestDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle de la solicitud..."
      emptyText="Selecciona una solicitud para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <RequestDetailContent
          detail={detail}
          onApprove={onApprove}
          onReject={onReject}
          moreActions={moreActions}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

interface RequestDetailContentProps {
  detail: RequestDetailView
  onApprove?: () => void
  onReject?: () => void
  moreActions?: DropdownAction[]
}

function RequestDetailContent({ detail, onApprove, onReject, moreActions }: RequestDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.statusName)
  const requiresApproval = /^s[ií]/i.test(detail.requireApprovalLabel.trim())
  const description = (
    <>
      Solicitud de <span className="num">{detail.requestTypeName || '—'}</span>, operación{' '}
      <span className="num">{detail.actionDisplay || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        eyebrowLabel="Solicitud"
        eyebrowId={detail.identification}
        displayName={detail.fullName}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.statusName || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={requiresApproval ? 'accent' : 'neutral'} dot>
              {requiresApproval ? 'Requiere aprobación' : 'Sin aprobación'}
            </DetailBadgeComponent>
          </>
        }
        actions={<HeroActionButtons onApprove={onApprove} onReject={onReject} moreActions={moreActions} />}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Solicitud" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent 
            title="Tipo de solicitud" 
            value={detail.requestTypeName} 
          />
          <DetailFieldCardComponent 
            title="Operación" 
            value={detail.actionDisplay} 
          />
          <DetailFieldCardComponent 
            title="Requiere aprobación" 
            value={detail.requireApprovalLabel} 
          />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Aprobación" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent 
            title="Aprobador" 
            value={detail.approverName} 
          />
          <DetailFieldCardComponent 
            title="Fecha aprobación" 
            value={detail.approvalDateDisplay} 
          />
          <DetailFieldCardComponent 
            title="Aprobador RRHH" 
            value={detail.hhrrApproverName} 
          />
          <DetailFieldCardComponent 
            title="Fecha aprobación RRHH" 
            value={detail.hhrrApprovalDateDisplay} 
          />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Rechazo" />
        {detail.rejectionDetailDisplay ? (
          <DetailFieldCardComponent
            title="Detalle de rechazo"
            value={detail.rejectionDetailDisplay}
            valueClassName="whitespace-pre-line"
          />
        ) : (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400">
            Sin motivo de rechazo registrado.
          </p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.createdAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Solicitud creada</p>
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
    </section>
  )
}

interface HeroActionButtonsProps {
  onApprove?: () => void
  onReject?: () => void
  moreActions?: DropdownAction[]
}

function HeroActionButtons({ onApprove, onReject, moreActions }: HeroActionButtonsProps) {
  const hasMoreActions = Boolean(moreActions?.length)
  const hasAnyAction = Boolean(onApprove || onReject || hasMoreActions)
  const secondaryBtn =
    'inline-flex items-center gap-1.5 r-md border border-slate-200 bg-white px-2.5 h-9 text-[12.5px] text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60'
  if (!hasAnyAction) return null
  return (
    <>
      {onReject && (
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center gap-1.5 r-md border border-rose-300 bg-white px-2.5 h-9 text-[12.5px] text-rose-700 hover:bg-rose-50 dark:border-rose-400/40 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-900/20"
        >
          Rechazar
        </button>
      )}
      {hasMoreActions && (
        <DropdownActionsMenuComponent actions={moreActions ?? []} triggerClassName={secondaryBtn} />
      )}
      {onApprove && (
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 r-md accent-bg h-9 px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
        >
          Aprobar
        </button>
      )}
    </>
  )
}
