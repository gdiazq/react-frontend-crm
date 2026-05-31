import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SettingsAccountTabComponent,
  SettingsHeroComponent,
  SettingsMfaTabComponent,
  SettingsStatusMessageComponent,
  TabsComponent,
} from '@/components'
import { useFormValidation, useSettingsInit } from '@/hooks'
import { AUTH_ROUTE_LOGIN } from '@/constant'
import { initialUpdateAvatarForm, initialUpdateProfileForm } from '@/factories'
import { settingsUpdateProfileValidationRules } from '@/validators'
import {
  mapperSettingAvatarFileValidation,
  mapperSettingAvatarView,
  mapperUpdateProfilePayload,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreSettings } from '@/store'
import { selectActiveSessions, selectMfaStatusClass, selectMfaStatusLabel } from '@/store/settings.store'

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

  const avatarView = mapperSettingAvatarView(profile, avatarForm.previewUrl, user?.avatarUrl ?? '')

  const handleEnableMfa = async () => {
    const success = await setupMfa(currentUsername)
    if (success) await buildMfaQrImage(useStoreSettings.getState().mfaSetupData, currentUsername)
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

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setAvatarError(null)
    if (!file) { setAvatarForm((form) => ({ ...form, file: null, previewUrl: '' })); return }
    const validation = mapperSettingAvatarFileValidation(file)
    if (!validation.valid) {
      setAvatarError(validation.message)
      setAvatarForm((form) => ({ ...form, file: null, previewUrl: '' }))
      event.target.value = ''
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
      <SettingsHeroComponent
        mfaStatusLabel={mfaStatusLabel}
        mfaStatusClass={mfaStatusClass}
        activeSessions={activeSessions}
      />

      <SettingsStatusMessageComponent message={statusMessage} />

      <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {showAccountTab && (
        <SettingsAccountTabComponent
          profile={profile}
          profileErrors={profileErrors}
          avatarForm={avatarForm}
          avatarDisplayUrl={avatarView.displayUrl}
          avatarInitials={avatarView.initials}
          avatarError={avatarError}
          avatarInputRef={avatarInputRef}
          updateProfileSubmitting={updateProfileSubmitting}
          updateAvatarSubmitting={updateAvatarSubmitting}
          onProfileChange={handleProfileChange}
          onProfileValidation={onProfileValidation}
          onAvatarFileChange={handleAvatarFileChange}
          onSelectAvatar={() => avatarInputRef.current?.click()}
          onSaveProfile={() => { void handleSaveProfile() }}
          onSaveAvatar={() => { void handleSaveAvatar() }}
        />
      )}

      {showMfaTab && (
        <SettingsMfaTabComponent
          mfaState={mfaState}
          mfaSetupData={mfaSetupData}
          mfaSetupSteps={mfaSetupSteps}
          mfaQrImage={mfaQrImage}
          mfaStatusLabel={mfaStatusLabel}
          mfaStatusClass={mfaStatusClass}
          mfaVerificationCode={mfaVerificationCode}
          devices={devices}
          currentUsername={currentUsername}
          loadingMfaAction={loadingMfaAction}
          loadingLogoutDevice={loadingLogoutDevice}
          loadingSessions={loadingSessions}
          onEnableMfa={() => { void handleEnableMfa() }}
          onDisableMfa={(username) => { void disableMfa(username) }}
          onVerifyMfa={(username) => { void verifyMfa(username) }}
          onMfaVerificationCodeChange={setMfaVerificationCode}
          onLogoutDevice={(id) => { void handleLogoutDevice(id) }}
        />
      )}
    </section>
  )
}
