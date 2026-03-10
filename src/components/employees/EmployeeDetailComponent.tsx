import { useState } from 'react'
import AvatarInitialsComponent from '@/components/ui/avatar/AvatarInitialsComponent'
import ButtonComponent from '@/components/ui/button/ButtonComponent'
import DetailSectionDropdownComponent from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import EmployeeApprovalStatusBadgeComponent from '@/components/ui/status/EmployeeApprovalStatusBadgeComponent'
import StatusBadgeComponent from '@/components/ui/status/StatusBadgeComponent'
import type { EmployeeDetailView } from '@/types'

interface EmployeeDetailComponentProps {
  detail: EmployeeDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

type EmployeeDetailTabKey =
  | 'personal'
  | 'contact'
  | 'emergency'
  | 'address'
  | 'health'
  | 'payment'
  | 'linkedUser'
  | 'dates'

export default function EmployeeDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: EmployeeDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<EmployeeDetailTabKey>('personal')

  const resolveText = (value: string) => {
    const normalized = value.trim()
    return normalized.length > 0 ? normalized : 'Sin registro'
  }

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Cargando detalle del trabajador...</p>
  }

  if (errorMessage) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600 dark:text-rose-300">{errorMessage}</p>
        {onRetry && (
          <ButtonComponent
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={onRetry}
          />
        )}
      </div>
    )
  }

  if (!detail) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Selecciona un trabajador para ver su detalle.</p>
  }

  const userEnabled = detail.userEnabled === 'Si'
  const tabs: { key: EmployeeDetailTabKey, label: string }[] = [
    { key: 'personal', label: 'Datos personales' },
    { key: 'contact', label: 'Contacto' },
    { key: 'emergency', label: 'Emergencia' },
    { key: 'address', label: 'Direccion' },
    { key: 'health', label: 'Salud y prevision' },
    { key: 'payment', label: 'Pago y tallas' },
    { key: 'linkedUser', label: 'Usuario vinculado' },
    { key: 'dates', label: 'Fechas' },
  ]
  const tabSelectOptions = tabs.map((tab) => ({ value: tab.key, label: tab.label }))
  const personalFields = [
    { label: 'Tipo identificacion', value: detail.identificationType },
    { label: 'Fecha nacimiento', value: detail.birthDate },
    { label: 'Genero', value: detail.gender },
    { label: 'Estado civil', value: detail.maritalStatus },
    { label: 'Educacion', value: detail.educationLevel },
    { label: 'Licencia', value: detail.driverLicense },
    { label: 'Profesion', value: detail.profession },
    { label: 'Nacionalidad', value: detail.nationality },
    { label: 'Extranjero', value: detail.expat },
  ]
  const contactFields = [
    { label: 'Correo personal', value: detail.personalEmail },
    { label: 'Correo corporativo', value: detail.corporateEmail },
    { label: 'Telefono', value: detail.phone },
    { label: 'Telefono 2', value: detail.phone2 },
  ]
  const emergencyFields = [
    { label: 'Parentesco', value: detail.emergencyContactRelationship },
    { label: 'Nombre contacto', value: detail.emergencyContactName },
    { label: 'Telefono', value: detail.emergencyContactPhone },
    { label: 'Telefono 2', value: detail.emergencyContactPhone2 },
  ]
  const addressFields = [
    { label: 'Calle', value: detail.streetName },
    { label: 'Numero', value: detail.streetNumber },
    { label: 'Cod. postal', value: detail.postalCode },
    { label: 'Departamento', value: detail.department },
    { label: 'Villa', value: detail.village },
    { label: 'Manzana', value: detail.block },
    { label: 'Region', value: detail.region },
    { label: 'Comuna', value: detail.commune },
    { label: 'Ciudad', value: detail.city },
  ]
  const healthFields = [
    { label: 'Asig. familiar', value: detail.familyAllowanceTier },
    { label: 'Jubilacion', value: detail.retirementStatus },
    { label: 'Estado pension', value: detail.pensionStatus },
    { label: 'AFP', value: detail.afp },
    { label: 'ISAPRE/FUN', value: detail.isapreFun },
    { label: 'Seguro salud', value: detail.healthInsurance },
    { label: 'Plan salud', value: detail.healthInsuranceTariff },
    { label: 'Salud UF', value: detail.healthInsuranceUF },
    { label: 'Salud pesos', value: detail.healthInsurancePesos },
  ]
  const paymentFields = [
    { label: 'Metodo de pago', value: detail.paymentMethod },
    { label: 'Banco', value: detail.bank },
    { label: 'Cuenta', value: detail.bankAccount },
    { label: 'Talla ropa', value: detail.clothingSize },
    { label: 'Talla zapato', value: detail.shoeSize },
    { label: 'Talla pantalon', value: detail.pantSize },
  ]

  const renderFieldsGrid = (fields: { label: string, value: string }[]) => (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <article key={field.label} className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{field.label}</p>
          <p className="mt-1 text-sm font-medium">{resolveText(field.value)}</p>
        </article>
      ))}
    </div>
  )

  const tabContentByKey: Record<EmployeeDetailTabKey, { title: string, content: React.ReactNode }> = {
    personal: {
      title: 'Datos personales',
      content: renderFieldsGrid(personalFields),
    },
    contact: {
      title: 'Contacto',
      content: renderFieldsGrid(contactFields),
    },
    emergency: {
      title: 'Contacto de emergencia',
      content: renderFieldsGrid(emergencyFields),
    },
    address: {
      title: 'Direccion',
      content: renderFieldsGrid(addressFields),
    },
    health: {
      title: 'Salud y prevision',
      content: renderFieldsGrid(healthFields),
    },
    payment: {
      title: 'Pago y tallas',
      content: renderFieldsGrid(paymentFields),
    },
    linkedUser: {
      title: 'Usuario vinculado',
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Usuario</p>
            <p className="mt-1 text-sm font-medium">{resolveText(detail.username)}</p>
          </article>
          <article className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-1 text-sm font-medium break-all">{resolveText(detail.userEmail)}</p>
          </article>
          <article className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Habilitado</p>
            <div className="mt-1">
              <StatusBadgeComponent enabled={userEnabled} />
            </div>
          </article>
        </div>
      ),
    },
    dates: {
      title: 'Fechas',
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Creado</p>
            <p className="mt-1 text-sm font-medium">{resolveText(detail.createdAtDisplay)}</p>
          </article>
          <article className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actualizado</p>
            <p className="mt-1 text-sm font-medium">{resolveText(detail.updatedAtDisplay)}</p>
          </article>
        </div>
      ),
    },
  }

  const activeTabContent = tabContentByKey[activeTab]
  const handleTabChange = (value: string) => {
    setActiveTab(value as EmployeeDetailTabKey)
  }

  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="flex items-start gap-4">
          <AvatarInitialsComponent
            fullName={detail.fullName}
            fallbackInitials="TR"
            className="bg-cyan-100 font-bold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-semibold">{detail.fullName}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{resolveText(detail.identification)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EmployeeApprovalStatusBadgeComponent statusName={resolveText(detail.statusName)} />
              <StatusBadgeComponent
                enabled={detail.hasContract}
                activeLabel="Contrato: Si"
                inactiveLabel="Contrato: No"
              />
              <StatusBadgeComponent enabled={detail.active} />
              <StatusBadgeComponent
                enabled={detail.rehireEligible}
                activeLabel="Recontratable: Si"
                inactiveLabel="Recontratable: No"
              />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Seccion"
          options={tabSelectOptions}
          onValueChange={handleTabChange}
        />
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {activeTabContent.title}
        </h3>
        {activeTabContent.content}
      </article>
    </section>
  )
}
