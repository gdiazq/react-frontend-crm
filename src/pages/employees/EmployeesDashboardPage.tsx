import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  EmployeeDetailComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_EMPLOYEES, AUTH_ROUTE_EMPLOYEES_CREATE, AUTH_ROUTE_EMPLOYEES_EDIT } from '@/constant'
import { employeesTableColumns, employeesTableColumnIndex, employeesTableSortByColumn } from '@/factories'
import { mapperEmployeeDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { employeesService } from '@/services'
import { useStoreAuth, useStoreEmployeeSelects, useStoreEmployees, useStoreSelects } from '@/store'
import type { EmployeeTableRow } from '@/types'
import type { TableRow, TableSortState } from '@/components'
import { createEmployeesActions, createEmployeesTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_ACTIVE_COLUMN_INDEX = employeesTableColumnIndex.active
const EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX = employeesTableColumnIndex.approvalStatus
const EMPLOYEE_CONTRACT_COLUMN_INDEX = employeesTableColumnIndex.contract
const EMPLOYEE_NAME_COLUMN_INDEX = employeesTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = employeesTableColumns.length - 1
const EMPLOYEES_SORTABLE_COLUMNS = Object.keys(employeesTableSortByColumn).map((index) => Number(index))

export default function EmployeesDashboardPage() {
  // --- Store ---
  const navigate = useNavigate()
  const employeesRows = useStoreEmployees((s) => s.employeesRows)
  const pagination = useStoreEmployees((s) => s.pagination)
  const queryParams = useStoreEmployees((s) => s.queryParams)
  const loadingEmployees = useStoreEmployees((s) => s.loadingEmployees)
  const employeeDetail = useStoreEmployees((s) => s.employeeDetail)
  const loadingEmployeeDetail = useStoreEmployees((s) => s.loadingEmployeeDetail)
  const detailError = useStoreEmployees((s) => s.operationStatus.detail.error)
  const loadingToggleStatus = useStoreEmployees((s) => s.loadingToggleStatus)
  const loadingLinkUser = useStoreEmployees((s) => s.loadingLinkUser)
  const availableUsers = useStoreEmployees((s) => s.availableUsers)
  const loadingAvailableUsers = useStoreEmployees((s) => s.loadingAvailableUsers)
  const listError = useStoreEmployees((s) => s.operationStatus.list.error)
  const toggleError = useStoreEmployees((s) => s.operationStatus.toggle.error)
  const linkError = useStoreEmployees((s) => s.operationStatus.link.error)
  const clearOperationStatus = useStoreEmployees((s) => s.clearOperationStatus)
  const getEmployees = useStoreEmployees((s) => s.getEmployees)
  const goToPage = useStoreEmployees((s) => s.goToPage)
  const setSearch = useStoreEmployees((s) => s.setSearch)
  const setActiveFilter = useStoreEmployees((s) => s.setActiveFilter)
  const setApprovalStatusFilter = useStoreEmployees((s) => s.setApprovalStatusFilter)
  const setCreatedDateRange = useStoreEmployees((s) => s.setCreatedDateRange)
  const clearActiveFilter = useStoreEmployees((s) => s.clearActiveFilter)
  const clearApprovalStatusFilter = useStoreEmployees((s) => s.clearApprovalStatusFilter)
  const clearCreatedDateRange = useStoreEmployees((s) => s.clearCreatedDateRange)
  const searchEmployees = useStoreEmployees((s) => s.searchEmployees)
  const sortEmployees = useStoreEmployees((s) => s.sortEmployees)
  const getEmployeeDetail = useStoreEmployees((s) => s.getEmployeeDetail)
  const clearEmployeeDetail = useStoreEmployees((s) => s.clearEmployeeDetail)
  const toggleEmployeeStatus = useStoreEmployees((s) => s.toggleEmployeeStatus)
  const getAvailableUsers = useStoreEmployees((s) => s.getAvailableUsers)
  const linkEmployeeUser = useStoreEmployees((s) => s.linkEmployeeUser)
  const unlinkEmployeeUser = useStoreEmployees((s) => s.unlinkEmployeeUser)
  const clearAvailableUsers = useStoreEmployees((s) => s.clearAvailableUsers)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canUpdateEmployee = hasPermission('EMPLOYEE', 'canUpdate')
  const canToggleEmployeeStatus = canUpdateEmployee

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)
  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  const { actionViewDetail, actionUpdateEmployee, actionToggleStatus, actionLinkUser, actionUnlinkUser } = createEmployeesActions()

  // --- State ---
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    approvalStatusId: queryParams.statusId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
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
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  // --- Derived ---
  const employeeDetailView = employeeDetail ? mapperEmployeeDetailView(employeeDetail) : null
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const approvalStatusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const availableUsersSelectOptions = availableUsers.map((user) => ({ label: user.name, value: String(user.id) }))
  const activeSortColumn = EMPLOYEES_SORTABLE_COLUMNS.find((index) => employeesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  // --- Effects ---
  useEffect(() => {
    void getEmployees()
    void getStatusOptions()
    void getApprovalEmployeeStatusOptions()
  }, [getEmployees, getStatusOptions, getApprovalEmployeeStatusOptions])

  // --- Handlers: Detail ---
  const handleViewDetail = (row: EmployeeTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Trabajador'))
    setDetailOpen(true)
    void getEmployeeDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearEmployeeDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getEmployeeDetail(selectedDetailRowId)
  }

  // --- Handlers: Navigate ---
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

  // --- Handlers: Toggle status ---
  const handleToggleStatus = (row: EmployeeTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  // --- Row actions & table helpers ---
  const resolveRowActions = (row: EmployeeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateEmployee(() => handleUpdateEmployee(row)),
    ]

    if (canUpdateEmployee) {
      const hasLinkedUser = (row.linkedUserId ?? 0) > 0 || (row.linkedUserEmail ?? '').trim().length > 0
      if (hasLinkedUser) {
        actions.push(actionUnlinkUser(() => handleOpenUnlinkUser(row)))
      } else {
        actions.push(actionLinkUser(() => handleOpenLinkUser(row)))
      }
    }

    if (canToggleEmployeeStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findEmployeeRowById = (rowId: string) => employeesRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const employeeRow = findEmployeeRowById(rowId)
    if (!employeeRow) return
    handleViewDetail(employeeRow)
  }
  const getEmployeeHasContract = (rowId: string) => Boolean(findEmployeeRowById(rowId)?.hasContract)
  const getEmployeeIsActive = (rowId: string) => Boolean(findEmployeeRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const employeeRow = findEmployeeRowById(tableRow.id)
    if (!employeeRow) return []
    return resolveRowActions(employeeRow)
  }

  const renderCustomCell = createEmployeesTableCustomRenderer({
    nameColumnIndex: EMPLOYEE_NAME_COLUMN_INDEX,
    approvalStatusColumnIndex: EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX,
    contractColumnIndex: EMPLOYEE_CONTRACT_COLUMN_INDEX,
    activeColumnIndex: EMPLOYEE_ACTIVE_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getHasContract: getEmployeeHasContract,
    getIsActive: getEmployeeIsActive,
  })

  // --- Handlers: Sort ---
  const handleSortChange = async (columnIndex: number) => {
    const sortBy = employeesTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortEmployees(sortBy, nextSortDir)
  }

  // --- Handlers: Filters ---
  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleActiveFilterChange = (value: string) => handleChangeFilter('activeId', value)
  const handleApprovalStatusFilterChange = (value: string) => handleChangeFilter('approvalStatusId', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    const selectedApprovalStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.approvalStatusId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setApprovalStatusFilter(selectedApprovalStatus ? String(selectedApprovalStatus.id) : '')
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    await searchEmployees()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      activeId: '',
      approvalStatusId: '',
      createdFrom: '',
      createdTo: '',
    })
    clearActiveFilter()
    clearApprovalStatusFilter()
    clearCreatedDateRange()
    await searchEmployees()
    setFiltersOpen(false)
  }

  // --- Handlers: Confirm ---
  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.active !== true
    const employeeName = pendingToggleRow.values[EMPLOYEE_NAME_COLUMN_INDEX]
    const success = await toggleEmployeeStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getEmployees()
      navigate(AUTH_ROUTE_EMPLOYEES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${employeeName} ${nextStatus ? messages.employees.status.success.toggleEnabledSuccess : messages.employees.status.success.toggleDisabledSuccess}`,
      )
    }
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
    if (!pendingLinkRow || loadingLinkUser) return

    const parsedUserId = Number(selectedAvailableUserId)
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      setLinkValidationErrorMessage(messages.employees.status.errors.linkUserRequired)
      return
    }

    const success = await linkEmployeeUser(pendingLinkRow.id, parsedUserId)
    if (success) {
      const employeeName = pendingLinkRow.values[EMPLOYEE_NAME_COLUMN_INDEX] || 'Trabajador'
      setLinkConfirmOpen(false)
      setPendingLinkRow(null)
      setSelectedAvailableUserId('')
      setAvailableUsersSearch('')
      clearAvailableUsers()
      setLinkValidationErrorMessage('')
      await getEmployees()
      if (selectedDetailRowId === pendingLinkRow.id && detailOpen) {
        void getEmployeeDetail(pendingLinkRow.id)
      }
      setActionsMessage(`${employeeName} ${messages.employees.status.success.linkUserSuccess}`)
    }
  }

  const handleConfirmUnlinkUser = async () => {
    if (!pendingUnlinkRow || loadingLinkUser) return

    const success = await unlinkEmployeeUser(pendingUnlinkRow.id)
    if (success) {
      const employeeName = pendingUnlinkRow.values[EMPLOYEE_NAME_COLUMN_INDEX] || 'Trabajador'
      setUnlinkConfirmOpen(false)
      setPendingUnlinkRow(null)
      await getEmployees()
      if (selectedDetailRowId === pendingUnlinkRow.id && detailOpen) {
        void getEmployeeDetail(pendingUnlinkRow.id)
      }
      setActionsMessage(`${employeeName} ${messages.employees.status.success.unlinkUserSuccess}`)
    }
  }

  // --- Handlers: Download & Upload ---
  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await employeesService.exportEmployeesCsv()
      downloadBlobFile(csvBlob, 'employees.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (employeesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo descargar el reporte.')
      } else {
        setActionsMessage('No se pudo descargar el reporte.')
      }
    } finally {
      setDownloadingReport(false)
    }
  }

  const handleBulkUpload = () => {
    if (uploadingBulk) return
    bulkUploadInputRef.current?.click()
  }

  const handleBulkUploadFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || uploadingBulk) return

    try {
      setUploadingBulk(true)
      const result = await employeesService.importEmployeesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getEmployees()
    } catch (error) {
      if (employeesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  // --- Computed messages ---
  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} al trabajador ${pendingToggleRow.values[EMPLOYEE_NAME_COLUMN_INDEX]}?`
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

      {linkError && (
        <AlertMessageComponent
          message={linkError}
          tone="error"
          onClose={() => clearOperationStatus('link')}
        />
      )}

      {statusOptionsErrorMessage && (
        <AlertMessageComponent
          message={statusOptionsErrorMessage}
          tone="error"
          onClose={clearStatusOptionsStatus}
        />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchEmployees()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingEmployees || loadingToggleStatus || loadingLinkUser}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre, apellido o correo"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingEmployees || loadingToggleStatus || loadingLinkUser}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingEmployees ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingEmployees || loadingToggleStatus || loadingLinkUser}
            className="flex-1 md:flex-none"
            label="Nuevo trabajador"
            onClick={() => navigate(AUTH_ROUTE_EMPLOYEES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingEmployees || loadingToggleStatus || loadingLinkUser || downloadingReport || uploadingBulk}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <input
        ref={bulkUploadInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => { void handleBulkUploadFileChange(event) }}
      />

      <TableComponent
        columns={employeesTableColumns}
        rows={employeesRows}
        loading={loadingEmployees}
        emptyMessage="No hay trabajadores registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
        }}
        sortableColumnIndexes={EMPLOYEES_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingEmployees || loadingToggleStatus || loadingLinkUser}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent
        open={filtersOpen}
        title="Filtros"
        onClose={() => setFiltersOpen(false)}
      >
        <div className="space-y-4">
          <SelectComponent
            value={filters.activeId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={handleActiveFilterChange}
          />
          <SelectComponent
            value={filters.approvalStatusId}
            label="Estado de aprobacion"
            options={approvalStatusSelectOptions}
            onValueChange={handleApprovalStatusFilterChange}
          />
          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                value={filters.createdFrom}
                type="date"
                label="Desde"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                value={filters.createdTo}
                type="date"
                label="Hasta"
                aria-label="Fecha creacion hasta"
                onValueChange={handleCreatedToFilterChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingEmployees || loadingToggleStatus || loadingLinkUser || loadingStatusOptions || loadingApprovalEmployeeStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingEmployees || loadingToggleStatus || loadingLinkUser || loadingStatusOptions || loadingApprovalEmployeeStatusOptions}
              className="text-white dark:text-white"
              label={loadingEmployees || loadingStatusOptions || loadingApprovalEmployeeStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent
        open={detailOpen}
        title={selectedDetailName ? `Detalle de ${selectedDetailName}` : 'Detalle de trabajador'}
        onClose={handleCloseDetail}
      >
        <EmployeeDetailComponent
          key={selectedDetailRowId ?? 'empty-employee-detail'}
          detail={employeeDetailView}
          loading={loadingEmployeeDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={
            selectedDetailRowId
              ? () => navigate(`${AUTH_ROUTE_EMPLOYEES_EDIT}=${selectedDetailRowId}`)
              : undefined
          }
          moreActions={
            selectedDetailRowId
              ? (findEmployeeRowById(selectedDetailRowId)
                  ? resolveRowActions(findEmployeeRowById(selectedDetailRowId)!).filter(
                      (action) => action.id !== 'view-detail' && action.id !== 'update-employee',
                    )
                  : [])
              : []
          }
        />
      </DetailSidebarComponent>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar cambio de estado"
        message={confirmMessage}
        confirmLabel="Confirmar"
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
