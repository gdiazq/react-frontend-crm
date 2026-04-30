import type { ReactNode } from 'react'

export interface TableRow {
  id: string
  values: (string | ReactNode)[]
}

export type TableSortDirection = 'asc' | 'desc'

export interface TableSortState {
  columnIndex: number | null
  direction: TableSortDirection
}

export interface TableComponentProps {
  columns: string[]
  rows: TableRow[]
  loading?: boolean
  emptyMessage?: string
  scrollContainerClassName?: string
  preserveHeaderCase?: boolean
  renderCell?: (row: TableRow, value: string | ReactNode, columnIndex: number, rowIndex: number) => ReactNode
  sortableColumnIndexes?: number[]
  sortState?: TableSortState
  onSortChange?: (columnIndex: number) => void
}
