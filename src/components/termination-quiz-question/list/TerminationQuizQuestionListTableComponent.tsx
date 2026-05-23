import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { terminationQuizQuestionTableColumns, terminationQuizQuestionTableColumnIndex, terminationQuizQuestionTableSortByColumn } from '@/factories'
import { useStoreAuth, useStoreTerminationQuizQuestion } from '@/store'
import type { TerminationQuizQuestionTableRow } from '@/types'
import { createTableCustomRenderer, createTerminationQuizQuestionActions, renderStatusBadge, renderViewDetailButton } from '@/utils'
import type { DropdownAction } from '@/utils'

const QUESTION_COLUMN_INDEX = terminationQuizQuestionTableColumnIndex.question
const STATUS_COLUMN_INDEX = terminationQuizQuestionTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = terminationQuizQuestionTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(terminationQuizQuestionTableSortByColumn).map((index) => Number(index))

interface TerminationQuizQuestionListTableComponentProps {
  onViewDetail: (row: TerminationQuizQuestionTableRow) => void
  onToggleStatus: (row: TerminationQuizQuestionTableRow) => void
  loadingExtra?: boolean
}

export function TerminationQuizQuestionListTableComponent(props: TerminationQuizQuestionListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreTerminationQuizQuestion((s) => s.terminationQuizQuestionRows)
  const pagination = useStoreTerminationQuizQuestion((s) => s.pagination)
  const queryParams = useStoreTerminationQuizQuestion((s) => s.queryParams)
  const loading = useStoreTerminationQuizQuestion((s) => s.operationLoading.list)
  const sortTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.sortTerminationQuizQuestion)
  const goToPage = useStoreTerminationQuizQuestion((s) => s.goToPage)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleStatus = hasPermission(PermissionModule.TerminationQuizQuestion, PermissionAction.Update)
  const { actionViewDetail, actionUpdateTerminationQuizQuestion, actionToggleStatus } = createTerminationQuizQuestionActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: TerminationQuizQuestionTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateTerminationQuizQuestion(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_EDIT}=${row.id}`)),
    ]
    if (canToggleStatus) actions.push(actionToggleStatus(row.active === true, () => onToggleStatus(row)))
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [QUESTION_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const questionRow = findRowById(row.id)
      if (questionRow) onViewDetail(questionRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = terminationQuizQuestionTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortTerminationQuizQuestion(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => terminationQuizQuestionTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={terminationQuizQuestionTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay preguntas del quiz de salida registradas."
        preserveHeaderCase
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />
      <div className="flex justify-end">
        <PaginationComponent
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalElements}
          pageSize={pagination.size}
          loading={loading || loadingExtra}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
