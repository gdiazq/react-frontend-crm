import type { CsvImportResponse } from '@/types'

interface MergeUniqueFilesParams {
  currentFiles: File[]
  incomingFiles: File[]
  maxFiles: number
  maxFileSizeBytes: number
}

interface MergeUniqueFilesResult {
  files: File[]
  exceededMaxFiles: boolean
  exceededFileSize: boolean
}

export function resolveFileSize(size: number): string {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${size} B`
}

export function getFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function mergeUniqueFiles({
  currentFiles,
  incomingFiles,
  maxFiles,
  maxFileSizeBytes,
}: MergeUniqueFilesParams): MergeUniqueFilesResult {
  if (maxFiles <= 0) {
    return {
      files: currentFiles,
      exceededMaxFiles: true,
      exceededFileSize: false,
    }
  }

  const files: File[] = []
  const fileKeys = new Set<string>()
  let exceededFileSize = false

  currentFiles.forEach((file) => {
    const key = getFileKey(file)
    if (fileKeys.has(key)) return
    fileKeys.add(key)
    files.push(file)
  })

  incomingFiles.forEach((file) => {
    if (file.size > maxFileSizeBytes) {
      exceededFileSize = true
      return
    }

    const key = getFileKey(file)
    if (fileKeys.has(key)) return
    fileKeys.add(key)
    files.push(file)
  })

  return {
    files: files.slice(0, maxFiles),
    exceededMaxFiles: files.length > maxFiles,
    exceededFileSize,
  }
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
