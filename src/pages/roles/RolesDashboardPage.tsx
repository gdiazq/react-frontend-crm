import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  RoleDetailComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  AUTH_ROUTE_ROLES,
  AUTH_ROUTE_ROLES_CREATE,
  AUTH_ROUTE_ROLES_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { rolesTableColumns, rolesTableColumnIndex, rolesTableSortByColumn } from '@/factories'
import { mapperRoleDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { rolesService } from '@/services'
import { useStoreAuth, useStoreRoles, useStoreSelects } from '@/store'
import type { RoleTableRow } from '@/types'
import type { TableRow, TableSortState } from '@/components'
import {
  createRolesActions,
  createTableCustomRenderer,
  renderStatusBadge,
  renderViewDetailButton,
  downloadBlobFile,
  formatCsvImportSummary,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const ROLE_NAME_COLUMN_INDEX = rolesTableColumnIndex.name
const STATUS_COLUMN_INDEX = rolesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = rolesTableColumns.length - 1
const ROLES_SORTABLE_COLUMNS = Object.keys(rolesTableSortByColumn).map((index) => Number(index))

export default function RolesDashboardPage() {
  // --- Store ---
  const navigate = useNavigate()
  const rolesRows = useStoreRoles((s) => s.rolesRows)
  const roleDetail = useStoreRoles((s) => s.roleDetail)
  const pagination = useStoreRoles((s) => s.pagination)
  const queryParams = useStoreRoles((s) => s.queryParams)
  const loadingRoles = useStoreRoles((s) => s.operationLoading.list)
  const loadingRoleDetail = useStoreRoles((s) => s.operationLoading.detail)
  const loadingToggleStatus = useStoreRoles((s) => s.operationLoading.toggle)
  const listError = useStoreRoles((s) => s.operationStatus.list.error)
  const detailError = useStoreRoles((s) => s.operationStatus.detail.error)
  const toggleError = useStoreRoles((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreRoles((s) => s.clearOperationStatus)
  const getRoles = useStoreRoles((s) => s.getRoles)
  const getRoleDetail = useStoreRoles((s) => s.getRoleDetail)
  const goToPage = useStoreRoles((s) => s.goToPage)
  const setSearch = useStoreRoles((s) => s.setSearch)
  const searchRoles = useStoreRoles((s) => s.searchRoles)
  const sortRoles = useStoreRoles((s) => s.sortRoles)
  const setStatusFilter = useStoreRoles((s) => s.setStatusFilter)
  const clearStatusFilter = useStoreRoles((s) => s.clearStatusFilter)
  const toggleRoleStatus = useStoreRoles((s) => s.toggleRoleStatus)
  const clearRoleDetail = useStoreRoles((s) => s.clearRoleDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleRoleStatus = hasPermission(PermissionModule.Role, PermissionAction.Update)

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const { actionViewDetail, actionUpdateRole, actionToggleStatus } = createRolesActions()

  // --- State ---
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({ statusId: queryParams.status }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<RoleTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  // --- Derived ---
  const roleDetailView = mapperRoleDetailView(roleDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = ROLES_SORTABLE_COLUMNS.find((index) => rolesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  // --- Effects ---
  useEffect(() => {
    void getRoles()
    void getStatusOptions()
  }, [getRoles, getStatusOptions])

  // --- Handlers: Detail ---
  const handleViewDetail = (row: RoleTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getRoleDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearRoleDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getRoleDetail(selectedDetailRowId)
  }

  // --- Handlers: Navigate ---
  const handleUpdateRole = (row: RoleTableRow) => {
    navigate(`${AUTH_ROUTE_ROLES_EDIT}=${row.id}`)
  }

  const handleUpdateSelectedRole = () => {
    if (!selectedDetailRowId) return
    navigate(`${AUTH_ROUTE_ROLES_EDIT}=${selectedDetailRowId}`)
  }

  // --- Handlers: Toggle status ---
  const handleToggleStatus = (row: RoleTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  // --- Row actions & table helpers ---
  const resolveRowActions = (row: RoleTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateRole(() => handleUpdateRole(row)),
    ]

    if (canToggleRoleStatus) {
      actions.push(actionToggleStatus(row.status === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findRoleRowById = (rowId: string) => rolesRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const roleRow = findRoleRowById(rowId)
    if (!roleRow) return
    handleViewDetail(roleRow)
  }
  const getRoleStatusEnabled = (rowId: string) => Boolean(findRoleRowById(rowId)?.status)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const roleRow = findRoleRowById(tableRow.id)
    if (!roleRow) return []
    return resolveRowActions(roleRow)
  }

  const renderCustomCell = createTableCustomRenderer({
    [ROLE_NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => handleViewDetailById(row.id)),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(getRoleStatusEnabled(row.id)),
  })

  // --- Handlers: Sort ---
  const handleSortChange = async (columnIndex: number) => {
    const sortBy = rolesTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc

    await sortRoles(sortBy, nextSortDir)
  }

  // --- Handlers: Filters ---
  const handleChangeFilter = (value: string) => {
    setFilters({ statusId: value })
  }

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.statusId)
    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    await searchRoles()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({ statusId: '' })
    clearStatusFilter()
    await searchRoles()
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
    const roleName = pendingToggleRow.values[0]
    const success = await toggleRoleStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getRoles()
      navigate(AUTH_ROUTE_ROLES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${roleName} ${
          nextStatus ? messages.roles.status.success.toggleEnabledSuccess : messages.roles.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  // --- Handlers: Download & Upload ---
  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await rolesService.exportRolesCsv()
      downloadBlobFile(csvBlob, 'roles.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (rolesService.isAxiosError(error)) {
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
      const result = await rolesService.importRolesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getRoles()
    } catch (error) {
      if (rolesService.isAxiosError(error)) {
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
    ? `¿Seguro que deseas ${pendingToggleRow.status === true ? 'deshabilitar' : 'habilitar'} al rol ${pendingToggleRow.values[0]}?`
    : ''
  const detailTitle = roleDetailView ? `Detalle de ${roleDetailView.roleNameDisplay}` : messages.roles.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ROLES</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de roles</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total roles"
        activeLabel="Roles activos"
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

      {statusOptionsErrorMessage && (
        <AlertMessageComponent
          message={statusOptionsErrorMessage}
          tone="error"
          onClose={clearStatusOptionsStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchRoles()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingRoles || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre o descripción de rol"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingRoles || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingRoles ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingRoles || loadingToggleStatus}
            className="flex-1 md:flex-none"
            label="Nuevo rol"
            onClick={() => navigate(AUTH_ROUTE_ROLES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingRoles || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={rolesTableColumns}
        rows={rolesRows}
        loading={loadingRoles}
        emptyMessage="No hay roles registrados."
        scrollContainerClassName="roles-table-no-vertical-scrollbar"
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={ROLES_SORTABLE_COLUMNS}
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
          loading={loadingRoles || loadingToggleStatus}
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
            value={filters.statusId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={handleChangeFilter}
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingRoles || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingRoles || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingRoles || loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
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
        <RoleDetailComponent
          detail={roleDetailView}
          loading={loadingRoleDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={handleUpdateSelectedRole}
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
