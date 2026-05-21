import { DetailSectionHeaderComponent, FileDropzoneComponent } from '@/components'
import { TRANSFER_FILES_MAX_COUNT } from '@/factories'
import type { TransferExistingFileView } from '@/types'

interface TransferFormAttachmentsSectionComponentProps {
  transferFiles: File[]
  existingFiles: TransferExistingFileView[]
  filesError: string | null
  saving: boolean
  onAddFiles: (incoming: File[]) => void
  onRemoveFile: (index: number) => void
  onRemoveExistingFile: (index: number) => void
  onClearFiles: () => void
  onClearExistingFiles: () => void
}

export function TransferFormAttachmentsSectionComponent({
  transferFiles,
  existingFiles,
  filesError,
  saving,
  onAddFiles,
  onRemoveFile,
  onRemoveExistingFile,
  onClearFiles,
  onClearExistingFiles,
}: TransferFormAttachmentsSectionComponentProps) {
  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="02" title="Documentos" />
      <FileDropzoneComponent
        files={transferFiles}
        existingFiles={existingFiles}
        error={filesError}
        maxFiles={TRANSFER_FILES_MAX_COUNT}
        disabled={saving}
        helperText="Opcional. Máximo 5 archivos y 10 MB por archivo."
        onAddFiles={onAddFiles}
        onRemoveFile={onRemoveFile}
        onRemoveExistingFile={onRemoveExistingFile}
        onClearFiles={onClearFiles}
        onClearExistingFiles={onClearExistingFiles}
      />
    </section>
  )
}
