import { useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonComponent, InputComponent, TabsComponent } from '@/components'
import { useFormValidation, useSettingsInit } from '@/hooks'
import { AUTH_ROUTE_LOGIN } from '@/constant'
import { initialUpdateAvatarForm, initialUpdateProfileForm } from '@/factories'
import { settingsUpdateProfileValidationRules } from '@/validators'
import { mapperUpdateProfilePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreSettings } from '@/store'
import { selectActiveSessions, selectMfaStatusClass, selectMfaStatusLabel } from '@/store/settings.store'

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconDevice() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  )
}

function SettingsCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <section className={`r-2xl border border-slate-200 bg-white soft-ring dark:border-white/10 dark:bg-slate-950 ${className}`}>
      {children}
    </section>
  )
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string, title: string, description?: string }) {
  return (
    <div>
      <p className="num text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="display mt-2 text-[32px] leading-none text-slate-950 dark:text-slate-50">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const user = useStoreAuth((s) => s.user)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)

  const updateProfileSubmitting = useStoreSettings((s) => s.updateProfileSubmitting)
  const updateAvatarSubmitting = useStoreSettings((s) => s.updateAvatarSubmitting)
  const updateProfile = useStoreSettings((s) => s.updateProfile)
  const updateAvatar = useStoreSettings((s) => s.updateAvatar)

  const mfaState = useStoreSettings((s) => s.mfaState)
  const mfaSetupData = useStoreSettings((s) => s.mfaSetupData)
  const mfaVerificationCode = useStoreSettings((s) => s.mfaVerificationCode)
  const statusMessage = useStoreSettings((s) => s.statusMessage)
  const devices = useStoreSettings((s) => s.devices)
  const tabs = useStoreSettings((s) => s.tabs)
  const activeTab = useStoreSettings((s) => s.activeTab)
  const loadingMfaAction = useStoreSettings((s) => s.loadingMfaAction)
  const loadingLogoutDevice = useStoreSettings((s) => s.loadingLogoutDevice)
  const loadingSessions = useStoreSettings((s) => s.loadingSessions)
  const mfaSetupSteps = useStoreSettings((s) => s.mfaSetupSteps)
  const setupMfa = useStoreSettings((s) => s.setupMfa)
  const disableMfa = useStoreSettings((s) => s.disableMfa)
  const verifyMfa = useStoreSettings((s) => s.verifyMfa)
  const loadMfaAndSessions = useStoreSettings((s) => s.loadMfaAndSessions)
  const logoutDevice = useStoreSettings((s) => s.logoutDevice)
  const setActiveTab = useStoreSettings((s) => s.setActiveTab)
  const setMfaVerificationCode = useStoreSettings((s) => s.setMfaVerificationCode)
  const setStatusMessage = useStoreSettings((s) => s.setStatusMessage)
  const activeSessions = useStoreSettings(selectActiveSessions)
  const mfaStatusLabel = useStoreSettings(selectMfaStatusLabel)
  const mfaStatusClass = useStoreSettings(selectMfaStatusClass)

  const [profile, setProfile] = useState({ ...initialUpdateProfileForm })
  const [avatarForm, setAvatarForm] = useState({ ...initialUpdateAvatarForm })
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const { errors: profileErrors, validateAll: validateProfile, onValidation: onProfileValidation } =
    useFormValidation(profile, settingsUpdateProfileValidationRules)

  const currentUsername = user?.username ?? ''

  const { mfaQrImage, buildMfaQrImage } = useSettingsInit({
    mfaSetupData,
    currentUsername,
    getCurrentUser,
    loadMfaAndSessions,
    setProfile,
  })

  const userAvatarUrl = user?.avatarUrl ?? ''
  const avatarDisplayUrl = avatarForm.previewUrl || userAvatarUrl
  const avatarInitials = (() => {
    const first = profile.firstName.trim().charAt(0)
    const last = profile.lastName.trim().charAt(0)
    return `${first}${last}`.trim().toUpperCase() || 'U'
  })()

  const handleEnableMfa = async () => {
    const success = await setupMfa(currentUsername)
    if (success) await buildMfaQrImage()
  }

  const handleLogoutDevice = async (id: string) => {
    await logoutDevice(id)
    await useStoreAuth.getState().logout()
    navigate(AUTH_ROUTE_LOGIN)
  }

  const handleSaveProfile = async () => {
    if (!validateProfile()) { setStatusMessage(messages.settings.status.errors.profileValidationError); return }
    if (!user?.id) { setStatusMessage(messages.settings.status.errors.profileUserNotFound); return }

    const payload = mapperUpdateProfilePayload(user.id, profile)
    const success = await updateProfile(payload)
    if (success) setStatusMessage(messages.settings.status.success.profileUpdateSuccess)
  }

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setAvatarError(null)
    if (!file) { setAvatarForm((f) => ({ ...f, file: null, previewUrl: '' })); return }
    if (!file.type.startsWith('image/')) {
      setAvatarError(messages.settings.status.errors.avatarInvalidFile)
      setAvatarForm((f) => ({ ...f, file: null, previewUrl: '' }))
      e.target.value = ''
      return
    }
    if (avatarForm.previewUrl) URL.revokeObjectURL(avatarForm.previewUrl)
    setAvatarForm({ file, previewUrl: URL.createObjectURL(file) })
  }

  const handleSaveAvatar = async () => {
    if (!user?.id) { setStatusMessage(messages.settings.status.errors.avatarUserNotFound); return }
    if (!avatarForm.file) { setAvatarError(messages.settings.status.errors.avatarSelectImage); return }

    const success = await updateAvatar(user.id, { file: avatarForm.file })
    if (success) {
      setAvatarError(null)
      if (avatarForm.previewUrl) URL.revokeObjectURL(avatarForm.previewUrl)
      setAvatarForm({ file: null, previewUrl: '' })
      setStatusMessage(messages.settings.status.success.avatarUpdateSuccess)
    }
  }

  const showAccountTab = activeTab === 'account'
  const showMfaTab = activeTab === 'mfa'
  const handleProfileChange = (field: keyof typeof profile) => (value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="min-w-0 space-y-5">
      <header className="relative isolate overflow-hidden rounded-[calc(1.5rem*var(--radius-scale))] border border-slate-200 bg-white p-5 soft-ring dark:border-white/10 dark:bg-slate-950 sm:p-6 lg:p-7">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(8,145,178,0.14),transparent_30%),linear-gradient(135deg,rgba(236,254,255,0.72),transparent_48%)] dark:bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(135deg,rgba(8,47,73,0.22),transparent_48%)]" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <span className="num">CUENTA · SEGURIDAD</span>
            </div>
            <h1 className="display mt-3 text-[42px] leading-[0.95] text-slate-950 dark:text-slate-50 sm:text-[56px]">
              Configuracion
              <span className="display-it text-slate-500 dark:text-slate-400"> del sistema</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Administra tu perfil, avatar, autenticacion multifactor y sesiones activas desde un solo lugar.
            </p>
          </div>

          <div className="grid min-w-[220px] grid-cols-2 gap-2">
            <article className="r-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/65">
              <p className="num text-[10px] uppercase tracking-[0.16em] text-slate-400">MFA</p>
              <p className={`mt-2 text-sm font-semibold ${mfaStatusClass}`}>{mfaStatusLabel}</p>
            </article>
            <article className="r-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/65">
              <p className="num text-[10px] uppercase tracking-[0.16em] text-slate-400">Sesiones</p>
              <p className="display mt-1 text-[30px] leading-none text-slate-950 dark:text-slate-50">{activeSessions}</p>
            </article>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div className="r-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
          {statusMessage}
        </div>
      )}

      <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {showAccountTab && (
        <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <SettingsCard className="overflow-hidden">
            <div className="relative isolate p-5">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(8,145,178,0.14),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_34%)]" />
              <SectionTitle eyebrow="Avatar" title="Identidad" description="Actualiza tu imagen visible para el resto del equipo." />

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="r-full flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden bg-slate-100 text-[34px] font-semibold text-slate-700 ring-4 ring-white soft-ring dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-950">
                  {avatarDisplayUrl ? (
                    <img src={avatarDisplayUrl} alt="Vista previa del avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{avatarInitials}</span>
                  )}
                </div>

                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />

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
                    onClick={() => avatarInputRef.current?.click()}
                  />
                  <ButtonComponent
                    variant="primary"
                    disabled={updateAvatarSubmitting}
                    label={updateAvatarSubmitting ? 'Guardando...' : 'Guardar'}
                    onClick={handleSaveAvatar}
                  />
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
              <SectionTitle eyebrow="Perfil" title="Datos personales" description="Mantén la informacion base asociada a tu cuenta." />
              <div className="r-xl inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
                <IconUser />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InputComponent value={profile.firstName} label="Nombre" type="text" error={profileErrors.firstName} onValueChange={handleProfileChange('firstName')} onBlur={onProfileValidation('firstName')} required />
              <InputComponent value={profile.lastName} label="Apellido" type="text" error={profileErrors.lastName} onValueChange={handleProfileChange('lastName')} onBlur={onProfileValidation('lastName')} required />
              <InputComponent value={profile.email} label="Correo electronico" type="email" error={profileErrors.email} onValueChange={handleProfileChange('email')} onBlur={onProfileValidation('email')} required />
              <InputComponent value={profile.phoneNumber} label="Telefono" type="tel" placeholder="+1 555 000 0000" error={profileErrors.phoneNumber} onValueChange={handleProfileChange('phoneNumber')} onBlur={onProfileValidation('phoneNumber')} required />
            </div>

            <div className="mt-6 flex justify-end">
              <ButtonComponent
                variant="primary"
                disabled={updateProfileSubmitting}
                label={updateProfileSubmitting ? 'Guardando...' : 'Guardar cambios'}
                onClick={handleSaveProfile}
              />
            </div>
          </SettingsCard>
        </section>
      )}

      {showMfaTab && (
        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <SettingsCard className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
                <SectionTitle eyebrow="MFA" title="Autenticacion multifactor" description="Protege la cuenta con codigos temporales desde una app autenticadora." />
                <div className="r-xl inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
                  <IconShield />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <InfoTile label="Estado" value={mfaStatusLabel} valueClass={mfaStatusClass} />
                <InfoTile label="Metodo" value={mfaState.method} />
                <InfoTile label="Verificado" value={mfaState.verified ? 'Si' : 'No'} />
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Ultima verificacion: {mfaState.lastVerification}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {!mfaState.enabled && (
                  <ButtonComponent variant="primary" disabled={loadingMfaAction} label={loadingMfaAction ? 'Procesando...' : 'Activar MFA'} onClick={handleEnableMfa} />
                )}
                {mfaState.enabled && (
                  <ButtonComponent variant="danger" disabled={loadingMfaAction} label="Desactivar MFA" onClick={() => disableMfa(currentUsername)} />
                )}
              </div>

              {!mfaState.enabled && (
                <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <InputComponent value={mfaVerificationCode} label="Codigo de verificacion" type="text" placeholder="000000" onValueChange={setMfaVerificationCode} />
                  <ButtonComponent variant="outline" disabled={loadingMfaAction} label="Verificar codigo" onClick={() => verifyMfa(currentUsername)} />
                </div>
              )}
            </SettingsCard>

            <SettingsCard className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <SectionTitle eyebrow="Sesiones" title="Dispositivos activos" description="Revisa desde donde se mantiene abierta tu cuenta." />
                <div className="r-xl inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
                  <IconDevice />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {devices.map((device) => (
                  <article key={device.id} className="r-xl flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-slate-50/70 px-3.5 py-3 dark:border-white/10 dark:bg-slate-900/55">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">{device.name}</p>
                        {device.current && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Actual</span>}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{device.location} · {device.lastSeen}</p>
                    </div>
                    <ButtonComponent
                      variant={device.current ? 'outline' : 'danger'}
                      disabled={loadingLogoutDevice || loadingSessions}
                      label={device.current ? 'Sesion actual' : 'Cerrar sesion'}
                      onClick={() => handleLogoutDevice(device.id)}
                    />
                  </article>
                ))}
              </div>
            </SettingsCard>
          </div>

          <SettingsCard className="overflow-hidden">
            <div className="relative isolate p-5 sm:p-6">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_0%,rgba(8,145,178,0.14),transparent_36%)] dark:bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.11),transparent_36%)]" />
              <SectionTitle eyebrow="Setup" title="Configurar MFA" description="Escanea el codigo QR o usa el secret manual para vincular tu app." />

              <ol className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                {mfaSetupSteps.map((step, i) => (
                  <li key={step} className="r-xl border border-slate-200 bg-white/75 px-3.5 py-3 dark:border-white/10 dark:bg-slate-900/60">
                    <span className="num mr-2 text-[11px] text-cyan-700 dark:text-cyan-300">{String(i + 1).padStart(2, '0')}</span>
                    {step.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>

              <div className="mt-5">
                {mfaQrImage ? (
                  <div className="r-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/25 dark:bg-cyan-300/10">
                    <img src={mfaQrImage} alt="QR de configuracion MFA" className="mx-auto h-48 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900" />
                  </div>
                ) : (
                  <div className="r-2xl flex min-h-48 items-center justify-center border border-dashed border-slate-300 bg-white/55 px-4 text-center text-sm text-slate-500 dark:border-white/15 dark:bg-slate-900/40 dark:text-slate-400">
                    Activa MFA para ver el codigo QR.
                  </div>
                )}
              </div>

              {mfaSetupData.secret && (
                <div className="mt-4">
                  <p className="num mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Secret manual</p>
                  <code className="block break-all rounded-md bg-slate-950 px-3 py-2 text-xs text-cyan-300 dark:bg-black/40">{mfaSetupData.secret}</code>
                </div>
              )}
            </div>
          </SettingsCard>
        </section>
      )}
    </section>
  )
}

function InfoTile({ label, value, valueClass = '' }: { label: string, value: string, valueClass?: string }) {
  return (
    <article className="r-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-slate-900/55">
      <p className="num text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`mt-2 truncate text-sm font-semibold text-slate-800 dark:text-slate-100 ${valueClass}`}>{value}</p>
    </article>
  )
}
