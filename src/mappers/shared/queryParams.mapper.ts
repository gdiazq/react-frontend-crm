export interface BaseQueryParams {
  page: number
  size: number
  sortBy: string
  sortDir: string
}

export function buildQueryParams(base: BaseQueryParams): Record<string, number | string> {
  return {
    page: base.page,
    size: base.size,
    sortBy: base.sortBy,
    sortDir: base.sortDir,
  }
}

export function appendString(params: Record<string, number | string>, key: string, rawValue: string): void {
  const value = rawValue.trim()
  if (value.length > 0) params[key] = value
}

export function appendBooleanString(params: Record<string, number | string>, key: string, rawValue: string): void {
  const value = rawValue.trim()
  if (value === 'true' || value === 'false') params[key] = value
}

export function appendParsedId(params: Record<string, number | string>, key: string, rawValue: string): void {
  const value = rawValue.trim()
  if (value.length > 0) {
    const parsed = Number(value)
    if (Number.isInteger(parsed) && parsed > 0) params[key] = parsed
  }
}
