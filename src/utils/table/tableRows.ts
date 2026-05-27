import { SortDirection } from '@/constant'
import type { SortDirectionValue } from '@/constant'
import type { TableSortState } from '@/types'

interface IdentifiableTableRow {
  id: string
}

interface ActivableTableRow {
  active?: boolean
}

export function createRowsById<T extends IdentifiableTableRow>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]))
}

export function findRowById<T extends IdentifiableTableRow>(rowsById: Map<string, T>, rowId: string) {
  return rowsById.get(rowId) ?? null
}

export function isTableRowActive<T extends ActivableTableRow>(row: T | null) {
  return row?.active === true
}

export function resolveNextTableSortDir<TSortBy extends string>(
  currentSortBy: TSortBy,
  currentSortDir: SortDirectionValue,
  nextSortBy: TSortBy,
) {
  return currentSortBy === nextSortBy && currentSortDir === SortDirection.Asc
    ? SortDirection.Desc
    : SortDirection.Asc
}

export function resolveActiveSortColumn<TSortBy extends string>(
  sortableColumns: number[],
  sortByColumn: Partial<Record<number, TSortBy>>,
  currentSortBy: TSortBy,
) {
  return sortableColumns.find((index) => sortByColumn[index] === currentSortBy) ?? null
}

export function createTableSortState<TSortBy extends string>(
  sortableColumns: number[],
  sortByColumn: Partial<Record<number, TSortBy>>,
  currentSortBy: TSortBy,
  currentSortDir: SortDirectionValue,
): TableSortState {
  return {
    columnIndex: resolveActiveSortColumn(sortableColumns, sortByColumn, currentSortBy),
    direction: currentSortDir,
  }
}
