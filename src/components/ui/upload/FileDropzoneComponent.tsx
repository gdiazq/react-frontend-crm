import { useRef, useState } from 'react'
import ButtonComponent from '../button/ButtonComponent'

interface FileDropzoneComponentProps {
  label?: string
  files: File[]
  error?: string | null
  helperText?: string
  accept?: string
  maxFiles?: number
  disabled?: boolean
  onAddFiles: (files: File[]) => void
  onRemoveFile: (index: number) => void
  onClearFiles: () => void
}

export default function FileDropzoneComponent({
  label = 'Adjuntar archivos',
  files,
  error,
  helperText,
  accept,
  maxFiles,
  disabled = false,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
}: FileDropzoneComponentProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const reachedMaxFiles = typeof maxFiles === 'number' && maxFiles > 0 && files.length >= maxFiles

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files ? Array.from(event.target.files) : []
    if (selected.length > 0) onAddFiles(selected)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragOver(false)
    if (disabled || reachedMaxFiles) return
    const dropped = Array.from(event.dataTransfer.files || [])
    if (dropped.length > 0) onAddFiles(dropped)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!disabled) setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragOver(false)
  }

  const formatSize = (size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
    if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${size} B`
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        disabled={disabled || reachedMaxFiles}
        accept={accept}
        onChange={handleSelect}
      />

      {!reachedMaxFiles && (
        <div
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              inputRef.current?.click()
            }
          }}
          className={`rounded-2xl border-2 border-dashed p-5 text-sm transition ${
            dragOver
              ? 'border-cyan-400 bg-gradient-to-b from-cyan-50 to-cyan-100/70 dark:border-cyan-300 dark:from-cyan-900/30 dark:to-cyan-950/30'
              : 'border-slate-300 bg-gradient-to-b from-slate-50 to-white dark:border-slate-700 dark:from-slate-800/80 dark:to-slate-900/70'
          } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center justify-center gap-3 py-2 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full border transition ${
              dragOver
                ? 'border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-400/80 dark:bg-cyan-900/40 dark:text-cyan-200'
                : 'border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path d="M7 18a4 4 0 0 1-.2-8A5.5 5.5 0 0 1 17.3 8 3.8 3.8 0 1 1 18 18H7Z" />
                <path d="M12 16V10" />
                <path d="m9.8 12.2 2.2-2.2 2.2 2.2" />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                Cargar documentos
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Arrastra y suelta archivos o haz clic para seleccionar
              </p>
            </div>
          </div>
        </div>
      )}

      {!error && helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Archivos adjuntos ({files.length})
            </p>
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={disabled}
              label="Limpiar"
              onClick={onClearFiles}
            />
          </div>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                <div className="min-w-0">
                  <p className="truncate text-slate-700 dark:text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50 dark:text-rose-400 dark:hover:text-rose-300"
                  disabled={disabled}
                  onClick={() => onRemoveFile(index)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
