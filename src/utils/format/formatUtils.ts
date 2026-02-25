export const formatDateTime = (value?: string, fallback = ''): string => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-CL')
}

export const formatDate = (value?: string, fallback = ''): string => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-CL')
}
