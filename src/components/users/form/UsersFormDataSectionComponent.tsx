import { DetailSectionHeaderComponent, InputComponent, SelectComponent } from '@/components'
import { initialCreateUserForm } from '@/factories'
import messages from '@/messages/messages'

type UserFormShape = typeof initialCreateUserForm
type UserFormField = keyof UserFormShape
type SelectOption = { label: string, value: string }

interface UsersFormDataSectionComponentProps {
  form: UserFormShape
  errors: Partial<Record<UserFormField, string>>
  isEditMode: boolean
  roleOptions: SelectOption[]
  onChangeField: (field: UserFormField) => (value: string) => void
  onValidation: (field: UserFormField) => () => void
}

function SubSectionLabel({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      <span className="num accent-text">{number}</span>
      <span>{title}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}

export function UsersFormDataSectionComponent({
  form,
  errors,
  isEditMode,
  roleOptions,
  onChangeField,
  onValidation,
}: UsersFormDataSectionComponentProps) {
  return (
    <>
      <section className="space-y-6">
        <DetailSectionHeaderComponent number="01" title="Datos de acceso" />

        <div className="space-y-3">
          <SubSectionLabel number="01.1" title="Credenciales" />
          <div className="grid gap-4 md:grid-cols-2">
            <InputComponent
              value={form.username}
              label="Usuario"
              type="text"
              placeholder="Ingresa el usuario"
              autoComplete="username"
              error={errors.username}
              onValueChange={onChangeField('username')}
              onBlur={onValidation('username')}
              disabled={isEditMode}
              required
            />

            <InputComponent
              value={form.email}
              label="Correo"
              type="email"
              placeholder="Ingresa el correo"
              autoComplete="email"
              error={errors.email}
              onValueChange={onChangeField('email')}
              onBlur={onValidation('email')}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <SubSectionLabel number="01.2" title="Identidad" />
          <div className="grid gap-4 md:grid-cols-3">
            <InputComponent
              value={form.firstName}
              label="Nombre"
              type="text"
              placeholder="Ingresa el nombre"
              autoComplete="given-name"
              error={errors.firstName}
              onValueChange={onChangeField('firstName')}
              onBlur={onValidation('firstName')}
              required
            />

            <InputComponent
              value={form.lastName}
              label="Apellido"
              type="text"
              placeholder="Ingresa el apellido"
              autoComplete="family-name"
              error={errors.lastName}
              onValueChange={onChangeField('lastName')}
              onBlur={onValidation('lastName')}
              required
            />

            <InputComponent
              value={form.phoneNumber}
              label="Teléfono"
              type="tel"
              placeholder="Ingresa el teléfono"
              autoComplete="tel"
              error={errors.phoneNumber}
              onValueChange={onChangeField('phoneNumber')}
              onBlur={onValidation('phoneNumber')}
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <DetailSectionHeaderComponent number="02" title="Rol y permisos" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectComponent
            value={form.roleId}
            label={messages.users.ui.createUserRoleLabel}
            options={roleOptions}
            error={errors.roleId}
            onValueChange={onChangeField('roleId')}
            onValidation={onValidation('roleId')}
            required
          />
        </div>
      </section>
    </>
  )
}
