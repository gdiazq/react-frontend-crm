import { ButtonComponent, InputComponent } from '@/components'
import type { RefObject } from 'react'
import type { SettingUpdateAvatarForm, SettingUpdateProfileForm } from '@/types'
import { SettingsCardComponent, SettingsSectionTitleComponent, SettingsUserIcon } from '../shared'

type SettingsProfileField = keyof SettingUpdateProfileForm

interface SettingsAccountTabComponentProps {
  profile: SettingUpdateProfileForm
  profileErrors: Partial<Record<SettingsProfileField, string>>
  avatarForm: SettingUpdateAvatarForm
  avatarDisplayUrl: string
  avatarInitials: string
  avatarError: string | null
  avatarInputRef: RefObject<HTMLInputElement | null>
  updateProfileSubmitting: boolean
  updateAvatarSubmitting: boolean
  onProfileChange: (field: SettingsProfileField) => (value: string) => void
  onProfileValidation: (field: SettingsProfileField) => () => void
  onAvatarFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSelectAvatar: () => void
  onSaveProfile: () => void
  onSaveAvatar: () => void
}

export function SettingsAccountTabComponent(props: SettingsAccountTabComponentProps) {
  const {
    profile,
    profileErrors,
    avatarForm,
    avatarDisplayUrl,
    avatarInitials,
    avatarError,
    avatarInputRef,
    updateProfileSubmitting,
    updateAvatarSubmitting,
    onProfileChange,
    onProfileValidation,
    onAvatarFileChange,
    onSelectAvatar,
    onSaveProfile,
    onSaveAvatar,
  } = props

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <SettingsCardComponent className="overflow-hidden">
        <div className="relative isolate p-5">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(8,145,178,0.14),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_34%)]" />
          <SettingsSectionTitleComponent eyebrow="Avatar" title="Identidad" description="Actualiza tu imagen visible para el resto del equipo." />

          <div className="mt-6 flex flex-col items-center text-center">
            <div className="r-full flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden bg-slate-100 text-[34px] font-semibold text-slate-700 ring-4 ring-white soft-ring dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-950">
              {avatarDisplayUrl ? (
                <img src={avatarDisplayUrl} alt="Vista previa del avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{avatarInitials}</span>
              )}
            </div>

            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFileChange} />

            <p className="mt-4 max-w-56 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {avatarForm.file?.name || 'Sin imagen nueva'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG, JPG o GIF · Max 5 MB</p>
            {avatarError && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{avatarError}</p>}

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <ButtonComponent
                variant="outline"
                label="Seleccionar"
                className="border-cyan-500 bg-white/80 text-cyan-700 dark:border-cyan-300/60 dark:bg-slate-950 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
                onClick={onSelectAvatar}
              />
              <ButtonComponent
                variant="primary"
                disabled={updateAvatarSubmitting}
                label={updateAvatarSubmitting ? 'Guardando...' : 'Guardar'}
                onClick={onSaveAvatar}
              />
            </div>
          </div>
        </div>
      </SettingsCardComponent>

      <SettingsCardComponent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
          <SettingsSectionTitleComponent eyebrow="Perfil" title="Datos personales" description="Mantén la informacion base asociada a tu cuenta." />
          <div className="r-xl inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
            <SettingsUserIcon />
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InputComponent 
            value={profile.firstName} 
            label="Nombre" 
            type="text" 
            error={profileErrors.firstName} 
            onValueChange={onProfileChange('firstName')} 
            onBlur={onProfileValidation('firstName')} 
            required 
          />
          <InputComponent 
            value={profile.lastName} 
            label="Apellido" 
            type="text" 
            error={profileErrors.lastName} 
            onValueChange={onProfileChange('lastName')} 
            onBlur={onProfileValidation('lastName')} 
            required 
          />
          <InputComponent 
            value={profile.email} 
            label="Correo electronico" 
            type="email" 
            error={profileErrors.email} 
            onValueChange={onProfileChange('email')} 
            onBlur={onProfileValidation('email')} 
            required 
          />
          <InputComponent 
            value={profile.phoneNumber} 
            label="Telefono" 
            type="tel" 
            placeholder="+1 555 000 0000" 
            error={profileErrors.phoneNumber} 
            onValueChange={onProfileChange('phoneNumber')} 
            onBlur={onProfileValidation('phoneNumber')} 
            required 
          />
        </div>

        <div className="mt-6 flex justify-end">
          <ButtonComponent
            variant="primary"
            disabled={updateProfileSubmitting}
            label={updateProfileSubmitting ? 'Guardando...' : 'Guardar cambios'}
            onClick={onSaveProfile}
          />
        </div>
      </SettingsCardComponent>
    </section>
  )
}
