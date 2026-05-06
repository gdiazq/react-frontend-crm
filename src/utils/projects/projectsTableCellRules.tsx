import { StatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { ProjectTableRow, SelectProjectSpecialtyOption, SelectProjectStatusOption, SelectProjectTypeOption, TableRow } from '@/types'

interface CreateProjectsTableCustomRendererParams {
  nameColumnIndex: number
  typeColumnIndex: number
  statusColumnIndex: number
  specialtyColumnIndex: number
  activeColumnIndex: number
  onViewDetail: (rowId: string) => void
  projectTypeOptions: SelectProjectTypeOption[]
  projectStatusOptions: SelectProjectStatusOption[]
  projectSpecialtyOptions: SelectProjectSpecialtyOption[]
  getActive: (rowId: string) => boolean
}

function resolveOptionName(options: { id: number, name: string }[], optionId?: number | null): string {
  if (!optionId) return '-'
  return options.find((option) => option.id === optionId)?.name || '-'
}

export function createProjectsTableCustomRenderer({
  nameColumnIndex,
  typeColumnIndex,
  statusColumnIndex,
  specialtyColumnIndex,
  activeColumnIndex,
  onViewDetail,
  projectTypeOptions,
  projectStatusOptions,
  projectSpecialtyOptions,
  getActive,
}: CreateProjectsTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row
    const projectRow = row as ProjectTableRow

    if (columnIndex == nameColumnIndex) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => onViewDetail(tableRow.id)}
        >
          {value}
        </button>
      )
    }

    if (columnIndex == typeColumnIndex) {
      return resolveOptionName(projectTypeOptions, projectRow.typeId)
    }

    if (columnIndex == statusColumnIndex) {
      return resolveOptionName(projectStatusOptions, projectRow.statusId)
    }

    if (columnIndex == specialtyColumnIndex) {
      return resolveOptionName(projectSpecialtyOptions, projectRow.specialtyId)
    }

    if (columnIndex == activeColumnIndex) {
      return <StatusBadgeComponent enabled={getActive(tableRow.id)} />
    }

    return null
  }
}
