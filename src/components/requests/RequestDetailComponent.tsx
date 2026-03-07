import { type ReactNode, useState } from 'react'
import AvatarInitialsComponent from '@/components/ui/avatar/AvatarInitialsComponent'
import ButtonComponent from '@/components/ui/button/ButtonComponent'
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

  const tabContentByKey: Record<RequestDetailTabKey, { title: string, content: ReactNode }> = {
    general: {
      title: 'Informacion general',
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm"><span className="font-semibold">Tipo solicitud:</span> {detail.requestTypeName}</p>
          <p className="text-sm"><span className="font-semibold">Operacion:</span> {detail.actionDisplay}</p>
          <p className="text-sm"><span className="font-semibold">Requiere aprobacion:</span> {detail.requireApprovalLabel}</p>
        </div>
      ),
    },
    approval: {
      title: 'Aprobacion',
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm"><span className="font-semibold">Aprobador:</span> {detail.approverName}</p>
          <p className="text-sm"><span className="font-semibold">Fecha aprobacion:</span> {detail.approvalDateDisplay}</p>
          <p className="text-sm"><span className="font-semibold">Aprobador RRHH:</span> {detail.hhrrApproverName}</p>
          <p className="text-sm"><span className="font-semibold">Fecha aprobacion RRHH:</span> {detail.hhrrApprovalDateDisplay}</p>
        </div>
      ),
    },
    rejection: {
      title: 'Rechazo',
      content: <p className="text-sm">{detail.rejectionDetailDisplay}</p>,
    },
    dates: {
      title: 'Fechas',
      content: (
        <div className="grid gap-3">
          <p className="text-sm"><span className="font-semibold">Creado:</span> {detail.createdAtDisplay}</p>
          <p className="text-sm"><span className="font-semibold">Actualizado:</span> {detail.updatedAtDisplay}</p>
        </div>
      ),
    },
  }

  const activeTabContent = tabContentByKey[activeTab]
  const handleTabChange = (value: string) => setActiveTab(value as RequestDetailTabKey)

  return (
    <section className="space-y-5">
      <article className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <AvatarInitialsComponent
          fullName={detail.fullName}
          fallbackInitials="SR"
        />

        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{detail.fullName}</p>
          <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.identification}</p>
          <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.requestTypeName}</p>
          <div className="mt-2">
            <EmployeeApprovalStatusBadgeComponent statusName={detail.statusName} />
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

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {activeTabContent.title}
        </h3>
        {activeTabContent.content}
      </article>
    </section>
  )
}
