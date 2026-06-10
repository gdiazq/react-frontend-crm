import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  EmployeesListDetailSidebarComponent,
  EmployeesListFiltersSidebarComponent,
  EmployeesListTableComponent,
  EmployeesListToolbarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import {
  AUTH_ROUTE_EMPLOYEES,
  AUTH_ROUTE_EMPLOYEES_EDIT,
  PermissionAction,
  PermissionModule,
} from '@/constant'
import { employeesTableColumnIndex } from '@/factories'
import { mapperEmployeeAvailableUserSelectOptions } from '@/mappers'
import messages from '@/messages/messages'
import {
  useStoreEmployeeSelects,
  useStoreEmployees,
  useStoreSelects,
} from '@/store'
import { useHasPermission } from '@/hooks'
import type { EmployeeTableRow } from '@/types'
import { createEmployeesActions, createRowsById, findRowById, isTableRowActive } from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = employeesTableColumnIndex.name

export default function EmployeesDashboardPage() {
  const navigate = useNavigate()
  const { actionViewDetail, actionUpdateEmployee, actionToggleStatus, actionLinkUser, actionUnlinkUser } = createEmployeesActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<EmployeeTableRow | null>(null)
  const [linkConfirmOpen, setLinkConfirmOpen] = useState(false)
  const [pendingLinkRow, setPendingLinkRow] = useState<EmployeeTableRow | null>(null)
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false)
  const [pendingUnlinkRow, setPendingUnlinkRow] = useState<EmployeeTableRow | null>(null)
  const [availableUsersSearch, setAvailableUsersSearch] = useState('')
  const [selectedAvailableUserId, setSelectedAvailableUserId] = useState('')
  const [linkValidationErrorMessage, setLinkValidationErrorMessage] = useState('')
  const [actionsMessage, setActionsMessage] = useState('')

  // Store state used to render the dashboard.
  const employeesRows = useStoreEmployees((s) => s.employeesRows)
  const pagination = useStoreEmployees((s) => s.pagination)
  const loadingToggleStatus = useStoreEmployees((s) => s.operationLoading.toggle)
  const loadingLinkUser = useStoreEmployees((s) => s.loadingLinkUser)
  const availableUsers = useStoreEmployees((s) => s.availableUsers)
  const loadingAvailableUsers = useStoreEmployees((s) => s.loadingAvailableUsers)
  const listError = useStoreEmployees((s) => s.operationStatus.list.error)
  const toggleError = useStoreEmployees((s) => s.operationStatus.toggle.error)
  const linkError = useStoreEmployees((s) => s.operationStatus.link.error)

  // Store actions triggered by dashboard interactions.
  const clearOperationStatus = useStoreEmployees((s) => s.clearOperationStatus)
  const getEmployees = useStoreEmployees((s) => s.getEmployees)
  const getEmployeeDetail = useStoreEmployees((s) => s.getEmployeeDetail)
  const toggleEmployeeStatus = useStoreEmployees((s) => s.toggleEmployeeStatus)
  const getAvailableUsers = useStoreEmployees((s) => s.getAvailableUsers)
  const linkEmployeeUser = useStoreEmployees((s) => s.linkEmployeeUser)
  const unlinkEmployeeUser = useStoreEmployees((s) => s.unlinkEmployeeUser)
  const clearAvailableUsers = useStoreEmployees((s) => s.clearAvailableUsers)
  const canUpdateEmployee = useHasPermission(PermissionModule.Employee, PermissionAction.Update)
  const canToggleEmployeeStatus = canUpdateEmployee

  // Shared select state/actions used by filters.
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)
  const getYesNoOptions = useStoreEmployeeSelects((s) => s.getYesNoOptions)

  // Derived lookups and select options.
  const employeesRowsById = useMemo(() => createRowsById(employeesRows), [employeesRows])
  const resolveEmployeeRow = (rowId: string) => findRowById(employeesRowsById, rowId)
  const availableUsersSelectOptions = mapperEmployeeAvailableUserSelectOptions(availableUsers)

  useEffect(() => {
    void getEmployees()
    void getStatusOptions()
    void getApprovalEmployeeStatusOptions()
    void getYesNoOptions()
  }, [getApprovalEmployeeStatusOptions, getEmployees, getStatusOptions, getYesNoOptions])

  const handleViewDetail = (row: EmployeeTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Trabajador'))
  }

  const handleCloseDetail = () => {
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
  }

  const handleUpdateEmployee = (row: EmployeeTableRow) => {
    navigate(`${AUTH_ROUTE_EMPLOYEES_EDIT}=${row.id}`)
  }

  const handleOpenLinkUser = (row: EmployeeTableRow) => {
    setPendingLinkRow(row)
    setLinkConfirmOpen(true)
    setSelectedAvailableUserId('')
    setLinkValidationErrorMessage('')
    clearOperationStatus('link')
    setAvailableUsersSearch('')
    clearAvailableUsers()
    void getAvailableUsers('')
  }

  const handleOpenUnlinkUser = (row: EmployeeTableRow) => {
    setPendingUnlinkRow(row)
    setUnlinkConfirmOpen(true)
    setLinkValidationErrorMessage('')
    clearOperationStatus('link')
  }

  const handleToggleStatus = (row: EmployeeTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: EmployeeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => handleViewDetail(row))]

    if (canUpdateEmployee) {
      actions.push(actionUpdateEmployee(() => handleUpdateEmployee(row)))
      const hasLinkedUser = (row.linkedUserId ?? 0) > 0 || (row.linkedUserEmail ?? '').trim().length > 0
      actions.push(hasLinkedUser
        ? actionUnlinkUser(() => handleOpenUnlinkUser(row))
        : actionLinkUser(() => handleOpenLinkUser(row)))
    }

    if (canToggleEmployeeStatus) {
      actions.push(actionToggleStatus(isTableRowActive(row), () => handleToggleStatus(row)))
    }

    return actions
  }

  const selectedDetailRow = selectedDetailRowId ? resolveEmployeeRow(selectedDetailRowId) : null
  const detailMoreActions = selectedDetailRow
    ? resolveRowActions(selectedDetailRow).filter((action) => action.id !== 'view-detail' && action.id !== 'update-employee')
    : []

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) {
      return
    }

    const nextStatus = pendingToggleRow.active !== true
    const employeeName = pendingToggleRow.values[EMPLOYEE_NAME_COLUMN_INDEX]
    const success = await toggleEmployeeStatus(pendingToggleRow.id, nextStatus)
    if (!success) {
      return
    }

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getEmployees()
    navigate(AUTH_ROUTE_EMPLOYEES)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${employeeName} ${nextStatus ? messages.employees.status.success.toggleEnabledSuccess : messages.employees.status.success.toggleDisabledSuccess}`,
    )
  }

  const handleAvailableUsersSearch = (query: string) => {
    setAvailableUsersSearch(query)
    void getAvailableUsers(query)
  }

  const handleCloseLinkConfirm = () => {
    if (loadingLinkUser) return
    setLinkConfirmOpen(false)
    setPendingLinkRow(null)
    setSelectedAvailableUserId('')
    setAvailableUsersSearch('')
    clearAvailableUsers()
    setLinkValidationErrorMessage('')
  }

  const handleCloseUnlinkConfirm = () => {
    if (loadingLinkUser) return
    setUnlinkConfirmOpen(false)
    setPendingUnlinkRow(null)
    setLinkValidationErrorMessage('')
  }

  const handleConfirmLinkUser = async () => {
    if (!pendingLinkRow || loadingLinkUser) {
      return
    }

    const parsedUserId = Number(selectedAvailableUserId)
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      setLinkValidationErrorMessage(messages.employees.status.errors.linkUserRequired)
      return
    }

    const success = await linkEmployeeUser(pendingLinkRow.id, parsedUserId)
    if (!success) {
      return
    }

    const employeeName = pendingLinkRow.values[EMPLOYEE_NAME_COLUMN_INDEX] || 'Trabajador'
    setLinkConfirmOpen(false)
    setPendingLinkRow(null)
    setSelectedAvailableUserId('')
    setAvailableUsersSearch('')
    clearAvailableUsers()
    setLinkValidationErrorMessage('')
    await getEmployees()
    if (selectedDetailRowId === pendingLinkRow.id) {
      void getEmployeeDetail(pendingLinkRow.id)
    }
    setActionsMessage(`${employeeName} ${messages.employees.status.success.linkUserSuccess}`)
  }

  const handleConfirmUnlinkUser = async () => {
    if (!pendingUnlinkRow || loadingLinkUser) {
      return
    }

    const success = await unlinkEmployeeUser(pendingUnlinkRow.id)
    if (!success) {
      return
    }

    const employeeName = pendingUnlinkRow.values[EMPLOYEE_NAME_COLUMN_INDEX] || 'Trabajador'
    setUnlinkConfirmOpen(false)
    setPendingUnlinkRow(null)
    await getEmployees()
    if (selectedDetailRowId === pendingUnlinkRow.id) {
      void getEmployeeDetail(pendingUnlinkRow.id)
    }
    setActionsMessage(`${employeeName} ${messages.employees.status.success.unlinkUserSuccess}`)
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${isTableRowActive(pendingToggleRow) ? 'deshabilitar' : 'habilitar'} al trabajador ${pendingToggleRow.values[EMPLOYEE_NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · TRABAJADORES</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de trabajadores</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total trabajadores"
        activeLabel="Trabajadores activos"
        total={pagination.total}
        active={pagination.active}
      />

      {(listError || toggleError) && (
        <AlertMessageComponent
          message={(listError || toggleError)!}
          tone="error"
          onClose={() => {
            if (listError) clearOperationStatus('list')
            if (toggleError) clearOperationStatus('toggle')
          }}
        />
      )}

      {linkError && 
        <AlertMessageComponent 
          message={linkError} 
          tone="error" 
          onClose={() => clearOperationStatus('link')} 
        />
      }

      {statusOptionsErrorMessage && 
        <AlertMessageComponent 
          message={statusOptionsErrorMessage} 
          tone="error" 
          onClose={clearStatusOptionsStatus} 
        />
      }

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent 
          message={approvalEmployeeStatusOptionsErrorMessage} 
          tone="error" 
          onClose={clearApprovalEmployeeStatusOptionsStatus} 
        />
      )}

      <EmployeesListToolbarComponent 
        onOpenFilters={() => setFiltersOpen(true)} 
        disabled={loadingToggleStatus || loadingLinkUser} 
      />

      <EmployeesListTableComponent
        onViewDetail={handleViewDetail}
        resolveRowActions={resolveRowActions}
        loadingExtra={loadingToggleStatus || loadingLinkUser}
      />

      {actionsMessage && <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />}

      <EmployeesListFiltersSidebarComponent 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />

      <EmployeesListDetailSidebarComponent
        rowId={selectedDetailRowId}
        fallbackName={selectedDetailName}
        moreActions={detailMoreActions}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar cambio de estado"
        message={confirmMessage}
        confirmLabel={isTableRowActive(pendingToggleRow) ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />

      <SaveConfirmComponent
        open={linkConfirmOpen}
        title="Confirmar vinculacion de usuario"
        message={pendingLinkRow ? `Selecciona el usuario a vincular con ${pendingLinkRow.values[EMPLOYEE_NAME_COLUMN_INDEX]}.` : ''}
        confirmLabel="Vincular"
        cancelLabel="Cancelar"
        loading={loadingLinkUser}
        confirmDisabled={selectedAvailableUserId.trim().length === 0}
        onClose={handleCloseLinkConfirm}
        onConfirm={() => { void handleConfirmLinkUser() }}
      >
        <SelectComponent
          value={selectedAvailableUserId}
          label={messages.employees.ui.linkUserSelectLabel}
          placeholder={messages.employees.ui.linkUserSelectPlaceholder}
          options={availableUsersSelectOptions}
          error={linkValidationErrorMessage}
          loading={loadingAvailableUsers}
          onSearch={handleAvailableUsersSearch}
          onValueChange={(value) => {
            setSelectedAvailableUserId(value)
            setLinkValidationErrorMessage('')
          }}
          helperText={availableUsersSearch.trim().length > 0 ? `Buscando: ${availableUsersSearch}` : undefined}
        />
      </SaveConfirmComponent>

      <SaveConfirmComponent
        open={unlinkConfirmOpen}
        title="Confirmar desvinculacion de usuario"
        message={pendingUnlinkRow ? `¿Seguro que deseas desvincular el usuario del trabajador ${pendingUnlinkRow.values[EMPLOYEE_NAME_COLUMN_INDEX]}?` : ''}
        confirmLabel="Desvincular"
        cancelLabel="Cancelar"
        loading={loadingLinkUser}
        onClose={handleCloseUnlinkConfirm}
        onConfirm={() => { void handleConfirmUnlinkUser() }}
      />
    </section>
  )
}
