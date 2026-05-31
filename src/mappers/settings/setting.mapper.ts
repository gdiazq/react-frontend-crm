import type {
  AuthUser,
  SettingDeviceSession,
  SettingDeviceSessionRaw,
  SettingMfaSetupData,
  SettingMfaSetupDataRaw,
  SettingMfaStatusResponse,
  SettingMfaState,
  SettingAvatarFileValidation,
  SettingAvatarView,
  SettingUpdateProfileForm,
  SettingUpdateAvatarPayload,
  SettingUpdateProfilePayload,
} from '@/types'
import messages from '@/messages/messages'
import { formatDateTime } from '@/utils'

export function mapperUpdateProfilePayload(id: number, form: SettingUpdateProfileForm): SettingUpdateProfilePayload {
  return {
    id,
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: form.phoneNumber.trim(),
  }
}

export function mapperUpdateAvatarFormData(payload: SettingUpdateAvatarPayload): FormData {
  const formData = new FormData()
  formData.append('file', payload.file)
  return formData
}

export function mapperSettingProfileForm(user: AuthUser): SettingUpdateProfileForm {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber ?? '',
  }
}

export function mapperSettingAvatarView(
  profile: SettingUpdateProfileForm,
  previewUrl: string,
  currentAvatarUrl: string,
): SettingAvatarView {
  const first = profile.firstName.trim().charAt(0)
  const last = profile.lastName.trim().charAt(0)

  return {
    displayUrl: previewUrl || currentAvatarUrl,
    initials: `${first}${last}`.trim().toUpperCase() || 'U',
  }
}

export function mapperSettingAvatarFileValidation(file: File | null | undefined): SettingAvatarFileValidation {
  if (!file) return { valid: true, message: null }
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: messages.settings.status.errors.avatarInvalidFile }
  }
  return { valid: true, message: null }
}

export function mapperMfaStateFromResponse(data: SettingMfaStatusResponse): SettingMfaState {
  return {
    enabled: data.status ?? false,
    verified: data.verified ?? false,
    method: messages.settings.ui.mfaDefaultMethod,
    lastVerification: data.lastVerification || messages.settings.ui.mfaNoRecentVerification,
  }
}

export function mapperMfaSetupDataFromResponse(data: SettingMfaSetupDataRaw): SettingMfaSetupData {
  return {
    qrCodeUrl: data.qrCodeUrl ?? '',
    secret: data.secret ?? '',
    otpauthUri: data.otpauthUri ?? '',
  }
}

export function mapperSettingSessionsFromResponse(
  data: SettingDeviceSessionRaw[],
  currentDeviceId: string,
): SettingDeviceSession[] {
  return data
    .map((item, index) => {
      const resolvedId = String(item.id ?? '').trim()
      return {
        id: resolvedId,
        name: item.userAgent?.trim() || `${messages.settings.ui.sessionDefaultName} ${index + 1}`,
        location: item.ipAddress?.trim() || messages.settings.ui.sessionNoIp,
        lastSeen: formatDateTime(item.lastSeenAt || item.createdAt, messages.settings.ui.sessionNoActivity),
        current: (item.deviceId ?? '').trim() === currentDeviceId,
      }
    })
    .filter((item) => item.id.length > 0)
}
