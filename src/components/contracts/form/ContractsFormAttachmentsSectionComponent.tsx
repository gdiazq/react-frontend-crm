import { DetailSectionHeaderComponent, FileDropzoneComponent } from '@/components'
import { CONTRACT_FILES_MAX_COUNT } from '@/factories'

interface ContractsFormAttachmentsSectionComponentProps {
  files: File[]
  filesError: string | null
  saving: boolean
  onAddFiles: (incoming: File[]) => void
  onRemoveFile: (index: number) => void
  onClearFiles: () => void
}

export function ContractsFormAttachmentsSectionComponent(props: ContractsFormAttachmentsSectionComponentProps) {
  const { files, filesError, saving, onAddFiles, onRemoveFile, onClearFiles } = props

  return (
    <section className="space-y-4">
      <DetailSectionHeaderComponent number="05" title="Adjuntos" />
      <FileDropzoneComponent
        files={files}
        error={filesError}
        maxFiles={CONTRACT_FILES_MAX_COUNT}
        disabled={saving}
        helperText="Opcional. Máximo 5 archivos y 10 MB por archivo."
        onAddFiles={onAddFiles}
        onRemoveFile={onRemoveFile}
        onClearFiles={onClearFiles}
      />
    </section>
  )
}
