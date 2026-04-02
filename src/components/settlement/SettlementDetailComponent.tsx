import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import type { SettlementDetailView } from '@/types'

interface SettlementDetailComponentProps {
  detail: SettlementDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export function SettlementDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: SettlementDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del acuerdo de termino..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <SettlementDetailContent detail={detail} />}
    </DetailStateWrapperComponent>
  )
}

function SettlementDetailContent({
  detail,
}: {
  detail: SettlementDetailView
}) {
  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Informacion general
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Estado" value={detail.statusDisplay} />
          <DetailFieldCardComponent title="Recontratable" value={detail.rehireEligibleDisplay} />
          <DetailFieldCardComponent title="Empleado" value={detail.employeeFullNameDisplay} />
          <DetailFieldCardComponent title="Identificacion" value={detail.employeeIdentificationDisplay} />
          <DetailFieldCardComponent title="ID Contrato" value={detail.contractIdDisplay} />
          {detail.hrRequestIdDisplay !== '-' && (
            <DetailFieldCardComponent title="ID Solicitud RRHH" value={detail.hrRequestIdDisplay} />
          )}
          {detail.observationsDisplay !== '-' && (
            <DetailFieldCardComponent title="Observaciones" value={detail.observationsDisplay} className="md:col-span-2" />
          )}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Condiciones de termino
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Causa legal" value={detail.legalTerminationCauseNameDisplay} className="md:col-span-2" />
          <DetailFieldCardComponent title="Calidad del trabajo" value={detail.qualityOfWorkNameDisplay} />
          <DetailFieldCardComponent title="Cumplimiento seguridad" value={detail.safetyComplianceNameDisplay} />
          {detail.noReHiredCauseNameDisplay !== '-' && (
            <DetailFieldCardComponent title="Causa no recontratacion" value={detail.noReHiredCauseNameDisplay} className="md:col-span-2" />
          )}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Fechas
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Fecha fin" value={detail.endDateDisplay} />
          <DetailFieldCardComponent title="Creado" value={detail.createdAtDisplay} />
          <DetailFieldCardComponent title="Actualizado" value={detail.updatedAtDisplay} />
        </div>
      </article>
    </section>
  )
}
