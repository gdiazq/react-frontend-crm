import type { CsvImportResponse } from '@/types'

export function formatCsvImportSummary(result: CsvImportResponse) {
  const summary = `Carga masiva completada. Total: ${result.total}, Exitosas: ${result.success}, Fallidas: ${result.failed}.`
  if (result.errors.length === 0) return summary

  const previewErrors = result.errors.slice(0, 3).map((error) => `Fila ${error.row}: ${error.message}`).join(' | ')
  const remainingErrors = result.errors.length - 3
  const extraErrorsLabel = remainingErrors > 0 ? ` | +${remainingErrors} errores mas.` : ''
  return `${summary} ${previewErrors}${extraErrorsLabel}`
}
