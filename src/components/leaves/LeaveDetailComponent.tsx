import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { LeaveDetailView } from '@/types'
import { resolveApprovalTone } from '@/utils'

interface LeaveDetailComponentProps {
  detail: LeaveDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
  onDownloadDocument?: (fileId: number) => void
  onDeleteDocument?: (fileId: number) => void
}

export function LeaveDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
  onDownloadDocument,
  onDeleteDocument,
}: LeaveDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del permiso..."
      emptyText="Selecciona un permiso para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <LeaveDetailContent
          detail={detail}
          onEdit={onEdit}
          onDownloadDocument={onDownloadDocument}
          onDeleteDocument={onDeleteDocument}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

interface LeaveDetailContentProps {
  detail: LeaveDetailView
  onEdit?: () => void
  onDownloadDocument?: (fileId: number) => void
  onDeleteDocument?: (fileId: number) => void
}

function LeaveDetailContent({ detail, onEdit, onDownloadDocument, onDeleteDocument }: LeaveDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.statusName)
  const documentsStat: DetailHeroStat = {
    label: 'Adjuntos',
    value: detail.documents.length,
    unit: detail.documents.length === 1 ? 'doc' : 'docs',
    progress: Math.min(100, detail.documents.length * 20),
  }
  const description = (
    <>
      Permiso <span className="num">{detail.leaveTypeName || '—'}</span> para{' '}
      <span className="num">{detail.employeeName || '—'}</span>, contrato N°{' '}
      <span className="num">{detail.contractId || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.leaveTypeName || 'Sin tipo'}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.statusName || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.requireApproval ? 'warn' : 'ok'} dot>
              {detail.requireApproval ? 'Requiere aprobación' : 'Aplicado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.paid ? 'ok' : 'neutral'} dot>
              {detail.paid ? 'Pagado' : 'No pagado'}
            </DetailBadgeComponent>
          </>
        }
        stat={documentsStat}
        actions={onEdit ? <HeroActionButton onEdit={onEdit} /> : undefined}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Datos generales" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="ID permiso" value={String(detail.id)} mono />
          <DetailFieldCardComponent title="Tipo permiso" value={detail.leaveTypeName} />
          <DetailFieldCardComponent title="Estado" value={detail.statusName} />
          <DetailFieldCardComponent title="Días totales" value={detail.totalDaysDisplay} mono />
          <DetailFieldCardComponent title="Medio día" value={detail.halfDayDisplay} />
          <DetailFieldCardComponent title="Pagado" value={detail.paidDisplay} />
        </div>
        {detail.reasonText && (
          <p className="mt-4 whitespace-pre-line text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            {detail.reasonText}
          </p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Trabajador" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre" value={detail.employeeName} />
          <DetailFieldCardComponent title="Identificación" value={detail.employeeIdentification} mono />
          <DetailFieldCardComponent title="ID trabajador" value={String(detail.employeeId)} mono />
          <DetailFieldCardComponent title="ID contrato" value={String(detail.contractId)} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Vigencia" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Inicio" value={detail.startDateDisplay} mono />
          <DetailFieldCardComponent title="Fin" value={detail.endDateDisplay} mono />
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
                    {file.createdAtDisplay} · {file.sizeDisplay || 'Sin tamaño'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!onDownloadDocument}
                    onClick={() => onDownloadDocument?.(file.id)}
                    className="inline-flex cursor-pointer items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                  >
                    Descargar
                  </button>
                  {onDeleteDocument && (
                    <button
                      type="button"
                      onClick={() => onDeleteDocument(file.id)}
                      className="inline-flex cursor-pointer items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="05" title="Solicitud RRHH vinculada" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="ID solicitud" value={detail.hrRequestId != null ? String(detail.hrRequestId) : '—'} mono />
          <DetailFieldCardComponent title="Requiere aprobación" value={detail.requireApprovalDisplay} />
          <DetailFieldCardComponent title="Requiere documento" value={detail.requiresDocumentDisplay} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="06" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <TimelineItem label="Registro creado" value={detail.createdAtDisplay} />
          <TimelineItem label="Última actualización" value={detail.updatedAtDisplay} />
        </ol>
      </section>
    </section>
  )
}

function HeroActionButton({ onEdit }: { onEdit: () => void }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex h-9 items-center gap-1.5 r-md accent-bg px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
    >
      <IconEdit />
      Editar
    </button>
  )
}

function TimelineItem({ label, value }: { label: string, value: string }) {
  return (
    <li className="relative">
      <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
      <div className="flex items-baseline gap-3">
        <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{value || '—'}</span>
        <p className="text-[13px] text-slate-700 dark:text-slate-200">{label}</p>
      </div>
    </li>
  )
}
