import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_ATTENDANCE_CREATE, PermissionAction, PermissionModule } from '@/constant'
import messages from '@/messages/messages'
import { attendanceService } from '@/services'
import { useStoreAttendance } from '@/store'
import { useHasPermission } from '@/hooks'
import { downloadBlobFile } from '@/utils'

interface AttendanceListToolbarComponentProps {
  onOpenFilters: () => void
}

export function AttendanceListToolbarComponent(props: AttendanceListToolbarComponentProps) {
  const { onOpenFilters } = props
  const navigate = useNavigate()
  const search = useStoreAttendance((s) => s.queryParams.search)
  const queryParams = useStoreAttendance((s) => s.queryParams)
  const loading = useStoreAttendance((s) => s.operationLoading.list)
  const setSearch = useStoreAttendance((s) => s.setSearch)
  const searchAttendance = useStoreAttendance((s) => s.searchAttendance)
  const canCreate = useHasPermission(PermissionModule.Attendance, PermissionAction.Create)

  const [downloadingReport, setDownloadingReport] = useState(false)
  const [actionsMessage, setActionsMessage] = useState('')

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await attendanceService.exportAttendanceCsv(queryParams)
      downloadBlobFile(csvBlob, 'attendance.csv')
      setActionsMessage(messages.attendance.status.success.exportSuccess)
    } catch {
      setActionsMessage(messages.attendance.status.errors.exportError)
    } finally {
      setDownloadingReport(false)
    }
  }

  return (
    <>
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchAttendance() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={search}
              type="text"
              placeholder="Buscar por trabajador, identificación, proyecto o notas"
              onValueChange={setSearch}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loading ? 'Buscando...' : 'Buscar'}
          />
          {canCreate && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loading}
              className="flex-1 md:flex-none"
              label="Nueva asistencia"
              onClick={() => navigate(AUTH_ROUTE_ATTENDANCE_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loading || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => {}}
          />
        </div>
      </form>

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}
    </>
  )
}
