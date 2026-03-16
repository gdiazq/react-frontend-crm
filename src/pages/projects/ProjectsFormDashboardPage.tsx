import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  SaveConfirmComponent,
  SelectComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECTS } from '@/constant'
import { initialCreateProjectForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperCreateProjectPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjects, useStoreSelects } from '@/store'
import type { ProjectCreatePayload } from '@/types'
import { projectsCreateValidationRules } from '@/validators'

type PendingAction = { payload: ProjectCreatePayload } | null

const toSelectOptions = (options: { id: number, name: string }[]) =>
  options.map((option) => ({ label: option.name, value: String(option.id) }))

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</h2>
}

export default function ProjectsFormDashboardPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...initialCreateProjectForm })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const createProjectSubmitting = useStoreProjects((s) => s.createProjectSubmitting)
  const createStatus = useStoreProjects((s) => s.operationStatus.create)
  const createProject = useStoreProjects((s) => s.createProject)
  const clearOperationStatus = useStoreProjects((s) => s.clearOperationStatus)

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

  const { companyRepresentativeIds: _ignore, ...validatableForm } = form
  const { errors, validateAll, onValidation } = useFormValidation(validatableForm, projectsCreateValidationRules)

  const saving = createProjectSubmitting
  const submitErrorMessage = createStatus.error
  const submitSuccessMessage = createStatus.success
  const loadingOptions = loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions
    || loadingVisitorOptions || loadingSupervisorOptions || loadingCompanyRepresentativeOptions
  const canSubmit = !saving && !loadingOptions

  const selectTypes = toSelectOptions(projectTypeOptions)
  const selectStatuses = toSelectOptions(projectStatusOptions)
  const selectSpecialties = toSelectOptions(projectSpecialtyOptions)
  const selectVisitors = toSelectOptions(visitorOptions)
  const selectSupervisors = toSelectOptions(supervisorOptions)
  const selectRepresentatives = toSelectOptions(companyRepresentativeOptions)

  useEffect(() => {
    void getProjectTypeOptions()
    void getProjectStatusOptions()
    void getProjectSpecialtyOptions()
    void getVisitorOptions()
    void getSupervisorOptions()
    void getCompanyRepresentativeOptions()

    return () => {
      clearOperationStatus('create')
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
    clearVisitorOptionsStatus,
    clearSupervisorOptionsStatus,
    clearCompanyRepresentativeOptionsStatus,
  ])

  const clearSubmitStatus = () => {
    clearOperationStatus('create')
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

    const payload = mapperCreateProjectPayload(form)
    setPendingAction({ payload })
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (saving) return
    setConfirmOpen(false)
    setPendingAction(null)
  }

  const handleConfirmSave = async () => {
    if (!pendingAction || saving) return
    const success = await createProject(pendingAction.payload)
    if (success) {
      navigate(AUTH_ROUTE_PROJECTS)
    }
    setConfirmOpen(false)
    setPendingAction(null)
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">{messages.projects.ui.createProjectTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{messages.projects.ui.createProjectDescription}</p>
      </header>

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

      <form
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
        onSubmit={handleSubmit}
      >
        <SectionTitle title="Datos basicos" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.costCenter}
            label="Centro de costo"
            type="number"
            placeholder="Ingresa el centro de costo"
            error={errors.costCenter}
            onValueChange={handleFieldValueChange('costCenter')}
            onBlur={onValidation('costCenter')}
            required
          />
          <InputComponent
            value={form.name}
            label="Nombre"
            type="text"
            placeholder="Ingresa el nombre del proyecto"
            error={errors.name}
            onValueChange={handleFieldValueChange('name')}
            onBlur={onValidation('name')}
            required
          />
          <InputComponent
            value={form.address}
            label="Direccion"
            type="text"
            placeholder="Ingresa la direccion"
            onValueChange={handleFieldValueChange('address')}
          />
          <InputComponent
            value={form.description}
            label="Descripcion"
            type="text"
            placeholder="Ingresa una descripcion"
            onValueChange={handleFieldValueChange('description')}
          />
        </div>

        <SectionTitle title="Clasificacion" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.typeId}
            label="Tipo de proyecto"
            options={selectTypes}
            loading={loadingProjectTypeOptions}
            onValueChange={handleFieldValueChange('typeId')}
          />
          <SelectComponent
            value={form.statusId}
            label="Vigencia"
            options={selectStatuses}
            loading={loadingProjectStatusOptions}
            onValueChange={handleFieldValueChange('statusId')}
          />
          <SelectComponent
            value={form.specialtyId}
            label="Especialidad"
            options={selectSpecialties}
            loading={loadingProjectSpecialtyOptions}
            onValueChange={handleFieldValueChange('specialtyId')}
          />
        </div>

        <SectionTitle title="Personal asignado" />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectComponent
            value={form.visitorId}
            label="Visitador"
            options={selectVisitors}
            loading={loadingVisitorOptions}
            onValueChange={handleFieldValueChange('visitorId')}
          />
          <SelectComponent
            value={form.supervisorId}
            label="Supervisor"
            options={selectSupervisors}
            loading={loadingSupervisorOptions}
            onValueChange={handleFieldValueChange('supervisorId')}
          />
          <SelectComponent
            values={form.companyRepresentativeIds}
            label="Representantes de empresa"
            options={selectRepresentatives}
            loading={loadingCompanyRepresentativeOptions}
            multiple
            onValuesChange={handleRepresentativesChange}
          />
        </div>

        <SectionTitle title="Fechas" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputComponent
            value={form.startDate}
            label="Fecha inicio"
            type="date"
            onValueChange={handleFieldValueChange('startDate')}
          />
          <InputComponent
            value={form.realStartDate}
            label="Fecha inicio real"
            type="date"
            onValueChange={handleFieldValueChange('realStartDate')}
          />
          <InputComponent
            value={form.endDate}
            label="Fecha fin"
            type="date"
            onValueChange={handleFieldValueChange('endDate')}
          />
          <InputComponent
            value={form.realEndDate}
            label="Fecha fin real"
            type="date"
            onValueChange={handleFieldValueChange('realEndDate')}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
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
            label={saving ? messages.projects.ui.createProjectSubmitting : messages.projects.ui.createProjectSubmit}
          />
        </div>
      </form>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar creacion de proyecto"
        message={`¿Deseas crear el proyecto ${form.name}?`}
        confirmLabel={messages.projects.ui.createProjectSubmit}
        cancelLabel="Cancelar"
        loading={saving}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmSave() }}
      />
    </section>
  )
}
