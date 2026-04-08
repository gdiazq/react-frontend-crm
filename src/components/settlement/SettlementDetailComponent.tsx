import { type ReactNode, useState } from 'react'
import { AvatarInitialsComponent } from '@/components/ui/avatar/AvatarInitialsComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DetailSectionDropdownComponent } from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import { EmployeeApprovalStatusBadgeComponent } from '@/components/ui/status/EmployeeApprovalStatusBadgeComponent'
import { StatusBadgeComponent } from '@/components/ui/status/StatusBadgeComponent'
import type { SettlementDetailView } from '@/types'

interface SettlementDetailComponentProps {
  detail: SettlementDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

type SettlementDetailTabKey = 'general' | 'conditions' | 'documents' | 'dates'

interface SettlementDetailContentProps {
  detail: SettlementDetailView
  activeTab: SettlementDetailTabKey
  onTabChange: (tab: SettlementDetailTabKey) => void
}

export function SettlementDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: SettlementDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<SettlementDetailTabKey>('general')

  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del acuerdo de termino..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <SettlementDetailContent
          detail={detail}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

function SettlementDetailContent({ detail, activeTab, onTabChange }: SettlementDetailContentProps) {
  const tabSelectOptions = [
    { value: 'general', label: 'Informacion general' },
    { value: 'conditions', label: 'Condiciones de termino' },
    { value: 'documents', label: 'Adjuntos' },
    { value: 'dates', label: 'Fechas' },
  ]

  const renderTabContent = (): ReactNode => {
    if (activeTab === 'general') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Empleado" value={detail.employeeFullNameDisplay} />
          <DetailFieldCardComponent title="Identificacion" value={detail.employeeIdentificationDisplay} />
          {detail.observationsDisplay !== '-' && (
            <DetailFieldCardComponent title="Observaciones" value={detail.observationsDisplay} className="md:col-span-2" />
          )}
        </div>
      )
    }

    if (activeTab === 'conditions') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Causa legal" value={detail.legalTerminationCauseNameDisplay} className="md:col-span-2" />
          <DetailFieldCardComponent title="Calidad del trabajo" value={detail.qualityOfWorkNameDisplay} />
          <DetailFieldCardComponent title="Cumplimiento seguridad" value={detail.safetyComplianceNameDisplay} />
          {detail.noReHiredCauseNameDisplay !== '-' && (
            <DetailFieldCardComponent title="Causa no recontratacion" value={detail.noReHiredCauseNameDisplay} className="md:col-span-2" />
          )}
        </div>
      )
    }

    if (activeTab === 'documents') {
      if (detail.documents.length === 0) {
        return <p className="text-sm text-slate-600 dark:text-slate-300">Sin adjuntos.</p>
      }
      return (
        <div className="space-y-2">
          {detail.documents.map((file) => (
            <article
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.fileName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{file.sizeDisplay}</p>
              </div>
              {file.url.length > 0 && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Ver
                </a>
              )}
            </article>
          ))}
        </div>
      )
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        <DetailFieldCardComponent title="Fecha fin" value={detail.endDateDisplay} />
        <DetailFieldCardComponent title="Creado" value={detail.createdAtDisplay} />
        <DetailFieldCardComponent title="Actualizado" value={detail.updatedAtDisplay} />
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="flex items-start gap-4">
          <AvatarInitialsComponent
            fullName={detail.employeeFullNameDisplay}
            fallbackInitials="FQ"
            className="bg-fuchsia-100 font-bold text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-200"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-semibold">{detail.employeeFullNameDisplay}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.employeeIdentificationDisplay}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.endDateDisplay}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EmployeeApprovalStatusBadgeComponent statusName={detail.statusDisplay} />
              <StatusBadgeComponent
                enabled={detail.rehireEligibleDisplay === 'Si'}
                activeLabel="Recontratable"
                inactiveLabel="No recontratable"
              />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Seccion"
          options={tabSelectOptions}
          onValueChange={(value) => onTabChange(value as SettlementDetailTabKey)}
        />
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        {renderTabContent()}
      </article>
    </section>
  )
}
