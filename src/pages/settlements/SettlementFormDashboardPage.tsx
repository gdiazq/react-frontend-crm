import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  FileDropzoneComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS } from '@/constant'
import { initialCreateSettlementForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperSettlementDetailToForm,
  mapperCreateSettlementPayload,
  mapperUpdateSettlementPayload,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreSettlement, useStoreSettlementSelects } from '@/store'
import type {
  ContractSelectOption,
  SettlementCreatePayload,
  SettlementDocument,
  SettlementQuizAnswerPayload,
  SettlementUpdatePayload,
} from '@/types'
import { settlementsCreateValidationRules } from '@/validators'

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</h2>
}

const toSelectOptions = (options: ContractSelectOption[]) =>
  options.map((option) => ({ label: option.name, value: String(option.id) }))

const REHIRE_OPTIONS = [
  { label: 'Si', value: 'true' },
  { label: 'No', value: 'false' },
]

const SETTLEMENT_FILES_MAX_COUNT = 5
const SETTLEMENT_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

type PendingAction =
  | { mode: 'create', payload: SettlementCreatePayload, files: File[] }
  | { mode: 'update', payload: SettlementUpdatePayload, files: File[] }
  | null

export default function SettlementFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editSettlementId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editSettlementId) && editSettlementId > 0

  const [form, setForm] = useState({ ...initialCreateSettlementForm })
  const [editEmployeeLabel, setEditEmployeeLabel] = useState('')
  const [existingDocuments, setExistingDocuments] = useState<SettlementDocument[]>([])
  const [settlementFiles, setSettlementFiles] = useState<File[]>([])
  const [filesError, setFilesError] = useState<string | null>(null)
  const [quizAnswersByQuestionId, setQuizAnswersByQuestionId] = useState<Record<number, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const loadingSettlementDetail = useStoreSettlement((s) => s.loadingSettlementDetail)
  const detailError = useStoreSettlement((s) => s.operationStatus.detail.error)
  const createSettlementSubmitting = useStoreSettlement((s) => s.createSettlementSubmitting)
  const updateSettlementSubmitting = useStoreSettlement((s) => s.updateSettlementSubmitting)
  const createStatus = useStoreSettlement((s) => s.operationStatus.create)
  const updateStatus = useStoreSettlement((s) => s.operationStatus.update)
  const getSettlementDetail = useStoreSettlement((s) => s.getSettlementDetail)
  const clearSettlementDetail = useStoreSettlement((s) => s.clearSettlementDetail)
  const clearOperationStatus = useStoreSettlement((s) => s.clearOperationStatus)
  const createSettlement = useStoreSettlement((s) => s.createSettlement)
  const updateSettlement = useStoreSettlement((s) => s.updateSettlement)

  const legalTerminationCauseOptions = useStoreSettlementSelects((s) => s.legalTerminationCauseOptions)
  const qualityOfWorkOptions = useStoreSettlementSelects((s) => s.qualityOfWorkOptions)
  const safetyComplianceOptions = useStoreSettlementSelects((s) => s.safetyComplianceOptions)
  const noRehireCauseOptions = useStoreSettlementSelects((s) => s.noRehireCauseOptions)
  const employeeWithContractOptions = useStoreSettlementSelects((s) => s.employeeWithContractOptions)
  const terminationQuizQuestionGroups = useStoreSettlementSelects((s) => s.terminationQuizQuestionGroups)
  const loadingTerminationQuizQuestionGroups = useStoreSettlementSelects((s) => s.loadingTerminationQuizQuestionGroups)
  const terminationQuizQuestionGroupsErrorMessage = useStoreSettlementSelects((s) => s.terminationQuizQuestionGroupsErrorMessage)
  const loadingFormOptions = useStoreSettlementSelects((s) => s.loadingFormOptions)
  const formOptionsErrorMessage = useStoreSettlementSelects((s) => s.formOptionsErrorMessage)
  const getFormOptions = useStoreSettlementSelects((s) => s.getFormOptions)
  const getTerminationQuizQuestionGroups = useStoreSettlementSelects((s) => s.getTerminationQuizQuestionGroups)
  const clearTerminationQuizQuestionGroups = useStoreSettlementSelects((s) => s.clearTerminationQuizQuestionGroups)
  const clearTerminationQuizQuestionGroupsStatus = useStoreSettlementSelects((s) => s.clearTerminationQuizQuestionGroupsStatus)
  const clearFormOptionsStatus = useStoreSettlementSelects((s) => s.clearFormOptionsStatus)

  const { errors, validateAll, onValidation } = useFormValidation(form, settlementsCreateValidationRules)

  const saving = createSettlementSubmitting || updateSettlementSubmitting
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Crear finiquito'
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : 'Creando finiquito...'
  const headerTitle = isEditMode ? 'Editar finiquito' : 'Crear finiquito'
  const headerDescription = isEditMode
    ? 'Actualiza los datos del acuerdo de termino seleccionado.'
    : 'Completa los datos para registrar un nuevo acuerdo de termino.'
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const canSubmit = !saving && !loadingFormOptions

  const selectEmployees = toSelectOptions(employeeWithContractOptions)
  const shouldIncludeCurrentEmployee = isEditMode
    && form.employeeId.trim().length > 0
    && !selectEmployees.some((option) => option.value === form.employeeId)
  const selectEmployeesWithCurrent = shouldIncludeCurrentEmployee
    ? [{ label: editEmployeeLabel || `Trabajador #${form.employeeId}`, value: form.employeeId }, ...selectEmployees]
    : selectEmployees

  const selectLegalTerminationCauses = toSelectOptions(legalTerminationCauseOptions)
  const selectQualityOfWork = toSelectOptions(qualityOfWorkOptions)
  const selectSafetyCompliance = toSelectOptions(safetyComplianceOptions)
  const selectNoRehireCauses = toSelectOptions(noRehireCauseOptions)

  useEffect(() => {
    void getFormOptions()

    return () => {
      clearFormOptionsStatus()
      clearTerminationQuizQuestionGroups()
      clearTerminationQuizQuestionGroupsStatus()
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearSettlementDetail()
    }
  }, [
    clearOperationStatus,
    clearSettlementDetail,
    clearFormOptionsStatus,
    clearTerminationQuizQuestionGroups,
    clearTerminationQuizQuestionGroupsStatus,
    getFormOptions,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getSettlementDetail(String(editSettlementId))
      if (!detail || cancelled) return

      const mapped = mapperSettlementDetailToForm(detail)
      setForm(mapped)
      setEditEmployeeLabel((detail.employeeFullName ?? '').trim())
      setExistingDocuments(detail.documents ?? [])
      setSettlementFiles([])
      setQuizAnswersByQuestionId({})

    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editSettlementId, getSettlementDetail, isEditMode])

  useEffect(() => {
    const employeeId = Number(form.employeeId)
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      clearTerminationQuizQuestionGroups()
      return
    }
    void getTerminationQuizQuestionGroups(employeeId)
  }, [
    clearTerminationQuizQuestionGroups,
    form.employeeId,
    getTerminationQuizQuestionGroups,
  ])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateSettlementForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleFieldValueChange = (field: keyof typeof initialCreateSettlementForm) => (value: string) => {
    handleChangeField(field, value)
  }

  const handleEmployeeChange = (value: string) => {
    setForm((prev) => ({ ...prev, employeeId: value }))
    setQuizAnswersByQuestionId({})
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleQuizAnswerChange = (questionId: number, value: string) => {
    setQuizAnswersByQuestionId((prev) => ({ ...prev, [questionId]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const buildQuizAnswersPayload = (): SettlementQuizAnswerPayload[] => {
    const allQuestionIds = terminationQuizQuestionGroups.flatMap((group) => group.questions.map((question) => question.id))
    return allQuestionIds
      .map((questionId) => ({
        questionId,
        answer: (quizAnswersByQuestionId[questionId] || '').trim(),
      }))
      .filter((item) => item.answer.length > 0)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return
    if (settlementFiles.length > SETTLEMENT_FILES_MAX_COUNT) {
      setFilesError(messages.settlement.status.errors.filesMaxCountError)
      return
    }

    if (isEditMode) {
      setPendingAction({
        mode: 'update',
        payload: mapperUpdateSettlementPayload(editSettlementId, form),
        files: [...settlementFiles],
      })
    } else {
      setPendingAction({
        mode: 'create',
        payload: mapperCreateSettlementPayload(form, buildQuizAnswersPayload()),
        files: [...settlementFiles],
      })
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
      ? await createSettlement(pendingAction.payload, pendingAction.files)
      : await updateSettlement(pendingAction.payload, pendingAction.files)

    if (success) {
      navigate(AUTH_ROUTE_SETTLEMENTS)
      return
    }

    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleAddFiles = (incomingFiles: File[]) => {
    const maxNewFiles = Math.max(0, SETTLEMENT_FILES_MAX_COUNT - existingDocuments.length)
    if (maxNewFiles === 0) {
      setFilesError(messages.settlement.status.errors.filesMaxCountError)
      return
    }

    const nextFiles: File[] = []
    const existingKeys = new Set<string>()
    let hasFileSizeError = false

    settlementFiles.forEach((file) => {
      const key = fileKey(file)
      if (!existingKeys.has(key)) {
        existingKeys.add(key)
        nextFiles.push(file)
      }
    })

    incomingFiles.forEach((file) => {
      if (file.size > SETTLEMENT_FILE_MAX_SIZE_BYTES) {
        hasFileSizeError = true
        return
      }
      const key = fileKey(file)
      if (existingKeys.has(key)) return
      existingKeys.add(key)
      nextFiles.push(file)
    })

    if (nextFiles.length > maxNewFiles) {
      setSettlementFiles(nextFiles.slice(0, maxNewFiles))
      setFilesError(messages.settlement.status.errors.filesMaxCountError)
    } else if (hasFileSizeError) {
      setSettlementFiles(nextFiles)
      setFilesError(messages.settlement.status.errors.filesMaxSizeError)
    } else {
      setSettlementFiles(nextFiles)
      setFilesError(null)
    }

    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveFile = (index: number) => {
    setSettlementFiles((prev) => prev.filter((_, i) => i !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearFiles = () => {
    setSettlementFiles([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleRemoveExistingFile = (index: number) => {
    setExistingDocuments((prev) => prev.filter((_, i) => i !== index))
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleClearExistingFiles = () => {
    setExistingDocuments([])
    setFilesError(null)
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const confirmMessage = pendingAction?.mode === 'update'
    ? '¿Deseas guardar los cambios del acuerdo de termino?'
    : '¿Deseas crear el acuerdo de termino?'

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {headerDescription}
        </p>
      </header>

      {formOptionsErrorMessage && (
        <AlertMessageComponent
          message={formOptionsErrorMessage}
          tone="error"
          onClose={clearFormOptionsStatus}
        />
      )}

      {isEditMode && detailError && (
        <AlertMessageComponent
          message={detailError}
          tone="error"
          onClose={() => clearOperationStatus('detail')}
        />
      )}

      {submitErrorMessage && (
        <AlertMessageComponent
          message={submitErrorMessage}
          tone="error"
          onClose={clearSubmitStatus}
        />
      )}

      {submitSuccessMessage && (
        <AlertMessageComponent
          message={submitSuccessMessage}
          tone="success"
          onClose={clearSubmitStatus}
        />
      )}

      <form
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        {isEditMode && loadingSettlementDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Cargando datos del finiquito...</p>
        )}

        <SectionTitle title="Datos del trabajador" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.employeeId}
            label="Trabajador"
            options={selectEmployeesWithCurrent}
            error={errors.employeeId}
            disabled={isEditMode}
            onValueChange={handleEmployeeChange}
            onValidation={onValidation('employeeId')}
            required
          />

          <InputComponent
            value={form.endDate}
            label="Fecha finiquito"
            type="date"
            error={errors.endDate}
            onValueChange={handleFieldValueChange('endDate')}
            onBlur={onValidation('endDate')}
            required
          />

          <SelectComponent
            value={form.rehireEligible}
            label="Recontratable"
            options={REHIRE_OPTIONS}
            error={errors.rehireEligible}
            onValueChange={(value) => {
              if (value === 'true') {
                setForm((prev) => ({ ...prev, rehireEligible: value, noReHiredCauseId: '' }))
              } else {
                handleFieldValueChange('rehireEligible')(value)
              }
            }}
            onValidation={onValidation('rehireEligible')}
            required
          />
        </div>

        <SectionTitle title="Causas del finiquito" />
        <div className="grid gap-4 md:grid-cols-3">

          <SelectComponent
            value={form.legalTerminationCauseId}
            label="Causa terminacion"
            options={selectLegalTerminationCauses}
            error={errors.legalTerminationCauseId}
            onValueChange={handleFieldValueChange('legalTerminationCauseId')}
            onValidation={onValidation('legalTerminationCauseId')}
            required
          />

          <SelectComponent
            value={form.qualityOfWorkId}
            label="Calidad del trabajo"
            options={selectQualityOfWork}
            error={errors.qualityOfWorkId}
            onValueChange={handleFieldValueChange('qualityOfWorkId')}
            onValidation={onValidation('qualityOfWorkId')}
            required
          />

          <SelectComponent
            value={form.safetyComplianceId}
            label="Cumplimiento seguridad"
            options={selectSafetyCompliance}
            error={errors.safetyComplianceId}
            onValueChange={handleFieldValueChange('safetyComplianceId')}
            onValidation={onValidation('safetyComplianceId')}
            required
          />

          {form.rehireEligible === 'false' && (
            <SelectComponent
              value={form.noReHiredCauseId}
              label="Causa no recontrato"
              options={selectNoRehireCauses}
              onValueChange={handleFieldValueChange('noReHiredCauseId')}
            />
          )}
        </div>

        {!isEditMode && (
          <>
            <SectionTitle title="Quiz de salida" />
            {terminationQuizQuestionGroupsErrorMessage && (
              <AlertMessageComponent
                message={terminationQuizQuestionGroupsErrorMessage}
                tone="error"
                onClose={clearTerminationQuizQuestionGroupsStatus}
              />
            )}

            {loadingTerminationQuizQuestionGroups && (
              <p className="text-sm text-slate-600 dark:text-slate-300">Cargando preguntas del quiz de salida...</p>
            )}

            {!loadingTerminationQuizQuestionGroups && terminationQuizQuestionGroups.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-300">No hay preguntas configuradas para este trabajador.</p>
            )}

            {!loadingTerminationQuizQuestionGroups && terminationQuizQuestionGroups.length > 0 && (
              <div className="space-y-3">
                {terminationQuizQuestionGroups.map((group) => (
                  <article key={group.groupId} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      {group.groupName}
                    </h3>
                    <div className="mt-3 grid gap-3">
                      {group.questions.map((question) => (
                        <div key={question.id} className="flex flex-col gap-1">
                          <label
                            htmlFor={`settlement-quiz-answer-${question.id}`}
                            className="text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            {question.name}
                          </label>
                          <textarea
                            id={`settlement-quiz-answer-${question.id}`}
                            value={quizAnswersByQuestionId[question.id] || ''}
                            placeholder="Ingresa tu respuesta"
                            rows={3}
                            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                            onChange={(event) => handleQuizAnswerChange(question.id, event.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        <SectionTitle title="Datos adicionales" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Observaciones
          </label>
          <textarea
            value={form.observations}
            placeholder="Ingresa observaciones (opcional)"
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            onChange={(e) => handleFieldValueChange('observations')(e.target.value)}
          />
        </div>

        <SectionTitle title="Documentos" />

        <FileDropzoneComponent
          files={settlementFiles}
          existingFiles={existingDocuments}
          error={filesError}
          maxFiles={SETTLEMENT_FILES_MAX_COUNT}
          disabled={saving}
          helperText="Opcional. Maximo 5 archivos y 10 MB por archivo."
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onRemoveExistingFile={handleRemoveExistingFile}
          onClearFiles={handleClearFiles}
          onClearExistingFiles={handleClearExistingFiles}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            label="Volver"
            disabled={saving}
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS)}
          />
          <ButtonComponent
            type="submit"
            variant="primary"
            label={saving ? submitLoadingLabel : submitLabel}
            disabled={!canSubmit}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title={isEditMode ? 'Confirmar actualizacion de finiquito' : 'Confirmar creacion de finiquito'}
        message={confirmMessage}
        confirmLabel={submitLabel}
        cancelLabel="Cancelar"
        loading={saving}
        onConfirm={() => { void handleConfirmSave() }}
        onClose={handleCloseConfirm}
      />
    </section>
  )
}
