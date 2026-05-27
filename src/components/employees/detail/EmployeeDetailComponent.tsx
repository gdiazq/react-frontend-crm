import { AvatarInitialsComponent } from '@/components/ui/avatar/AvatarInitialsComponent'
import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DropdownActionsMenuComponent } from '@/components/ui/dropdown/DropdownActionsMenuComponent'
import { IconDownload } from '@/components/ui/icons/IconDownload'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { EmployeeDetailView } from '@/types'
import type { DropdownAction } from '@/utils'
import { resolveApprovalTone, buildTenureStat } from '@/utils'

interface EmployeeDetailComponentProps {
  detail: EmployeeDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
  onExport?: () => void
  moreActions?: DropdownAction[]
}

export function EmployeeDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
  onExport,
  moreActions,
}: EmployeeDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del trabajador..."
      emptyText="Selecciona un trabajador para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <EmployeeDetailContent
          detail={detail}
          onEdit={onEdit}
          onExport={onExport}
          moreActions={moreActions}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

interface EmployeeDetailContentProps {
  detail: EmployeeDetailView
  onEdit?: () => void
  onExport?: () => void
  moreActions?: DropdownAction[]
}

function EmployeeDetailContent({ detail, onEdit, onExport, moreActions }: EmployeeDetailContentProps) {
  const approvalTone = resolveApprovalTone(detail.statusName)
  const tenureStat = buildTenureStat(detail.createdAt)
  const description = (
    <>
      Trabajador <span className="num">{detail.statusName || 'sin estado'}</span> dentro del registro de RRHH.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.fullName}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={approvalTone} dot>
              {detail.statusName || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.hasContract ? 'accent' : 'neutral'} dot>
              {detail.hasContract ? 'Contrato vigente' : 'Sin contrato'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.rehireEligible ? 'ok' : 'bad'} dot>
              {detail.rehireEligible ? 'Recontratable' : 'No recontratable'}
            </DetailBadgeComponent>
          </>
        }
        stat={tenureStat}
        actions={<HeroActionButtons onEdit={onEdit} onExport={onExport} moreActions={moreActions} />}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Datos generales" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent
            title="Identificación"
            value={`${detail.identificationType} · ${detail.identification}`}
            mono
          />
          <DetailFieldCardComponent title="Fecha nacimiento" value={detail.birthDate} />
          <DetailFieldCardComponent title="Género" value={detail.gender} />
          <DetailFieldCardComponent title="Estado civil" value={detail.maritalStatus} />
          <DetailFieldCardComponent title="Educación" value={detail.educationLevel} />
          <DetailFieldCardComponent title="Profesión" value={detail.profession} />
          <DetailFieldCardComponent title="Licencia" value={detail.driverLicense} />
          <DetailFieldCardComponent title="Nacionalidad" value={detail.nationality} />
          <DetailFieldCardComponent title="Extranjero" value={detail.expat} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Contacto" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Correo corporativo" value={detail.corporateEmail} valueClassName="break-all" />
          <DetailFieldCardComponent title="Correo personal" value={detail.personalEmail} valueClassName="break-all" />
          <DetailFieldCardComponent title="Teléfono" value={detail.phone} mono />
          <DetailFieldCardComponent title="Teléfono 2" value={detail.phone2} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Contacto de emergencia" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre" value={detail.emergencyContactName} />
          <DetailFieldCardComponent title="Parentesco" value={detail.emergencyContactRelationship} />
          <DetailFieldCardComponent title="Teléfono" value={detail.emergencyContactPhone} mono />
          <DetailFieldCardComponent title="Teléfono 2" value={detail.emergencyContactPhone2} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Dirección" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Calle" value={detail.streetName} />
          <DetailFieldCardComponent title="Número" value={detail.streetNumber} mono />
          <DetailFieldCardComponent title="Código postal" value={detail.postalCode} mono />
          <DetailFieldCardComponent title="Departamento" value={detail.department} />
          <DetailFieldCardComponent title="Villa" value={detail.village} />
          <DetailFieldCardComponent title="Manzana" value={detail.block} />
          <DetailFieldCardComponent title="Región" value={detail.region} />
          <DetailFieldCardComponent title="Comuna" value={detail.commune} />
          <DetailFieldCardComponent title="Ciudad" value={detail.city} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="05" title="Salud y previsión" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="AFP" value={detail.afp} />
          <DetailFieldCardComponent title="Asig. familiar" value={detail.familyAllowanceTier} />
          <DetailFieldCardComponent title="Estado pensión" value={detail.pensionStatus} />
          <DetailFieldCardComponent title="Jubilación" value={detail.retirementStatus} />
          <DetailFieldCardComponent title="ISAPRE/FUN" value={detail.isapreFun} />
          <DetailFieldCardComponent title="Seguro salud" value={detail.healthInsurance} />
          <DetailFieldCardComponent title="Plan salud" value={detail.healthInsuranceTariff} />
          <DetailFieldCardComponent title="Salud UF" value={detail.healthInsuranceUF} mono />
          <DetailFieldCardComponent title="Salud pesos" value={detail.healthInsurancePesos} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="06" title="Pago y tallas" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Método de pago" value={detail.paymentMethod} />
          <DetailFieldCardComponent title="Banco" value={detail.bank} />
          <DetailFieldCardComponent title="Cuenta" value={detail.bankAccount} mono />
          <DetailFieldCardComponent title="Talla ropa" value={detail.clothingSize} mono />
          <DetailFieldCardComponent title="Talla zapato" value={detail.shoeSize} mono />
          <DetailFieldCardComponent title="Talla pantalón" value={detail.pantSize} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="07" title="Usuario vinculado" />
        {detail.username || detail.userEmail ? (
          <div className="r-lg flex items-center gap-4 border border-slate-200 p-4 dark:border-white/10">
            <AvatarInitialsComponent
              fullName={detail.fullName}
              fallbackInitials="TR"
              className="accent-bg-soft accent-text h-12 w-12 text-[13px] font-bold"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
                {detail.username ? `@${detail.username}` : 'Sin usuario'}
              </p>
              <p className="truncate text-[12.5px] text-slate-500 dark:text-slate-400">
                {detail.userEmail || '—'}
              </p>
            </div>
            <DetailBadgeComponent tone={detail.userEnabled ? 'ok' : 'bad'} dot>
              {detail.userEnabled ? 'Habilitado' : 'Deshabilitado'}
            </DetailBadgeComponent>
          </div>
        ) : (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Sin usuario vinculado.</p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="08" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.createdAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Registro creado</p>
            </div>
          </li>
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.updatedAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Última actualización</p>
            </div>
          </li>
        </ol>
      </section>
    </section>
  )
}

interface HeroActionButtonsProps {
  onEdit?: () => void
  onExport?: () => void
  moreActions?: DropdownAction[]
}

function HeroActionButtons({ onEdit, onExport, moreActions }: HeroActionButtonsProps) {
  const baseBtn =
    'inline-flex items-center gap-1.5 r-md border border-slate-200 bg-white px-2.5 h-9 text-[12.5px] text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60'

  return (
    <>
      <button type="button" onClick={onExport} className={baseBtn}>
        <IconDownload />
        Exportar
      </button>
      <DropdownActionsMenuComponent actions={moreActions ?? []} />
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 r-md accent-bg h-9 px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
      >
        <IconEdit />
        Editar
      </button>
    </>
  )
}

