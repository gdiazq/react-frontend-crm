import { type ReactNode, useState } from 'react'
import { AvatarInitialsComponent } from '@/components/ui/avatar/AvatarInitialsComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DetailSectionDropdownComponent } from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import { EmployeeApprovalStatusBadgeComponent } from '@/components/ui/status/EmployeeApprovalStatusBadgeComponent'
import type { TransferDetailView } from '@/types'

interface TransferDetailComponentProps {
  detail: TransferDetailView | null
  loading: boolean
  errorMessage: string | null
  deletingDocumentId: number | null
  onRetry?: () => void
  onDeleteDocument: (fileId: number) => void
}

type TransferDetailTabKey = 'general' | 'documents' | 'dates'

interface TransferDetailContentProps {
  detail: TransferDetailView
  activeTab: TransferDetailTabKey
  deletingDocumentId: number | null
  onTabChange: (tab: TransferDetailTabKey) => void
  onDeleteDocument: (fileId: number) => void
}

export function TransferDetailComponent({
  detail,
  loading,
  errorMessage,
  deletingDocumentId,
  onRetry,
  onDeleteDocument,
}: TransferDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<TransferDetailTabKey>('general')

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
          activeTab={activeTab}
          deletingDocumentId={deletingDocumentId}
          onTabChange={setActiveTab}
          onDeleteDocument={onDeleteDocument}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

function TransferDetailContent({
  detail,
  activeTab,
  deletingDocumentId,
  onTabChange,
  onDeleteDocument,
}: TransferDetailContentProps) {
  const tabSelectOptions = [
    { value: 'general', label: 'Informacion general' },
    { value: 'documents', label: 'Adjuntos' },
    { value: 'dates', label: 'Fechas' },
  ]

  const renderTabContent = (): ReactNode => {
    if (activeTab === 'general') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Empleado" value={detail.employeeFullNameDisplay} />
          <DetailFieldCardComponent title="RUT" value={detail.employeeIdentificationDisplay} />
          <DetailFieldCardComponent title="Centro origen" value={detail.fromCostCenterNameDisplay} />
          <DetailFieldCardComponent title="Centro destino" value={detail.toCostCenterNameDisplay} />
          <DetailFieldCardComponent title="Fecha efectiva" value={detail.effectiveDateDisplay} />
          {detail.hrRequestIdDisplay !== '-' && (
            <DetailFieldCardComponent title="ID solicitud RRHH" value={detail.hrRequestIdDisplay} />
          )}
          <DetailFieldCardComponent title="Motivo" value={detail.reasonDisplay} className="md:col-span-2" />
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
              </div>
              <div className="flex shrink-0 items-center gap-3">
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
                <button
                  type="button"
                  disabled={deletingDocumentId === file.id}
                  onClick={() => onDeleteDocument(file.id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                >
                  {deletingDocumentId === file.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
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
            fullName={detail.employeeFullNameDisplay}
            fallbackInitials="TR"
            className="bg-blue-100 font-bold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-semibold">{detail.employeeFullNameDisplay}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.employeeIdentificationDisplay}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.effectiveDateDisplay}</p>
            <div className="mt-2">
              <EmployeeApprovalStatusBadgeComponent statusName={detail.statusDisplay} />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Seccion"
          options={tabSelectOptions}
          onValueChange={(value) => onTabChange(value as TransferDetailTabKey)}
        />
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        {renderTabContent()}
      </article>
    </section>
  )
}
