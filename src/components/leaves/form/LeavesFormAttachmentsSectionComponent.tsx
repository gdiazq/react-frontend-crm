import { DetailSectionHeaderComponent, FileDropzoneComponent } from '@/components'
import { LEAVE_FILES_MAX_COUNT } from '@/factories'

interface LeavesFormAttachmentsSectionComponentProps {
  files: File[]
  filesError: string | null
  saving: boolean
  onAddFiles: (incomingFiles: File[]) => void
  onRemoveFile: (index: number) => void
  onClearFiles: () => void
}

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

export function LeavesFormAttachmentsSectionComponent(props: LeavesFormAttachmentsSectionComponentProps) {
  const { files, filesError, saving, onAddFiles, onRemoveFile, onClearFiles } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="02" title="Adjuntos" />
      <div className="space-y-3">
        <SubSectionLabel number="02.1" title="Documentos del permiso" />
        <FileDropzoneComponent
          files={files}
          error={filesError}
          maxFiles={LEAVE_FILES_MAX_COUNT}
          disabled={saving}
          helperText="Opcional. Máximo 5 archivos y 10 MB por archivo."
          onAddFiles={onAddFiles}
          onRemoveFile={onRemoveFile}
          onClearFiles={onClearFiles}
        />
      </div>
    </section>
  )
}
