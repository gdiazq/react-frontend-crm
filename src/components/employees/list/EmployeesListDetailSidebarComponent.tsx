import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, EmployeeDetailComponent } from '@/components'
import { AUTH_ROUTE_EMPLOYEES_EDIT } from '@/constant'
import { mapperEmployeeDetailView } from '@/mappers'
import { useStoreEmployees } from '@/store'
import type { DropdownAction } from '@/utils'

interface EmployeesListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  moreActions?: DropdownAction[]
  onClose: () => void
}

export function EmployeesListDetailSidebarComponent(props: EmployeesListDetailSidebarComponentProps) {
  const { rowId, fallbackName, moreActions, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreEmployees((s) => s.employeeDetail)
  const loading = useStoreEmployees((s) => s.operationLoading.detail)
  const error = useStoreEmployees((s) => s.operationStatus.detail.error)
  const getEmployeeDetail = useStoreEmployees((s) => s.getEmployeeDetail)
  const clearEmployeeDetail = useStoreEmployees((s) => s.clearEmployeeDetail)

  useEffect(() => {
    if (rowId) void getEmployeeDetail(rowId)
  }, [getEmployeeDetail, rowId])

  const handleClose = () => {
    clearEmployeeDetail()
    onClose()
  }

  const detailView = detail ? mapperEmployeeDetailView(detail) : null
  const title = detailView
    ? `Detalle de ${detailView.fullName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de trabajador'

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <EmployeeDetailComponent
        key={rowId ?? 'empty-employee-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getEmployeeDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_EMPLOYEES_EDIT}=${rowId}`) : undefined}
        moreActions={moreActions}
      />
    </DetailSidebarComponent>
  )
}
