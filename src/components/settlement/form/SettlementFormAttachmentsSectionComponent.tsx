import { DetailSectionHeaderComponent, FileDropzoneComponent } from '@/components'
import type { SettlementDocument } from '@/types'

interface SettlementFormAttachmentsSectionComponentProps {
  sectionNumber: string
  files: File[]
  existingDocuments: SettlementDocument[]
  filesError: string | null
  saving: boolean
  maxFiles: number
  onAddFiles: (incoming: File[]) => void
  onRemoveFile: (index: number) => void
  onRemoveExistingFile: (index: number) => void
  onClearFiles: () => void
  onClearExistingFiles: () => void
}

export function SettlementFormAttachmentsSectionComponent({
  sectionNumber,
  files,
  existingDocuments,
  filesError,
  saving,
  maxFiles,
  onAddFiles,
  onRemoveFile,
  onRemoveExistingFile,
  onClearFiles,
  onClearExistingFiles,
}: SettlementFormAttachmentsSectionComponentProps) {
  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number={sectionNumber} title="Documentos" />
      <FileDropzoneComponent
        files={files}
        existingFiles={existingDocuments}
        error={filesError}
        maxFiles={maxFiles}
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
