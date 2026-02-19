import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { ButtonComponent, InputComponent, TabsComponent } from '@/components'
import { useFormValidation } from '@/hooks'
import { AUTH_ROUTE_LOGIN } from '@/constant'
import { initialUpdateAvatarForm, initialUpdateProfileForm } from '@/factories'
import { settingsUpdateProfileValidationRules } from '@/validators'
import { mapperSettingProfileForm, mapperUpdateProfilePayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreSettings } from '@/store'
import { selectActiveSessions, selectMfaStatusClass, selectMfaStatusLabel } from '@/store/settings.store'

export default function SettingsPage() {
  const navigate = useNavigate()
  const user = useStoreAuth((s) => s.user)
  const updateProfileSubmitting = useStoreAuth((s) => s.updateProfileSubmitting)
  const updateAvatarSubmitting = useStoreAuth((s) => s.updateAvatarSubmitting)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const updateProfile = useStoreAuth((s) => s.updateProfile)
  const updateAvatar = useStoreAuth((s) => s.updateAvatar)

  const mfaState = useStoreSettings((s) => s.mfaState)
  const mfaSetupData = useStoreSettings((s) => s.mfaSetupData)
  const mfaVerificationCode = useStoreSettings((s) => s.mfaVerificationCode)
  const statusMessage = useStoreSettings((s) => s.statusMessage)
  const devices = useStoreSettings((s) => s.devices)
  const tabs = useStoreSettings((s) => s.tabs)
  const activeTab = useStoreSettings((s) => s.activeTab)
  const loadingMfaAction = useStoreSettings((s) => s.loadingMfaAction)
  const loadingLogoutDevice = useStoreSettings((s) => s.loadingLogoutDevice)
  const mutationMfaSetup = useStoreSettings((s) => s.mutationMfaSetup)
  const mutationMfaDisable = useStoreSettings((s) => s.mutationMfaDisable)
  const mutationMfaVerify = useStoreSettings((s) => s.mutationMfaVerify)
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
  const [mfaQrImage, setMfaQrImage] = useState('')
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const { errors: profileErrors, validateAll: validateProfile, onValidation: onProfileValidation } =
    useFormValidation(profile, settingsUpdateProfileValidationRules)

  const userAvatarUrl = user?.avatar_url || ''
  const avatarDisplayUrl = avatarForm.previewUrl || userAvatarUrl
  const avatarInitials = (() => {
    const first = profile.firstName.trim().charAt(0)
    const last = profile.lastName.trim().charAt(0)
    return `${first}${last}`.trim().toUpperCase() || 'U'
  })()

  const currentUsername = user?.username || ''

  const buildOtpAuthUri = (secret: string, username: string) => {
    const issuer = 'CRM'
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(username || 'user')}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(issuer)}`
  }

  const buildMfaQrImage = async () => {
    const value = mfaSetupData.otpauthUri || mfaSetupData.qrCodeUrl || (mfaSetupData.secret ? buildOtpAuthUri(mfaSetupData.secret, currentUsername) : '')
    if (!value) { setMfaQrImage(''); return }
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
      setMfaQrImage(value); return
    }
    try {
      const dataUrl = await QRCode.toDataURL(value, { width: 220, margin: 1, errorCorrectionLevel: 'M' })
      setMfaQrImage(dataUrl)
    } catch { setMfaQrImage('') }
  }

  useEffect(() => {
    const init = async () => {
      await getCurrentUser()
      const u = useStoreAuth.getState().user
      if (u) setProfile(mapperSettingProfileForm(u))
      await loadMfaAndSessions(u?.email || '')
      await buildMfaQrImage()
    }
    init()
    return () => {
      if (avatarForm.previewUrl) URL.revokeObjectURL(avatarForm.previewUrl)
    }
  }, [])

  const handleEnableMfa = async () => {
    const success = await mutationMfaSetup(currentUsername)
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
    if (success) { setStatusMessage(messages.settings.status.success.profileUpdateSuccess); return }
    setStatusMessage(useStoreAuth.getState().errorMessage || messages.settings.status.errors.profileUpdateError)
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      return
    }
    setStatusMessage(useStoreAuth.getState().errorMessage || messages.settings.status.errors.avatarUpdateError)
  }

  const showAccountTab = activeTab === 'account'
  const showMfaTab = activeTab === 'mfa'

  return (
    <section className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Configuracion de Seguridad</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Gestion de autenticacion de dos factores (2FA/MFA) y sesiones por dispositivo.
        </p>
        <p className="mt-2 text-xs text-cyan-700 dark:text-cyan-300">{statusMessage}</p>
      </section>

      <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {showAccountTab && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
          <h2 className="text-lg font-semibold">Informacion de la cuenta</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Actualiza tus datos personales asociados a la cuenta.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-semibold text-slate-700 ring-2 ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
              {avatarDisplayUrl ? (
                <img src={avatarDisplayUrl} alt="Vista previa del avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{avatarInitials}</span>
              )}
            </div>

            <div className="min-w-[260px] flex-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Avatar</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">JPG, PNG o WEBP. Maximo recomendado: 2MB.</p>

              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ButtonComponent
                  variant="outline"
                  label="Seleccionar imagen"
                  className="border-cyan-500 text-cyan-700 dark:border-cyan-300/60 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
                  onClick={() => avatarInputRef.current?.click()}
                />
                <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                  {avatarForm.file?.name || 'Sin archivo seleccionado'}
                </p>
              </div>
              {avatarError && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{avatarError}</p>}
            </div>

            <div className="ml-auto">
              <ButtonComponent
                variant="primary"
                disabled={updateAvatarSubmitting}
                label={updateAvatarSubmitting ? 'Subiendo...' : 'Actualizar avatar'}
                onClick={handleSaveAvatar}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InputComponent value={profile.firstName} label="Nombre" type="text" error={profileErrors.firstName} onValueChange={(v) => setProfile((p) => ({ ...p, firstName: v }))} onBlur={onProfileValidation('firstName')} required />
            <InputComponent value={profile.lastName} label="Apellido" type="text" error={profileErrors.lastName} onValueChange={(v) => setProfile((p) => ({ ...p, lastName: v }))} onBlur={onProfileValidation('lastName')} required />
            <InputComponent value={profile.email} label="Email" type="email" error={profileErrors.email} onValueChange={(v) => setProfile((p) => ({ ...p, email: v }))} onBlur={onProfileValidation('email')} required />
            <InputComponent value={profile.phoneNumber} label="Telefono" type="tel" placeholder="+56912345678" error={profileErrors.phoneNumber} onValueChange={(v) => setProfile((p) => ({ ...p, phoneNumber: v }))} onBlur={onProfileValidation('phoneNumber')} required />
          </div>

          <div className="mt-4">
            <ButtonComponent
              variant="primary"
              disabled={updateProfileSubmitting}
              label={updateProfileSubmitting ? 'Guardando...' : 'Guardar cambios'}
              onClick={handleSaveProfile}
            />
          </div>
        </section>
      )}

      {showMfaTab && (
        <section className="grid items-start gap-6 lg:grid-cols-2">
          <article className="self-start overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
            <h2 className="text-lg font-semibold">Estado de MFA</h2>
            <p className="mt-2 text-sm">
              Estado actual: <strong className={mfaStatusClass}>{mfaStatusLabel}</strong>
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Metodo: {mfaState.method}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ultima verificacion: {mfaState.lastVerification}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Verificado: {mfaState.verified ? 'Si' : 'No'}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {!mfaState.enabled && (
                <ButtonComponent variant="primary" disabled={loadingMfaAction} label={loadingMfaAction ? 'Procesando...' : 'Iniciar setup MFA'} onClick={handleEnableMfa} />
              )}
              {mfaState.enabled && (
                <ButtonComponent variant="danger" disabled={loadingMfaAction} label="Deshabilitar MFA" onClick={() => mutationMfaDisable(currentUsername)} />
              )}
            </div>

            {!mfaState.enabled && (
              <>
                <div className="mt-4">
                  <InputComponent value={mfaVerificationCode} label="Codigo MFA" type="text" placeholder="123456" onValueChange={setMfaVerificationCode} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ButtonComponent variant="outline" disabled={loadingMfaAction} label="Verificar codigo MFA" onClick={() => mutationMfaVerify(currentUsername)} />
                </div>
              </>
            )}
          </article>

          <article className="self-start rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
            <h2 className="text-lg font-semibold">Setup de 2FA</h2>
            <div className="mt-2 flex flex-col gap-3 lg:flex-nowrap lg:flex-row lg:items-start lg:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-300">Flujo recomendado para onboarding seguro de doble factor.</p>
                <ol className="mt-1 list-none space-y-2.5 text-sm text-slate-300">
                  {['Instala Google Authenticator, Microsoft Authenticator o Authy.', 'Escanea el QR de configuracion de 2FA.', 'Ingresa el codigo de 6 digitos para confirmar setup.'].map((step, i) => (
                    <li key={i} className="rounded-lg border border-slate-700/70 px-3 py-2">
                      <span className="mr-2 font-semibold text-slate-200">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="w-full max-w-[12.5rem] lg:shrink-0">
                {mfaQrImage ? (
                  <div className="rounded-xl border border-cyan-300/40 bg-cyan-50/70 p-3 dark:border-cyan-400/30 dark:bg-cyan-900/20">
                    <img src={mfaQrImage} alt="QR de configuracion MFA" className="mx-auto h-44 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 px-3 py-10 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Inicia setup MFA para generar QR
                  </div>
                )}

                {mfaSetupData.secret && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Secret</p>
                    <code className="block break-all rounded-md bg-slate-900 px-2 py-1 text-xs text-cyan-300">{mfaSetupData.secret}</code>
                  </div>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      {showMfaTab && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Sesiones por Dispositivo</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Sesiones activas: {activeSessions}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {devices.map((device) => (
              <article key={device.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-3 dark:border-white/10">
                <div>
                  <p className="text-sm font-semibold">{device.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {device.location} · {device.lastSeen}
                    {device.current && <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">(Actual)</span>}
                  </p>
                </div>
                <ButtonComponent
                  variant={device.current ? 'outline' : 'danger'}
                  disabled={loadingLogoutDevice}
                  label="Desloguear dispositivo"
                  onClick={() => handleLogoutDevice(device.id)}
                />
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
