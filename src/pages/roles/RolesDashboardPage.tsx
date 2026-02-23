import { useEffect, useMemo, useState } from 'react'
import {
  ActionsDropdownComponent,
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  PaginationComponent,
  RightSidebarComponent,
  RoleDetailComponent,
  SaveConfirmComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  TableComponent,
} from '@/components'
import { createRolesActions } from '@/utils'
import type { DropdownAction } from '@/utils'
import type { RoleTableRow, RolesSortBy } from '@/types'
import type { TableRow, TableSortState } from '@/components'
import { rolesTableColumns } from '@/factories'
import { useStoreRoles } from '@/store'
import messages from '@/messages/messages'

const ROLES_SORT_BY_COLUMN: Partial<Record<number, RolesSortBy>> = {
  0: 'name',
  1: 'enabled',
  2: 'createdAt',
  3: 'updatedAt',
}

const ROLES_SORTABLE_COLUMNS = Object.keys(ROLES_SORT_BY_COLUMN).map((index) => Number(index))
const STATUS_COLUMN_INDEX = 1
const ACTIONS_COLUMN_INDEX = rolesTableColumns.length - 1

export default function RolesDashboardPage() {
  const rolesRows = useStoreRoles((s) => s.rolesRows) as RoleTableRow[]
  const rolesRaw = useStoreRoles((s) => s.rolesRaw)
  const pagination = useStoreRoles((s) => s.pagination)
  const queryParams = useStoreRoles((s) => s.queryParams)
  const loadingRoles = useStoreRoles((s) => s.loadingRoles)
  const loadingToggleStatus = useStoreRoles((s) => s.loadingToggleStatus)
  const errorMessage = useStoreRoles((s) => s.errorMessage)
  const getRoles = useStoreRoles((s) => s.getRoles)
  const goToPage = useStoreRoles((s) => s.goToPage)
  const setSearch = useStoreRoles((s) => s.setSearch)
  const searchRoles = useStoreRoles((s) => s.searchRoles)
  const sortRoles = useStoreRoles((s) => s.sortRoles)
  const mutationToggleRoleStatus = useStoreRoles((s) => s.mutationToggleRoleStatus)
  const clearStatus = useStoreRoles((s) => s.clearStatus)
  const { actionViewDetail, actionUpdateRole, actionToggleStatus } = createRolesActions()

  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<RoleTableRow | null>(null)

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = ROLES_SORTABLE_COLUMNS.find((index) => ROLES_SORT_BY_COLUMN[index] === queryParams.sortBy) ?? null
  const roleDetail = useMemo(
    () => rolesRaw.find((role) => String(role.id) === selectedDetailRowId) || null,
    [rolesRaw, selectedDetailRowId],
  )
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getRoles()
  }, [])

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = ROLES_SORT_BY_COLUMN[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortRoles(sortBy, nextSortDir)
  }

  const handleViewDetail = (row: RoleTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    setOpenActionsRowId(null)
  }

  const handleUpdateRole = () => {
    setActionsMessage(messages.roles.ui.updateRoleComingSoon)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = (row: RoleTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: RoleTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail(row)),
    actionUpdateRole(() => handleUpdateRole()),
    actionToggleStatus(row.status === true, () => handleToggleStatus(row)),
  ]

  const renderCell = (row: TableRow, value: React.ReactNode, columnIndex: number, rowIndex: number) => {
    const roleRow = row as RoleTableRow
    if (columnIndex === STATUS_COLUMN_INDEX) {
      return <StatusBadgeComponent enabled={roleRow.status === true} />
    }
    if (columnIndex === ACTIONS_COLUMN_INDEX) {
      const openDirection = rowIndex >= Math.max(rolesRows.length - 2, 0) ? 'up' : 'down'
      return (
        <ActionsDropdownComponent
          open={openActionsRowId === row.id}
          actions={resolveRowActions(roleRow)}
          openDirection={openDirection}
          onToggle={() => setOpenActionsRowId((id) => (id === row.id ? null : row.id))}
        />
      )
    }
    return <span>{value}</span>
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.status !== true
    const success = await mutationToggleRoleStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setActionsMessage(
        `${pendingToggleRow.values[0]} ${
          nextStatus ? messages.roles.status.success.toggleEnabledSuccess : messages.roles.status.success.toggleDisabledSuccess
        }`,
      )
      setConfirmOpen(false)
      setPendingToggleRow(null)
    }
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.status === true ? 'deshabilitar' : 'habilitar'} al rol ${pendingToggleRow.values[0]}?`
    : ''
  const detailTitle = roleDetail ? `Detalle de ${roleDetail.name}` : messages.roles.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de roles</h1>
      </header>

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
        />
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex items-center">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingRoles || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
        </div>
        <div className="flex-1">
          <SearchBarComponent
            value={queryParams.search}
            loading={loadingRoles || loadingToggleStatus}
            placeholder="Buscar por nombre o descripcion de rol"
            buttonClassName="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            onValueChange={setSearch}
            onSearch={() => { void searchRoles() }}
          />
        </div>
        <div className="flex items-center md:ml-auto">
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingRoles || loadingToggleStatus}
            className="text-white dark:text-white"
            label="Nuevo rol"
            onClick={() => setActionsMessage(messages.roles.ui.createRoleComingSoon)}
          />
        </div>
      </div>

      <TableComponent
        columns={rolesTableColumns}
        rows={rolesRows}
        loading={loadingRoles}
        emptyMessage="No hay roles registrados."
        scrollContainerClassName="roles-table-no-vertical-scrollbar"
        renderCell={renderCell}
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
      />
      <DetailSidebarComponent
        open={detailOpen}
        title={detailTitle}
        onClose={handleCloseDetail}
      >
        <RoleDetailComponent detail={roleDetail} />
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
