export interface SettingDeviceSession {
  id: string
  name: string
  location: string
  lastSeen: string
  current: boolean
}

export interface SettingDeviceSessionRaw {
  id?: number | string
  ipAddress?: string
  userAgent?: string
  deviceId?: string
  createdAt?: string
  lastSeenAt?: string
}

export interface SettingMfaState {
  enabled: boolean
  verified: boolean
  method: string
  lastVerification: string
}

export interface SettingMfaStatusResponse {
  status?: boolean
  verified?: boolean
  lastVerification?: string
}

export interface SettingMfaSetupDataRaw {
  qrCodeUrl?: string
  secret?: string
  otpauthUri?: string
}

export interface SettingMfaSetupData {
  qrCodeUrl: string
  secret: string
  otpauthUri: string
}

export type SettingTabKey = 'account' | 'mfa'

export interface SettingTabOption {
  key: SettingTabKey
  label: string
}
