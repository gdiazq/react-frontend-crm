import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContractDetailComponent, DetailSidebarComponent } from '@/components'
import { AUTH_ROUTE_ANNEXES, AUTH_ROUTE_CONTRACTS_EDIT } from '@/constant'
import { mapperContractDetailView } from '@/mappers'
import { storageService } from '@/services'
import { useStoreAnnexes, useStoreContracts } from '@/store'

interface ContractsListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function ContractsListDetailSidebarComponent(props: ContractsListDetailSidebarComponentProps) {
  const { rowId, fallbackName, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreContracts((s) => s.contractDetail)
  const loading = useStoreContracts((s) => s.operationLoading.detail)
  const error = useStoreContracts((s) => s.operationStatus.detail.error)
  const getContractDetail = useStoreContracts((s) => s.getContractDetail)
  const clearContractDetail = useStoreContracts((s) => s.clearContractDetail)
  const contractAnnexes = useStoreAnnexes((s) => s.contractAnnexes)
  const loadingContractAnnexes = useStoreAnnexes((s) => s.loadingContractAnnexes)
  const getAnnexesByContract = useStoreAnnexes((s) => s.getAnnexesByContract)
  const clearContractAnnexes = useStoreAnnexes((s) => s.clearContractAnnexes)

  useEffect(() => {
    if (!rowId) return
    void getContractDetail(rowId)
    void getAnnexesByContract(Number(rowId))
  }, [getAnnexesByContract, getContractDetail, rowId])

  const handleClose = () => {
    clearContractDetail()
    clearContractAnnexes()
    onClose()
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const detailView = mapperContractDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.contractName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de contrato'

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <ContractDetailComponent
        key={rowId ?? 'empty-contract-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getContractDetail(rowId) }}
        onDownloadDocument={handleDownloadDocument}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_CONTRACTS_EDIT}=${rowId}`) : undefined}
        annexes={contractAnnexes}
        loadingAnnexes={loadingContractAnnexes}
        onGoAnnex={() => navigate(AUTH_ROUTE_ANNEXES)}
      />
    </DetailSidebarComponent>
  )
}
