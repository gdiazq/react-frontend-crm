import messages from '@/messages/messages'
import type {
  EmployeePagedResponse,
  EmployeeRaw,
  EmployeeTableRow,
  EmployeesPagination,
  EmployeesQueryParams,
} from '@/types'
import { formatDate } from '@/utils'

export function mapperEmployeesRows(response: EmployeeRaw[]): EmployeeTableRow[] {
  return response.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.identification,
      `${item.firstName} ${item.paternalLastName} ${item.maternalLastName}`.trim(),
      item.corporateEmail,
      item.phone ?? '',
      item.rehireEligible ? messages.employees.ui.rehireEligibleYes : messages.employees.ui.rehireEligibleNo,
      item.active ? messages.employees.ui.statusActive : messages.employees.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
    ],
  }))
}

export function mapperEmployeesPagination(response: EmployeePagedResponse): EmployeesPagination {
  const page = response.page ?? response.number ?? 0
  const size = response.size ?? 8
  const totalElements = response.totalElements ?? response.total ?? 0
  const totalPages = response.totalPages ?? 0
  const total = response.total ?? totalElements
  const active = response.active ?? 0
  const first = response.first ?? page === 0
  const last = response.last ?? page >= totalPages - 1

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

export function mapperEmployeesQueryParams(queryParams: EmployeesQueryParams): Record<string, string | number> {
  const search = queryParams.search.trim()
  const active = queryParams.active.trim()
  const result: Record<string, string | number> = {
    page: queryParams.page,
    size: queryParams.size,
    sortBy: queryParams.sortBy,
    sortDir: queryParams.sortDir,
  }

  if (search.length > 0) result.search = search
  if (active === 'true' || active === 'false') result.active = active

  return result
}
