import { useState } from 'react'
import AvatarInitialsComponent from '@/components/ui/avatar/AvatarInitialsComponent'
import ButtonComponent from '@/components/ui/button/ButtonComponent'
import DetailFieldCardComponent from '@/components/ui/detail/DetailFieldCardComponent'
import DetailTabContentComponent from '@/components/ui/detail/DetailTabContentComponent'
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
  const tabSelectOptions = [
    { value: 'personal', label: 'Datos personales' },
    { value: 'contact', label: 'Contacto' },
    { value: 'emergency', label: 'Emergencia' },
    { value: 'address', label: 'Direccion' },
    { value: 'health', label: 'Salud y prevision' },
    { value: 'payment', label: 'Pago y tallas' },
    { value: 'linkedUser', label: 'Usuario vinculado' },
    { value: 'dates', label: 'Fechas' },
  ]

  const renderTabContent = () => {
    if (activeTab === 'personal') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Tipo identificacion" value={detail.identificationType} />
          <DetailFieldCardComponent title="Fecha nacimiento" value={detail.birthDate} />
          <DetailFieldCardComponent title="Genero" value={detail.gender} />
          <DetailFieldCardComponent title="Estado civil" value={detail.maritalStatus} />
          <DetailFieldCardComponent title="Educacion" value={detail.educationLevel} />
          <DetailFieldCardComponent title="Licencia" value={detail.driverLicense} />
          <DetailFieldCardComponent title="Profesion" value={detail.profession} />
          <DetailFieldCardComponent title="Nacionalidad" value={detail.nationality} />
          <DetailFieldCardComponent title="Extranjero" value={detail.expat} />
        </div>
      )
    }

    if (activeTab === 'contact') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Correo personal" value={detail.personalEmail} />
          <DetailFieldCardComponent title="Correo corporativo" value={detail.corporateEmail} valueClassName="break-all" />
          <DetailFieldCardComponent title="Telefono" value={detail.phone} />
          <DetailFieldCardComponent title="Telefono 2" value={detail.phone2} />
        </div>
      )
    }

    if (activeTab === 'emergency') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Parentesco" value={detail.emergencyContactRelationship} />
          <DetailFieldCardComponent title="Nombre contacto" value={detail.emergencyContactName} />
          <DetailFieldCardComponent title="Telefono" value={detail.emergencyContactPhone} />
          <DetailFieldCardComponent title="Telefono 2" value={detail.emergencyContactPhone2} />
        </div>
      )
    }

    if (activeTab === 'address') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Calle" value={detail.streetName} />
          <DetailFieldCardComponent title="Numero" value={detail.streetNumber} />
          <DetailFieldCardComponent title="Cod. postal" value={detail.postalCode} />
          <DetailFieldCardComponent title="Departamento" value={detail.department} />
          <DetailFieldCardComponent title="Villa" value={detail.village} />
          <DetailFieldCardComponent title="Manzana" value={detail.block} />
          <DetailFieldCardComponent title="Region" value={detail.region} />
          <DetailFieldCardComponent title="Comuna" value={detail.commune} />
          <DetailFieldCardComponent title="Ciudad" value={detail.city} />
        </div>
      )
    }

    if (activeTab === 'health') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Asig. familiar" value={detail.familyAllowanceTier} />
          <DetailFieldCardComponent title="Jubilacion" value={detail.retirementStatus} />
          <DetailFieldCardComponent title="Estado pension" value={detail.pensionStatus} />
          <DetailFieldCardComponent title="AFP" value={detail.afp} />
          <DetailFieldCardComponent title="ISAPRE/FUN" value={detail.isapreFun} />
          <DetailFieldCardComponent title="Seguro salud" value={detail.healthInsurance} />
          <DetailFieldCardComponent title="Plan salud" value={detail.healthInsuranceTariff} />
          <DetailFieldCardComponent title="Salud UF" value={detail.healthInsuranceUF} />
          <DetailFieldCardComponent title="Salud pesos" value={detail.healthInsurancePesos} />
        </div>
      )
    }

    if (activeTab === 'payment') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Metodo de pago" value={detail.paymentMethod} />
          <DetailFieldCardComponent title="Banco" value={detail.bank} />
          <DetailFieldCardComponent title="Cuenta" value={detail.bankAccount} />
          <DetailFieldCardComponent title="Talla ropa" value={detail.clothingSize} />
          <DetailFieldCardComponent title="Talla zapato" value={detail.shoeSize} />
          <DetailFieldCardComponent title="Talla pantalon" value={detail.pantSize} />
        </div>
      )
    }

    if (activeTab === 'linkedUser') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Usuario" value={detail.username} />
          <DetailFieldCardComponent title="Email" value={detail.userEmail} valueClassName="break-all" />
          <DetailFieldCardComponent title="Habilitado" value={<StatusBadgeComponent enabled={userEnabled} />} className="md:col-span-2" />
        </div>
      )
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        <DetailFieldCardComponent title="Creado" value={detail.createdAtDisplay} />
        <DetailFieldCardComponent title="Actualizado" value={detail.updatedAtDisplay} />
      </div>
    )
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
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.identification}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EmployeeApprovalStatusBadgeComponent statusName={detail.statusName} />
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
          onValueChange={(value) => setActiveTab(value as EmployeeDetailTabKey)}
        />
      </article>

      <DetailTabContentComponent renderTabContent={renderTabContent} />
    </section>
  )
}
