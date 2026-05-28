import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  ProjectsFormBaseSectionComponent,
  ProjectsFormClassificationSectionComponent,
  ProjectsFormDatesSectionComponent,
  ProjectsFormStaffSectionComponent,
  SaveConfirmComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECTS } from '@/constant'
import { initialCreateProjectForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperCreateProjectPayload,
  mapperProjectSelectOptions,
  mapperProjectToForm,
  mapperUpdateProjectPayload,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjects, useStoreSelects } from '@/store'
import { projectsCreateValidationRules } from '@/validators'

export default function ProjectsFormDashboardPage() {
  const navigate = useNavigate()
  const params = useParams<{ editId: string }>()
  const rawEditParam = params.editId || ''
  const editProjectId = rawEditParam.startsWith('edit=') ? Number(rawEditParam.slice(5)) : Number.NaN
  const isEditMode = Number.isInteger(editProjectId) && editProjectId > 0

  const [form, setForm] = useState({ ...initialCreateProjectForm })
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Store state used to render loading and submit status.
  const loadingProjectDetail = useStoreProjects((s) => s.operationLoading.detail)
  const detailError = useStoreProjects((s) => s.operationStatus.detail.error)
  const createProjectSubmitting = useStoreProjects((s) => s.operationLoading.create)
  const updateProjectSubmitting = useStoreProjects((s) => s.operationLoading.update)
  const createStatus = useStoreProjects((s) => s.operationStatus.create)
  const updateStatus = useStoreProjects((s) => s.operationStatus.update)

  // Store actions triggered by form lifecycle and submit.
  const getProjectDetail = useStoreProjects((s) => s.getProjectDetail)
  const clearProjectDetail = useStoreProjects((s) => s.clearProjectDetail)
  const createProject = useStoreProjects((s) => s.createProject)
  const updateProject = useStoreProjects((s) => s.updateProject)
  const clearOperationStatus = useStoreProjects((s) => s.clearOperationStatus)

  // Shared select state used by form controls.
  const projectTypeOptions = useStoreSelects((s) => s.projectTypeOptions)
  const projectStatusOptions = useStoreSelects((s) => s.projectStatusOptions)
  const projectSpecialtyOptions = useStoreSelects((s) => s.projectSpecialtyOptions)
  const visitorOptions = useStoreSelects((s) => s.visitorOptions)
  const supervisorOptions = useStoreSelects((s) => s.supervisorOptions)
  const companyRepresentativeOptions = useStoreSelects((s) => s.companyRepresentativeOptions)

  const loadingProjectTypeOptions = useStoreSelects((s) => s.loadingProjectTypeOptions)
  const loadingProjectStatusOptions = useStoreSelects((s) => s.loadingProjectStatusOptions)
  const loadingProjectSpecialtyOptions = useStoreSelects((s) => s.loadingProjectSpecialtyOptions)
  const loadingVisitorOptions = useStoreSelects((s) => s.loadingVisitorOptions)
  const loadingSupervisorOptions = useStoreSelects((s) => s.loadingSupervisorOptions)
  const loadingCompanyRepresentativeOptions = useStoreSelects((s) => s.loadingCompanyRepresentativeOptions)

  const visitorOptionsErrorMessage = useStoreSelects((s) => s.visitorOptionsErrorMessage)
  const supervisorOptionsErrorMessage = useStoreSelects((s) => s.supervisorOptionsErrorMessage)
  const companyRepresentativeOptionsErrorMessage = useStoreSelects((s) => s.companyRepresentativeOptionsErrorMessage)

  const getProjectTypeOptions = useStoreSelects((s) => s.getProjectTypeOptions)
  const getProjectStatusOptions = useStoreSelects((s) => s.getProjectStatusOptions)
  const getProjectSpecialtyOptions = useStoreSelects((s) => s.getProjectSpecialtyOptions)
  const getVisitorOptions = useStoreSelects((s) => s.getVisitorOptions)
  const getSupervisorOptions = useStoreSelects((s) => s.getSupervisorOptions)
  const getCompanyRepresentativeOptions = useStoreSelects((s) => s.getCompanyRepresentativeOptions)

  const clearVisitorOptionsStatus = useStoreSelects((s) => s.clearVisitorOptionsStatus)
  const clearSupervisorOptionsStatus = useStoreSelects((s) => s.clearSupervisorOptionsStatus)
  const clearCompanyRepresentativeOptionsStatus = useStoreSelects((s) => s.clearCompanyRepresentativeOptionsStatus)

  // The form has non-validatable multi-select data, so validation receives only fields with rules.
  const validatableForm = {
    costCenter: form.costCenter,
    name: form.name,
    address: form.address,
    description: form.description,
    typeId: form.typeId,
    statusId: form.statusId,
    specialtyId: form.specialtyId,
    visitorId: form.visitorId,
    supervisorId: form.supervisorId,
    startDate: form.startDate,
    realStartDate: form.realStartDate,
    endDate: form.endDate,
    realEndDate: form.realEndDate,
  }
  const { errors, validateAll, onValidation } = useFormValidation(validatableForm, projectsCreateValidationRules)

  // Derived UI state.
  const saving = createProjectSubmitting || updateProjectSubmitting
  const activeStatus = isEditMode ? updateStatus : createStatus
  const submitErrorMessage = activeStatus.error
  const submitSuccessMessage = activeStatus.success
  const loadingOptions = loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions
    || loadingVisitorOptions || loadingSupervisorOptions || loadingCompanyRepresentativeOptions
  const canSubmit = !saving && !loadingOptions
  const headerTitle = isEditMode ? 'Editar proyecto' : messages.projects.ui.createProjectTitle
  const headerDescription = isEditMode
    ? 'Actualiza los datos del proyecto seleccionado.'
    : messages.projects.ui.createProjectDescription
  const submitLabel = isEditMode ? 'Guardar cambios' : messages.projects.ui.createProjectSubmit
  const submitLoadingLabel = isEditMode ? 'Guardando cambios...' : messages.projects.ui.createProjectSubmitting

  const selectTypes = mapperProjectSelectOptions(projectTypeOptions)
  const selectStatuses = mapperProjectSelectOptions(projectStatusOptions)
  const selectSpecialties = mapperProjectSelectOptions(projectSpecialtyOptions)
  const selectVisitors = mapperProjectSelectOptions(visitorOptions)
  const selectSupervisors = mapperProjectSelectOptions(supervisorOptions)
  const selectRepresentatives = mapperProjectSelectOptions(companyRepresentativeOptions)

  useEffect(() => {
    void getProjectTypeOptions()
    void getProjectStatusOptions()
    void getProjectSpecialtyOptions()
    void getVisitorOptions()
    void getSupervisorOptions()
    void getCompanyRepresentativeOptions()

    return () => {
      clearOperationStatus('create')
      clearOperationStatus('update')
      clearOperationStatus('detail')
      clearProjectDetail()
      clearVisitorOptionsStatus()
      clearSupervisorOptionsStatus()
      clearCompanyRepresentativeOptionsStatus()
    }
  }, [
    getProjectTypeOptions,
    getProjectStatusOptions,
    getProjectSpecialtyOptions,
    getVisitorOptions,
    getSupervisorOptions,
    getCompanyRepresentativeOptions,
    clearOperationStatus,
    clearProjectDetail,
    clearVisitorOptionsStatus,
    clearSupervisorOptionsStatus,
    clearCompanyRepresentativeOptionsStatus,
  ])

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      const detail = await getProjectDetail(String(editProjectId))
      if (!detail || cancelled) return
      setForm(mapperProjectToForm(detail))
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [editProjectId, getProjectDetail, isEditMode])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
    clearOperationStatus('update')
  }

  const handleChangeField = (field: keyof typeof initialCreateProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleFieldValueChange = (field: keyof typeof initialCreateProjectForm) => (value: string) => {
    handleChangeField(field, value)
  }

  const handleRepresentativesChange = (values: string[]) => {
    setForm((prev) => ({ ...prev, companyRepresentativeIds: values }))
    if (submitErrorMessage || submitSuccessMessage) clearSubmitStatus()
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateAll()) return

    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
  }

  const handleConfirmSave = async () => {
    if (saving) return
    if (!validateAll()) return

    const success = isEditMode
      ? await updateProject(mapperUpdateProjectPayload(editProjectId, form))
      : await createProject(mapperCreateProjectPayload(form))

    if (success) {
      navigate(AUTH_ROUTE_PROJECTS)
      return
    }
    setConfirmOpen(false)
  }

  const confirmMessage = isEditMode
    ? `¿Deseas guardar los cambios del proyecto ${form.name}?`
    : `¿Deseas crear el proyecto ${form.name}?`

  const heroEyebrow = isEditMode ? 'EXPEDIENTE · EDICIÓN' : 'EXPEDIENTE · NUEVO'
  const heroIdSuffix = isEditMode ? `#${editProjectId}` : 'PROJ-NEW'
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
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">{headerDescription}</p>
      </header>

      {isEditMode && detailError && (
        <AlertMessageComponent
          message={detailError}
          tone="error"
          onClose={() => clearOperationStatus('detail')}
        />
      )}

      {visitorOptionsErrorMessage && (
        <AlertMessageComponent
          message={visitorOptionsErrorMessage}
          tone="error"
          onClose={clearVisitorOptionsStatus}
        />
      )}

      {supervisorOptionsErrorMessage && (
        <AlertMessageComponent
          message={supervisorOptionsErrorMessage}
          tone="error"
          onClose={clearSupervisorOptionsStatus}
        />
      )}

      {companyRepresentativeOptionsErrorMessage && (
        <AlertMessageComponent
          message={companyRepresentativeOptionsErrorMessage}
          tone="error"
          onClose={clearCompanyRepresentativeOptionsStatus}
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

      <form className="space-y-10" onSubmit={handleSubmit}>
        {isEditMode && loadingProjectDetail && (
          <p className="num text-[12px] text-slate-500 dark:text-slate-400">Cargando datos del proyecto…</p>
        )}

        <ProjectsFormBaseSectionComponent
          form={form}
          errors={errors}
          onChangeField={handleFieldValueChange}
          onValidation={onValidation}
        />

        <ProjectsFormClassificationSectionComponent
          form={form}
          typeOptions={selectTypes}
          statusOptions={selectStatuses}
          specialtyOptions={selectSpecialties}
          loadingTypeOptions={loadingProjectTypeOptions}
          loadingStatusOptions={loadingProjectStatusOptions}
          loadingSpecialtyOptions={loadingProjectSpecialtyOptions}
          onChangeField={handleFieldValueChange}
        />

        <ProjectsFormStaffSectionComponent
          form={form}
          visitorOptions={selectVisitors}
          supervisorOptions={selectSupervisors}
          representativeOptions={selectRepresentatives}
          loadingVisitorOptions={loadingVisitorOptions}
          loadingSupervisorOptions={loadingSupervisorOptions}
          loadingRepresentativeOptions={loadingCompanyRepresentativeOptions}
          onChangeField={handleFieldValueChange}
          onRepresentativesChange={handleRepresentativesChange}
        />

        <ProjectsFormDatesSectionComponent
          form={form}
          onChangeField={handleFieldValueChange}
        />

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
              onClick={() => navigate(AUTH_ROUTE_PROJECTS)}
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
        title={isEditMode ? 'Confirmar actualización de proyecto' : 'Confirmar creación de proyecto'}
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
