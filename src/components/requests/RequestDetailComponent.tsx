import { type ReactNode, useState } from 'react'
import AvatarInitialsComponent from '@/components/ui/avatar/AvatarInitialsComponent'
import ButtonComponent from '@/components/ui/button/ButtonComponent'
import DetailFieldCardComponent from '@/components/ui/detail/DetailFieldCardComponent'
import DetailTabContentComponent from '@/components/ui/detail/DetailTabContentComponent'
import DetailSectionDropdownComponent from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import EmployeeApprovalStatusBadgeComponent from '@/components/ui/status/EmployeeApprovalStatusBadgeComponent'
import type { RequestDetailView } from '@/types'

interface RequestDetailComponentProps {
  detail: RequestDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

type RequestDetailTabKey = 'general' | 'approval' | 'rejection' | 'dates'

export default function RequestDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: RequestDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<RequestDetailTabKey>('general')

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Cargando detalle de la solicitud...</p>
  }

  if (errorMessage) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600 dark:text-rose-300">{errorMessage}</p>
        {onRetry && (
          <ButtonComponent
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={onRetry}
          />
        )}
      </div>
    )
  }

  if (!detail) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Selecciona una solicitud para ver su detalle.</p>
  }

  const tabOptions = [
    { value: 'general', label: 'Informacion general' },
    { value: 'approval', label: 'Aprobacion' },
    { value: 'rejection', label: 'Rechazo' },
    { value: 'dates', label: 'Fechas' },
  ]
  const handleTabChange = (value: string) => setActiveTab(value as RequestDetailTabKey)

  const renderTabContent = (): ReactNode => {
    if (activeTab === 'general') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Tipo solicitud" value={detail.requestTypeName} />
          <DetailFieldCardComponent title="Operacion" value={detail.actionDisplay} />
          <DetailFieldCardComponent title="Requiere aprobacion" value={detail.requireApprovalLabel} />
        </div>
      )
    }

    if (activeTab === 'approval') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Aprobador" value={detail.approverName} />
          <DetailFieldCardComponent title="Fecha aprobacion" value={detail.approvalDateDisplay} />
          <DetailFieldCardComponent title="Aprobador RRHH" value={detail.hhrrApproverName} />
          <DetailFieldCardComponent title="Fecha aprobacion RRHH" value={detail.hhrrApprovalDateDisplay} />
        </div>
      )
    }

    if (activeTab === 'rejection') {
      return (
        <div className="grid gap-3">
          <DetailFieldCardComponent title="Detalle rechazo" value={detail.rejectionDetailDisplay} />
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
          fullName={detail.fullName}
          fallbackInitials="SR"
          className="bg-cyan-100 font-bold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
        />

          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-semibold">{detail.fullName}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.identification}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.requestTypeName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EmployeeApprovalStatusBadgeComponent statusName={detail.statusName} />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Seccion"
          options={tabOptions}
          onValueChange={handleTabChange}
        />
      </article>

      <DetailTabContentComponent renderTabContent={renderTabContent} />
    </section>
  )
}
