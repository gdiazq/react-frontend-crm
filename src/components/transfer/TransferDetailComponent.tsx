import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DropdownActionsMenuComponent } from '@/components/ui/dropdown/DropdownActionsMenuComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { TransferDetailView } from '@/types'
import type { DropdownAction } from '@/utils'
import { resolveApprovalTone } from '@/utils'

interface TransferDetailComponentProps {
  detail: TransferDetailView | null
  loading: boolean
  errorMessage: string | null
  deletingDocumentId: number | null
  onRetry?: () => void
  onDeleteDocument: (fileId: number) => void
  onEdit?: () => void
  moreActions?: DropdownAction[]
}

export function TransferDetailComponent({
  detail,
  loading,
  errorMessage,
  deletingDocumentId,
  onRetry,
  onDeleteDocument,
  onEdit,
  moreActions,
}: TransferDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del traspaso..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <TransferDetailContent
          detail={detail}
          deletingDocumentId={deletingDocumentId}
          onDeleteDocument={onDeleteDocument}
          onEdit={onEdit}
          moreActions={moreActions}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

interface TransferDetailContentProps {
  detail: TransferDetailView
  deletingDocumentId: number | null
  onDeleteDocument: (fileId: number) => void
  onEdit?: () => void
  moreActions?: DropdownAction[]
}

function TransferDetailContent({
  detail,
  deletingDocumentId,
  onDeleteDocument,
  onEdit,
  moreActions,
}: TransferDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.statusDisplay)
  const description = (
    <>
      Traslado desde <span className="num">{detail.fromCostCenterNameDisplay || '—'}</span> a{' '}
      <span className="num">{detail.toCostCenterNameDisplay || '—'}</span>, efectivo el{' '}
      <span className="num">{detail.effectiveDateDisplay || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        eyebrowLabel="Traspaso"
        eyebrowId={detail.employeeIdentificationDisplay}
        displayName={detail.employeeFullNameDisplay}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.statusDisplay || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.hrRequestIdDisplay && detail.hrRequestIdDisplay !== '-' ? 'accent' : 'neutral'} dot>
              {detail.hrRequestIdDisplay && detail.hrRequestIdDisplay !== '-'
                ? `Solicitud RRHH #${detail.hrRequestIdDisplay}`
                : 'Sin solicitud vinculada'}
            </DetailBadgeComponent>
          </>
        }
        actions={<HeroActionButtons onEdit={onEdit} moreActions={moreActions} />}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Traspaso" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Trabajador" value={detail.employeeFullNameDisplay} />
          <DetailFieldCardComponent title="Identificación" value={detail.employeeIdentificationDisplay} mono />
          <DetailFieldCardComponent title="Centro origen" value={detail.fromCostCenterNameDisplay} />
          <DetailFieldCardComponent title="Centro destino" value={detail.toCostCenterNameDisplay} />
          <DetailFieldCardComponent title="Fecha efectiva" value={detail.effectiveDateDisplay} mono />
          {detail.hrRequestIdDisplay && detail.hrRequestIdDisplay !== '-' && (
            <DetailFieldCardComponent title="Solicitud RRHH" value={detail.hrRequestIdDisplay} mono />
          )}
        </div>
        <div className="mt-3">
          <DetailFieldCardComponent
            title="Motivo"
            value={detail.reasonDisplay}
            valueClassName="whitespace-pre-line"
          />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Adjuntos" />
        {detail.documents.length === 0 ? (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Sin adjuntos.</p>
        ) : (
          <ul className="space-y-2">
            {detail.documents.map((file) => (
              <li
                key={file.id}
                className="r-lg flex items-center justify-between gap-3 border border-slate-200 px-3 py-2 dark:border-white/10"
              >
                <p className="min-w-0 truncate text-[13px] font-medium text-slate-800 dark:text-slate-100">
                  {file.fileName}
                </p>
                <div className="flex shrink-0 items-center gap-3">
                  {file.url.length > 0 && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-semibold accent-text hover:opacity-80"
                    >
                      Ver
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={deletingDocumentId === file.id}
                    onClick={() => onDeleteDocument(file.id)}
                    className="text-[12px] font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    {deletingDocumentId === file.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.createdAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Traspaso creado</p>
            </div>
          </li>
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.effectiveDateDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Fecha efectiva</p>
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
  onEdit?: () => void
  moreActions?: DropdownAction[]
}

function HeroActionButtons({ onEdit, moreActions }: HeroActionButtonsProps) {
  const secondaryBtn =
    'inline-flex items-center gap-1.5 r-md border border-slate-200 bg-white px-2.5 h-9 text-[12.5px] text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60'

  if (!onEdit && (!moreActions || moreActions.length === 0)) return null

  return (
    <>
      {moreActions && moreActions.length > 0 && (
        <DropdownActionsMenuComponent actions={moreActions} triggerClassName={secondaryBtn} />
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 r-md accent-bg h-9 px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
        >
          <IconEdit />
          Editar
        </button>
      )}
    </>
  )
}
