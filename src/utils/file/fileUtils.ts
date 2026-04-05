import type { CsvImportResponse } from '@/types'

export function resolveFileSize(size: number): string {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${size} B`
}

export function downloadBlobFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(url)
}

export function formatCsvImportSummary(result: CsvImportResponse) {
  const summary = `Carga masiva completada. Total: ${result.total}, Exitosas: ${result.success}, Fallidas: ${result.failed}.`
  if (result.errors.length === 0) return summary

  const previewErrors = result.errors.slice(0, 3).map((error) => `Fila ${error.row}: ${error.message}`).join(' | ')
  const remainingErrors = result.errors.length - 3
  const extraErrorsLabel = remainingErrors > 0 ? ` | +${remainingErrors} errores mas.` : ''
  return `${summary} ${previewErrors}${extraErrorsLabel}`
}
