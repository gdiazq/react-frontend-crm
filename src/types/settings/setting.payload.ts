export interface SettingMfaSetupPayload {
  username: string
  deviceId: string
}

export interface SettingMfaVerifyPayload {
  username: string
  code: string
  deviceId: string
}

export interface SettingMfaDisablePayload {
  username: string
  deviceId: string
}

export interface SettingUpdateProfilePayload {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface SettingUpdateAvatarPayload {
  file: File
}
