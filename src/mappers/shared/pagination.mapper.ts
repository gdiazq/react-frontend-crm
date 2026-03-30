import type { Pagination } from '@/types'

interface PagedInput {
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  first?: boolean
  last?: boolean
}

export function mapperPagination(result: PagedInput): Pagination {
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 10
  const totalElements = result.totalElements ?? result.total ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.active ?? 0
  const first = result.first ?? page === 0
  const last = result.last ?? page >= totalPages - 1
  return { page, size, totalElements, totalPages, total, active, first, last }
}
