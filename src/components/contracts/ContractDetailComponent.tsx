import { type ReactNode, useState } from 'react'
import AvatarInitialsComponent from '@/components/ui/avatar/AvatarInitialsComponent'
import DetailFieldCardComponent from '@/components/ui/detail/DetailFieldCardComponent'
import DetailStateWrapperComponent from '@/components/ui/detail/DetailStateWrapperComponent'
import DetailSectionDropdownComponent from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import ContractStatusBadgeComponent from '@/components/ui/status/ContractStatusBadgeComponent'
import ContractTypeBadgeComponent from '@/components/ui/status/ContractTypeBadgeComponent'
import EmployeeApprovalStatusBadgeComponent from '@/components/ui/status/EmployeeApprovalStatusBadgeComponent'
import type { ContractDetailView } from '@/types'

interface ContractDetailComponentProps {
  detail: ContractDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

type ContractDetailTabKey = 'general' | 'organization' | 'conditions' | 'documents' | 'dates'

interface ContractDetailContentProps {
  detail: ContractDetailView
  activeTab: ContractDetailTabKey
  onTabChange: (tab: ContractDetailTabKey) => void
}

export default function ContractDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: ContractDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<ContractDetailTabKey>('general')

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
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

function ContractDetailContent({ detail, activeTab, onTabChange }: ContractDetailContentProps) {
  const tabSelectOptions = [
    { value: 'general', label: 'Informacion general' },
    { value: 'organization', label: 'Organizacion' },
    { value: 'conditions', label: 'Condiciones' },
    { value: 'documents', label: 'Adjuntos' },
    { value: 'dates', label: 'Fechas' },
  ]

  const renderTabContent = (): ReactNode => {
    if (activeTab === 'general') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre contrato" value={detail.contractName} />
          <DetailFieldCardComponent title="Numero" value={detail.contractNumber} />
          <DetailFieldCardComponent title="Trabajador" value={detail.employeeName} />
          <DetailFieldCardComponent title="Identificacion" value={detail.employeeIdentification} />
        </div>
      )
    }

    if (activeTab === 'organization') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Empresa" value={detail.companyName} />
          <DetailFieldCardComponent title="Zona" value={detail.zoneName} />
          <DetailFieldCardComponent title="Cargo" value={detail.jobTitleName} />
          <DetailFieldCardComponent title="Sede" value={detail.siteName} />
          <DetailFieldCardComponent title="Sindicato" value={detail.laborUnionName} />
          <DetailFieldCardComponent title="Agrupacion seguridad" value={detail.safetyGroupName} />
        </div>
      )
    }

    if (activeTab === 'conditions') {
      return (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <DetailFieldCardComponent title="Sueldo base" value={detail.baseSalary} />
            <DetailFieldCardComponent title="Sueldo acordado" value={detail.agreedSalary} />
            <DetailFieldCardComponent title="Horas semanales" value={detail.weeklyWorkHours} />
            <DetailFieldCardComponent title="Dias de trabajo" value={detail.workDays} />
            <DetailFieldCardComponent title="Inicio" value={detail.startDateDisplay} />
            <DetailFieldCardComponent title="Fin" value={detail.endDateDisplay} />
            <DetailFieldCardComponent title="Colacion" value={detail.mealTypeName} />
            <DetailFieldCardComponent title="Movilizacion" value={detail.transportTypeName} />
          </div>
          <DetailFieldCardComponent title="Detalle" value={detail.contractDetailText} />
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
            fullName={detail.employeeName}
            fallbackInitials="CT"
            className="bg-cyan-100 font-bold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-semibold">{detail.contractName}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.employeeName}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.employeeIdentification}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ContractTypeBadgeComponent contractType={detail.contractTypeName} />
              <ContractStatusBadgeComponent contractStatus={detail.contractStatusName} />
              <EmployeeApprovalStatusBadgeComponent statusName={detail.approvalStatusName} />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Seccion"
          options={tabSelectOptions}
          onValueChange={(value) => onTabChange(value as ContractDetailTabKey)}
        />
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        {renderTabContent()}
      </article>
    </section>
  )
}
