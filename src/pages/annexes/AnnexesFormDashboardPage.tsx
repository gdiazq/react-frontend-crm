import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DatePickerComponent,
  DetailSectionHeaderComponent,
  FileDropzoneComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_ANNEXES } from '@/constant'
import { initialCreateAnnexForm, ANNEX_FILES_MAX_COUNT, ANNEX_FILE_MAX_SIZE_BYTES } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperAnnexDetailToForm, mapperCreateAnnexPayload, mapperUpdateAnnexPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAnnexes, useStoreAnnexSelects } from '@/store'
import type { AnnexCreatePayload, AnnexUpdatePayload } from '@/types'
import { annexesCreateValidationRules } from '@/validators'

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

type PendingAction =
  | { mode: 'create', payload: AnnexCreatePayload, files: File[] }
  | { mode: 'update', payload: AnnexUpdatePayload, files: File[] }
  | null

export default function AnnexesFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editAnnexId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editAnnexId) && editAnnexId > 0
  const [form, setForm] = useState({ ...initialCreateAnnexForm })
  const [annexFiles, setAnnexFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingAnnexDetail = useStoreAnnexes((s) => s.loadingAnnexDetail)
  const detailError = useStoreAnnexes((s) => s.operationStatus.detail.error)
  const createAnnexSubmitting = useStoreAnnexes((s) => s.createAnnexSubmitting)
  const updateAnnexSubmitting = useStoreAnnexes((s) => s.updateAnnexSubmitting)
  const createStatus = useStoreAnnexes((s) => s.operationStatus.create)
  const updateStatus = useStoreAnnexes((s) => s.operationStatus.update)
  const getAnnexDetail = useStoreAnnexes((s) => s.getAnnexDetail)
  const clearAnnexDetail = useStoreAnnexes((s) => s.clearAnnexDetail)
  const clearOperationStatus = useStoreAnnexes((s) => s.clearOperationStatus)
  const createAnnex = useStoreAnnexes((s) => s.createAnnex)
  const updateAnnex = useStoreAnnexes((s) => s.updateAnnex)

  const employeeWithContractOptions = useStoreAnnexSelects((s) => s.employeeWithContractOptions)
  const annexTypeOptions = useStoreAnnexSelects((s) => s.annexTypeOptions)
  const loadingAnnexFormOptions = useStoreAnnexSelects((s) => s.loadingAnnexFormOptions)
  const annexFormOptionsErrorMessage = useStoreAnnexSelects((s) => s.annexFormOptionsErrorMessage)
  const getAnnexFormOptions = useStoreAnnexSelects((s) => s.getAnnexFormOptions)
  const clearAnnexFormOptionsStatus = useStoreAnnexSelects((s) => s.clearAnnexFormOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, annexesCreateValidationRules)

  const saving = createAnnexSubmitting || updateAnnexSubmitting
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear anexo'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando anexo...'
  const headerTitle = isEditMode ? 'Editar anexo' : 'Crear anexo'
  const headerDescription = isEditMode ? 'Actualiza los datos del anexo seleccionado.' : 'Completa los datos para registrar un nuevo anexo.'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving
  const employeeWithContractSelectOptions = employeeWithContractOptions.map((opt) => ({ label: opt.name, value: String(opt.id) }))
  const annexTypeSelectOptions = annexTypeOptions.map((opt) => ({ label: opt.name, value: String(opt.id) }))

  useEffect(() => {
    void getAnnexFormOptions()
  }, [getAnnexFormOptions])

  useEffect(() => {
    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearAnnexDetail()
      clearAnnexFormOptionsStatus()
    }
  }, [clearOperationStatus, clearAnnexDetail, clearAnnexFormOptionsStatus])

  useEffect(() => {
    if (!isEditMode) return
    let cancelled = false
    const load = async () => {
      const detail = await getAnnexDetail(String(editAnnexId))
      if (!detail || cancelled) return
      setForm(mapperAnnexDetailToForm(detail))
      setAnnexFiles([])
    }
    void load()
    return () => { cancelled = true }
  }, [editAnnexId, getAnnexDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateAnnexForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (annexFiles.length > ANNEX_FILES_MAX_COUNT) {
      setFilesError(messages.annexes.status.errors.filesMaxCountError)
      return
    }
    if (isEditMode) {
      setPendingAction({ mode: 'update', payload: mapperUpdateAnnexPayload(editAnnexId, form), files: [...annexFiles] })
    } else {
      setPendingAction({ mode: 'create', payload: mapperCreateAnnexPayload(form), files: [...annexFiles] })
    }
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleConfirmSave = async () => {
    if (!pendingAction || saving) return
    const success = pendingAction.mode === 'create'
      ? await createAnnex(pendingAction.payload, pendingAction.files)
      : await updateAnnex(pendingAction.payload, pendingAction.files)
    if (success) {
      navigate(AUTH_ROUTE_ANNEXES)
      return
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleAddFiles = (incomingFiles: File[]) => {
    const nextFiles: File[] = []
    const existingKeys = new Set<string>()
    let hasFileSizeError = false

    annexFiles.forEach((file) => {
      const key = fileKey(file)
      if (!existingKeys.has(key)) { existingKeys.add(key); nextFiles.push(file) }
    })

    incomingFiles.forEach((file) => {
      if (file.size > ANNEX_FILE_MAX_SIZE_BYTES) { hasFileSizeError = true; return }
      const key = fileKey(file)
      if (existingKeys.has(key)) return
      existingKeys.add(key)
      nextFiles.push(file)
    })

    if (nextFiles.length > ANNEX_FILES_MAX_COUNT) {
      setAnnexFiles(nextFiles.slice(0, ANNEX_FILES_MAX_COUNT))
      setFilesError(messages.annexes.status.errors.filesMaxCountError)
    } else if (hasFileSizeError) {
      setAnnexFiles(nextFiles)
      setFilesError(messages.annexes.status.errors.filesMaxSizeError)
    } else {
      setAnnexFiles(nextFiles)
      setFilesError(null)
    }
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveFile = (index: number) => {
    setAnnexFiles((prev) => prev.filter((_, i) => i !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearFiles = () => {
    setAnnexFiles([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? '¿Deseas guardar los cambios del anexo?'
    : '¿Deseas crear el anexo?'
  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editAnnexId}` : 'ANX-NEW'
  const heroWords = headerTitle.trim().split(/\s+/).filter(Boolean)
  const heroLeading = heroWords.slice(0, 2).join(' ')
  const heroTrailing = heroWords.slice(2).join(' ')

  return (
    <section className="space-y-6">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">{heroEyebrow}</span>
          <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" />
          <span className="num">{heroIdSuffix}</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          {heroLeading}
          {heroTrailing && (
            <span className="display-it text-slate-500 dark:text-slate-400"> {heroTrailing}</span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {headerDescription}
        </p>
      </header>

      {annexFormOptionsErrorMessage && (
        <AlertMessageComponent message={annexFormOptionsErrorMessage} tone="error" onClose={clearAnnexFormOptionsStatus} />
      )}
      {isEditMode && detailError && (
        <AlertMessageComponent message={detailError} tone="error" onClose={() => clearOperationStatus('detail')} />
      )}
      {submitErrorMessage && (
        <AlertMessageComponent message={submitErrorMessage} tone="error" onClose={clearSubmitStatus} />
      )}
      {submitSuccessMessage && (
        <AlertMessageComponent message={submitSuccessMessage} tone="success" onClose={clearSubmitStatus} />
      )}

      <form className="space-y-10" onSubmit={handleSubmit}>
        {isEditMode && loadingAnnexDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del anexo…</p>
        )}

        <section className="space-y-6">
          <DetailSectionHeaderComponent number="01" title="Datos del anexo" />

          <div className="space-y-3">
            <SubSectionLabel number="01.1" title="Relación contractual" />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectComponent
                value={form.employeeId}
                label="ID trabajador"
                options={employeeWithContractSelectOptions}
                loading={loadingAnnexFormOptions}
                error={errors.employeeId}
                disabled={isEditMode}
                onValueChange={handleChangeField('employeeId')}
                onValidation={onValidation('employeeId')}
                required
              />
              <SelectComponent
                value={form.annexTypeId}
                label="Tipo de anexo"
                options={annexTypeSelectOptions}
                loading={loadingAnnexFormOptions}
                error={errors.annexTypeId}
                onValueChange={handleChangeField('annexTypeId')}
                onValidation={onValidation('annexTypeId')}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubSectionLabel number="01.2" title="Vigencia y descripción" />
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <DatePickerComponent
                value={form.date}
                label="Fecha"
                
                error={errors.date}
                onValueChange={handleChangeField('date')}
                onValidation={onValidation('date')}
                required
              />
              <InputComponent
                value={form.description}
                label="Descripción"
                type="text"
                placeholder="Descripción opcional"
                onValueChange={handleChangeField('description')}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <DetailSectionHeaderComponent number="02" title="Adjuntos" />
          <div className="space-y-3">
            <SubSectionLabel number="02.1" title="Documentos del anexo" />
            <FileDropzoneComponent
              files={annexFiles}
              error={filesError}
              maxFiles={ANNEX_FILES_MAX_COUNT}
              disabled={saving}
              helperText="Opcional. Máximo 5 archivos y 10 MB por archivo."
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClearFiles={handleClearFiles}
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
          <p className="num text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            FIN DEL REGISTRO · {new Date().toLocaleDateString('es-CL')}
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={saving}
              label="Volver"
              onClick={() => navigate(AUTH_ROUTE_ANNEXES)}
            />
            <ButtonComponent
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              label={saving ? submitLoadingLabel : submitLabel}
            />
          </div>
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de anexo' : 'Confirmar creacion de anexo'}
        message={confirmMessage}
        confirmLabel={submitLabel}
        cancelLabel="Cancelar"
        loading={saving}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmSave() }}
      />
    </section>
  )
}
