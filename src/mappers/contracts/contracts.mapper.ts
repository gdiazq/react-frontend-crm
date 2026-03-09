import type {
  ContractPagedResponse,
  ContractRaw,
  ContractsPagination,
  ContractsQueryParams,
  ContractTableRow,
} from '@/types'
import messages from '@/messages/messages'
import { formatDate } from '@/utils'

export function mapperContractsRows(result: ContractRaw[]): ContractTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.contractType,
      item.contractStatus,
      item.company,
      formatDate(item.startDate),
      formatDate(item.endDate || '', '-'),
      item.active ? messages.contracts.ui.statusActive : messages.contracts.ui.statusInactive,
      formatDate(item.createdAt),
      '',
    ],
  }))
}

export function mapperContractsPagination(result: ContractPagedResponse): ContractsPagination {
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 10
  const totalElements = result.totalElements ?? result.total ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.active ?? 0
  const first = result.first ?? page === 0
  const last = result.last ?? page >= totalPages - 1

  return {
    page,
    size,
    totalElements,
    totalPages,
    total,
    active,
    first,
    last,
  }
}

export function mapperContractsQueryParams(result: ContractsQueryParams): Record<string, number | string> {
  const employeeId = result.employeeId.trim()
  const statusId = result.statusId.trim()
  const createdFrom = result.createdFrom.trim()
  const createdTo = result.createdTo.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
  }

  if (employeeId.length > 0) {
    const parsedEmployeeId = Number(employeeId)
    if (Number.isInteger(parsedEmployeeId) && parsedEmployeeId > 0) queryParams.employeeId = parsedEmployeeId
  }

  if (statusId.length > 0) {
    const parsedStatusId = Number(statusId)
    if (Number.isInteger(parsedStatusId) && parsedStatusId > 0) queryParams.statusId = parsedStatusId
  }

  if (createdFrom.length > 0) queryParams.createdFrom = createdFrom
  if (createdTo.length > 0) queryParams.createdTo = createdTo

  return queryParams
}
