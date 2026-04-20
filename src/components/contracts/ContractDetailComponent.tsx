import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconDownload } from '@/components/ui/icons/IconDownload'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { ContractDetailView } from '@/types'
import { resolveApprovalTone, resolveContractStatusTone } from '@/utils'

interface ContractDetailComponentProps {
  detail: ContractDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
  onExport?: () => void
  onDownloadDocument?: (fileId: number) => void
}

export function ContractDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
  onExport,
  onDownloadDocument,
}: ContractDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del contrato..."
      emptyText="Selecciona un contrato para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <ContractDetailContent
          detail={detail}
          onEdit={onEdit}
          onExport={onExport}
          onDownloadDocument={onDownloadDocument}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

interface ContractDetailContentProps {
  detail: ContractDetailView
  onEdit?: () => void
  onExport?: () => void
  onDownloadDocument?: (fileId: number) => void
}

function ContractDetailContent({
  detail,
  onEdit,
  onExport,
  onDownloadDocument,
}: ContractDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.approvalStatusName)
  const contractStatusTone = resolveContractStatusTone(detail.contractStatusName)
  const documentsStat: DetailHeroStat = {
    label: 'Adjuntos',
    value: detail.documents.length,
    unit: detail.documents.length === 1 ? 'doc' : 'docs',
    progress: Math.min(100, detail.documents.length * 20),
  }
  const description = (
    <>
      Trabajador <span className="num">{detail.employeeName || '—'}</span>
      {detail.contractNumber ? (
        <>
          , contrato N° <span className="num">{detail.contractNumber}</span>
        </>
      ) : null}
      .
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.contractName || 'Sin nombre'}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={contractStatusTone} dot>
              {detail.contractStatusName || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.approvalStatusName || 'Sin aprobación'}
            </DetailBadgeComponent>
            {detail.contractTypeName && (
              <DetailBadgeComponent tone="accent">
                {detail.contractTypeName}
              </DetailBadgeComponent>
            )}
          </>
        }
        stat={documentsStat}
        actions={<HeroActionButtons onEdit={onEdit} onExport={onExport} />}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Datos generales" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Número" value={detail.contractNumber} mono />
          <DetailFieldCardComponent title="Tipo contrato" value={detail.contractTypeName} />
          <DetailFieldCardComponent title="Trabajador" value={detail.employeeName} />
          <DetailFieldCardComponent title="Identificación" value={detail.employeeIdentification} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Organización" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Empresa" value={detail.companyName} />
          <DetailFieldCardComponent title="Zona" value={detail.zoneName} />
          <DetailFieldCardComponent title="Cargo" value={detail.jobTitleName} />
          <DetailFieldCardComponent title="Sede" value={detail.siteName} />
          <DetailFieldCardComponent title="Sindicato" value={detail.laborUnionName} />
          <DetailFieldCardComponent title="Agrup. seguridad" value={detail.safetyGroupName} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Condiciones" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Sueldo base" value={detail.baseSalary} mono />
          <DetailFieldCardComponent title="Sueldo acordado" value={detail.agreedSalary} mono />
          <DetailFieldCardComponent title="Horas semanales" value={detail.weeklyWorkHours} mono />
          <DetailFieldCardComponent title="Días de trabajo" value={detail.workDays} mono />
          <DetailFieldCardComponent title="Colación" value={detail.mealTypeName} />
          <DetailFieldCardComponent title="Movilización" value={detail.transportTypeName} />
        </div>
        {detail.contractDetailText && (
          <p className="mt-4 whitespace-pre-line text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            {detail.contractDetailText}
          </p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Vigencia" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Inicio" value={detail.startDateDisplay} mono />
          <DetailFieldCardComponent title="Fin" value={detail.endDateDisplay} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="05" title="Adjuntos" />
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
                    {file.sizeDisplay}
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
}

function HeroActionButtons({ onEdit, onExport }: HeroActionButtonsProps) {
  const baseBtn =
    'inline-flex items-center gap-1.5 r-md border border-slate-200 bg-white px-2.5 h-9 text-[12.5px] text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60'

  return (
    <>
      <button type="button" onClick={onExport} className={baseBtn}>
        <IconDownload />
        Exportar
      </button>
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
