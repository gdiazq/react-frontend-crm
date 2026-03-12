import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
  UserDetailComponent,
} from '@/components'
import { AUTH_ROUTE_USERS, AUTH_ROUTE_USERS_CREATE, AUTH_ROUTE_USERS_EDIT } from '@/constant'
import { usersTableColumns, usersTableColumnIndex, usersTableSortByColumn } from '@/factories'
import { mapperUserDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { usersService } from '@/services'
import { useStoreAuth, useStoreSelects, useStoreUsers } from '@/store'
import type { UserTableRow } from '@/types'
import type { TableRow, TableSortState } from '@/components'
import { createUsersActions, createUsersTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const STATUS_COLUMN_INDEX = usersTableColumnIndex.status
const EMAIL_COLUMN_INDEX = usersTableColumnIndex.email
const ACTIONS_COLUMN_INDEX = usersTableColumns.length - 1
const USERS_SORTABLE_COLUMNS = Object.keys(usersTableSortByColumn).map((index) => Number(index))

export default function UsersDashboardPage() {
  // --- Store ---
  const navigate = useNavigate()
  const usersRows = useStoreUsers((s) => s.usersRows)
  const userDetail = useStoreUsers((s) => s.userDetail)
  const pagination = useStoreUsers((s) => s.pagination)
  const queryParams = useStoreUsers((s) => s.queryParams)
  const loadingUsers = useStoreUsers((s) => s.loadingUsers)
  const loadingUserDetail = useStoreUsers((s) => s.loadingUserDetail)
  const loadingToggleStatus = useStoreUsers((s) => s.loadingToggleStatus)
  const errorMessage = useStoreUsers((s) => s.errorMessage)
  const detailErrorMessage = useStoreUsers((s) => s.detailErrorMessage)
  const getUsers = useStoreUsers((s) => s.getUsers)
  const getUserDetail = useStoreUsers((s) => s.getUserDetail)
  const setSearch = useStoreUsers((s) => s.setSearch)
  const searchUsers = useStoreUsers((s) => s.searchUsers)
  const sortUsers = useStoreUsers((s) => s.sortUsers)
  const setAdvancedFilters = useStoreUsers((s) => s.setAdvancedFilters)
  const clearAdvancedFilters = useStoreUsers((s) => s.clearAdvancedFilters)
  const clearUserDetail = useStoreUsers((s) => s.clearUserDetail)
  const mutationToggleUserStatus = useStoreUsers((s) => s.mutationToggleUserStatus)
  const goToPage = useStoreUsers((s) => s.goToPage)
  const clearStatus = useStoreUsers((s) => s.clearStatus)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleUserStatus = hasPermission('USER', 'canUpdate')

  const roleOptions = useStoreSelects((s) => s.roleOptions)
  const userNameOptions = useStoreSelects((s) => s.userNameOptions)
  const userEmailOptions = useStoreSelects((s) => s.userEmailOptions)
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingUsersFilterOptions = useStoreSelects((s) => s.loadingUsersFilterOptions)
  const usersFilterOptionsErrorMessage = useStoreSelects((s) => s.usersFilterOptionsErrorMessage)
  const getUsersFilterOptions = useStoreSelects((s) => s.getUsersFilterOptions)
  const clearUsersFilterOptionsStatus = useStoreSelects((s) => s.clearUsersFilterOptionsStatus)

  const { actionViewDetail, actionUpdateUser, actionToggleStatus } = createUsersActions()

  // --- State ---
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    userNameId: '',
    userEmailId: '',
    statusId: '',
    roleId: '',
  })
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<UserTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  // --- Derived ---
  const userDetailView = mapperUserDetailView(userDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const nameSelectOptions = userNameOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const emailSelectOptions = userEmailOptions.map((option) => ({ label: option.email, value: String(option.id) }))
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const roleSelectOptions = roleOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = USERS_SORTABLE_COLUMNS.find((index) => usersTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  // --- Effects ---
  useEffect(() => {
    getUsers()
    void getUsersFilterOptions()
  }, [getUsers, getUsersFilterOptions])

  // --- Handlers: Detail ---
  const handleViewDetail = (row: UserTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getUserDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearUserDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getUserDetail(selectedDetailRowId)
  }

  // --- Handlers: Navigate ---
  const handleUpdateUser = (row: UserTableRow) => {
    navigate(`${AUTH_ROUTE_USERS_EDIT}=${row.id}`)
  }

  // --- Handlers: Toggle status ---
  const handleToggleStatus = async (row: UserTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  // --- Row actions & table helpers ---
  const resolveRowActions = (row: UserTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateUser(() => handleUpdateUser(row)),
    ]

    if (canToggleUserStatus) {
      actions.push(actionToggleStatus(row.status === true, () => { void handleToggleStatus(row) }))
    }

    return actions
  }

  const findUserRowById = (rowId: string) => usersRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const userRow = findUserRowById(rowId)
    if (!userRow) return
    handleViewDetail(userRow)
  }
  const getUserStatusEnabled = (rowId: string) => Boolean(findUserRowById(rowId)?.status)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const userRow = findUserRowById(tableRow.id)
    if (!userRow) return []
    return resolveRowActions(userRow)
  }

  const renderCustomCell = createUsersTableCustomRenderer({
    emailColumnIndex: EMAIL_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled: getUserStatusEnabled,
  })

  // --- Handlers: Sort ---
  const handleSortChange = async (columnIndex: number) => {
    const sortBy = usersTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortUsers(sortBy, nextSortDir)
  }

  // --- Handlers: Filters ---
  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleUserNameFilterChange = (value: string) => handleChangeFilter('userNameId', value)
  const handleUserEmailFilterChange = (value: string) => handleChangeFilter('userEmailId', value)
  const handleStatusFilterChange = (value: string) => handleChangeFilter('statusId', value)
  const handleRoleFilterChange = (value: string) => handleChangeFilter('roleId', value)

  const handleApplyFilters = async () => {
    const selectedNameRaw = userNameOptions.find((option) => String(option.id) === filters.userNameId)?.name.trim() ?? ''
    const selectedName = selectedNameRaw.split(/\s+/)[0]?.toLowerCase() ?? ''
    const selectedEmail = userEmailOptions.find((option) => String(option.id) === filters.userEmailId)?.email ?? ''
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedRoleId = roleOptions.find((option) => String(option.id) === filters.roleId)?.id

    setAdvancedFilters({
      name: selectedName,
      email: selectedEmail,
      status: selectedStatus ? String(selectedStatus.id) : '',
      roleId: selectedRoleId ? String(selectedRoleId) : '',
    })
    await searchUsers()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      userNameId: '',
      userEmailId: '',
      statusId: '',
      roleId: '',
    })
    clearAdvancedFilters()
    await searchUsers()
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

    const nextStatus = pendingToggleRow.status !== true
    const username = pendingToggleRow.values[0]
    const success = await mutationToggleUserStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getUsers()
      navigate(AUTH_ROUTE_USERS)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${username} ${nextStatus ? messages.users.status.success.toggleEnabledSuccess : messages.users.status.success.toggleDisabledSuccess}`,
      )
    }
  }

  // --- Handlers: Download & Upload ---
  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await usersService.exportUsersCsv()
      downloadBlobFile(csvBlob, 'users.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (usersService.isAxiosError(error)) {
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
      const result = await usersService.importUsersCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getUsers()
    } catch (error) {
      if (usersService.isAxiosError(error)) {
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
    ? `¿Seguro que deseas ${pendingToggleRow.status === true ? 'deshabilitar' : 'habilitar'} al usuario ${pendingToggleRow.values[0]}?`
    : ''
  const detailTitle = userDetail ? `Detalle de ${userDetail.username}` : 'Detalle de usuario'

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de usuarios</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total usuarios"
        activeLabel="Usuarios activos"
        total={pagination.total}
        active={pagination.active}
      />

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
        />
      )}

      {usersFilterOptionsErrorMessage && (
        <AlertMessageComponent
          message={usersFilterOptionsErrorMessage}
          tone="error"
          onClose={clearUsersFilterOptionsStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchUsers()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingUsers || loadingToggleStatus}
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
            disabled={loadingUsers || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingUsers ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingUsers || loadingToggleStatus}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nuevo usuario"
            onClick={() => navigate(AUTH_ROUTE_USERS_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingUsers || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={usersTableColumns}
        rows={usersRows}
        loading={loadingUsers}
        emptyMessage="No hay usuarios registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={USERS_SORTABLE_COLUMNS}
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
          loading={loadingUsers}
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
            value={filters.userNameId}
            label="Nombre"
            options={nameSelectOptions}
            onValueChange={handleUserNameFilterChange}
          />
          <SelectComponent
            value={filters.userEmailId}
            label="Email"
            options={emailSelectOptions}
            onValueChange={handleUserEmailFilterChange}
          />
          <SelectComponent
            value={filters.statusId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={handleStatusFilterChange}
          />
          <SelectComponent
            value={filters.roleId}
            label="Rol"
            options={roleSelectOptions}
            onValueChange={handleRoleFilterChange}
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingUsers || loadingToggleStatus || loadingUsersFilterOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingUsers || loadingToggleStatus || loadingUsersFilterOptions}
              className="text-white dark:text-white"
              label={loadingUsers || loadingUsersFilterOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent
        open={detailOpen}
        title={detailTitle}
        onClose={handleCloseDetail}
      >
        <UserDetailComponent
          detail={userDetailView}
          loading={loadingUserDetail}
          errorMessage={detailErrorMessage}
          onRetry={handleRetryDetail}
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
    </section>
  )
}
