import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnnexDetailComponent, DetailSidebarComponent } from '@/components'
import { AUTH_ROUTE_ANNEXES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperAnnexDetailView } from '@/mappers'
import { storageService } from '@/services'
import { useStoreAnnexes } from '@/store'
import { useHasPermission } from '@/hooks'

interface AnnexesListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function AnnexesListDetailSidebarComponent(props: AnnexesListDetailSidebarComponentProps) {
  const { rowId, fallbackName, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreAnnexes((s) => s.annexDetail)
  const loading = useStoreAnnexes((s) => s.operationLoading.detail)
  const error = useStoreAnnexes((s) => s.operationStatus.detail.error)
  const getAnnexDetail = useStoreAnnexes((s) => s.getAnnexDetail)
  const clearAnnexDetail = useStoreAnnexes((s) => s.clearAnnexDetail)
  const canUpdate = useHasPermission(PermissionModule.Annex, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getAnnexDetail(rowId)
  }, [rowId, getAnnexDetail])

  const handleClose = () => {
    clearAnnexDetail()
    onClose()
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const detailView = mapperAnnexDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.annexTypeName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de anexo'

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <AnnexDetailComponent
        key={rowId ?? 'empty-annex-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getAnnexDetail(rowId) }}
        onEdit={canUpdate && rowId ? () => navigate(`${AUTH_ROUTE_ANNEXES_EDIT}=${rowId}`) : undefined}
        onDownloadDocument={handleDownloadDocument}
      />
    </DetailSidebarComponent>
  )
}
