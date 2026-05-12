import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DropdownActionsMenuComponent } from '@/components/ui/dropdown/DropdownActionsMenuComponent'
import { IconDownload } from '@/components/ui/icons/IconDownload'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { AnnexDetailView } from '@/types'
import { resolveApprovalTone, type DropdownAction } from '@/utils'

interface AnnexDetailComponentProps {
  detail: AnnexDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
  onExport?: () => void
  onDownloadDocument?: (fileId: number) => void
  moreActions?: DropdownAction[]
}

export function AnnexDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
  onExport,
  onDownloadDocument,
  moreActions,
}: AnnexDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del anexo..."
      emptyText="Selecciona un anexo para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <AnnexDetailContent
          detail={detail}
          onEdit={onEdit}
          onExport={onExport}
          onDownloadDocument={onDownloadDocument}
          moreActions={moreActions}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

interface AnnexDetailContentProps {
  detail: AnnexDetailView
  onEdit?: () => void
  onExport?: () => void
  onDownloadDocument?: (fileId: number) => void
  moreActions?: DropdownAction[]
}

function AnnexDetailContent({
  detail,
  onEdit,
  onExport,
  onDownloadDocument,
  moreActions,
}: AnnexDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.statusName)
  const documentsStat: DetailHeroStat = {
    label: 'Adjuntos',
    value: detail.documents.length,
    unit: detail.documents.length === 1 ? 'doc' : 'docs',
    progress: Math.min(100, detail.documents.length * 20),
  }
  const description = (
    <>
      Anexo de tipo <span className="num">{detail.annexTypeName || '—'}</span> para{' '}
      <span className="num">{detail.employeeName || '—'}</span>, contrato N°{' '}
      <span className="num">{detail.contractId || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.annexTypeName || 'Sin tipo'}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.statusName || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.requireApproval ? 'warn' : 'ok'} dot>
              {detail.requireApproval ? 'Requiere aprobación' : 'Aplicado'}
            </DetailBadgeComponent>
          </>
        }
        stat={documentsStat}
        actions={
          <HeroActionButtons
            onEdit={onEdit}
            onExport={onExport}
            moreActions={moreActions}
          />
        }
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Datos generales" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="ID anexo" value={String(detail.id)} mono />
          <DetailFieldCardComponent title="Tipo anexo" value={detail.annexTypeName} />
          <DetailFieldCardComponent title="Fecha" value={detail.dateDisplay} mono />
          <DetailFieldCardComponent title="Estado" value={detail.statusName} />
        </div>
        {detail.descriptionText && (
          <p className="mt-4 whitespace-pre-line text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            {detail.descriptionText}
          </p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Trabajador" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre" value={detail.employeeName} />
          <DetailFieldCardComponent title="Identificación" value={detail.employeeIdentification} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Contrato" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="ID contrato" value={String(detail.contractId)} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Documentos" />
        {detail.documents.length === 0 ? (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Sin adjuntos.</p>
        ) : (
          <ul className="space-y-2">
            {detail.documents.map((file) => (
              <li
                key={file.id}
                className="r-md flex items-center justify-between gap-3 border border-slate-200 px-3 py-2 dark:border-white/10"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-slate-800 dark:text-slate-100">
                    {file.fileName}
                  </p>
                  <p className="num text-[11px] text-slate-500 dark:text-slate-400">
                    {file.uploadedAtDisplay}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!onDownloadDocument}
                  onClick={() => onDownloadDocument?.(file.id)}
                  className="inline-flex cursor-pointer items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                >
                  Descargar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="05" title="Solicitud RRHH vinculada" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent
            title="ID solicitud"
            value={detail.hrRequestId != null ? String(detail.hrRequestId) : '—'}
            mono
          />
          <DetailFieldCardComponent title="Requiere aprobación" value={detail.requireApprovalDisplay} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="06" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.createdAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Registro creado</p>
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
  onExport?: () => void
  moreActions?: DropdownAction[]
}

function HeroActionButtons({ onEdit, onExport, moreActions }: HeroActionButtonsProps) {
  const baseBtn =
    'inline-flex items-center gap-1.5 r-md border border-slate-200 bg-white px-2.5 h-9 text-[12.5px] text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60'

  return (
    <>
      <button type="button" onClick={onExport} className={baseBtn}>
        <IconDownload />
        Exportar
      </button>
      {moreActions && moreActions.length > 0 && (
        <DropdownActionsMenuComponent actions={moreActions} />
      )}
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 r-md accent-bg h-9 px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
      >
        <IconEdit />
        Editar
      </button>
    </>
  )
}
