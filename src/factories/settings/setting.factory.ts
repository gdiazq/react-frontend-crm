import type {
  SettingDeviceSession,
  SettingMfaSetupData,
  SettingMfaState,
  SettingTabKey,
  SettingTabOption,
  SettingUpdateAvatarForm,
  SettingUpdateProfileForm,
} from '@/types'

export const initialUpdateProfileForm: SettingUpdateProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
}

export const initialUpdateAvatarForm: SettingUpdateAvatarForm = {
  file: null,
  previewUrl: '',
}

export const initialSettingsMfaState: SettingMfaState = {
  enabled: false,
  verified: false,
  method: 'Authenticator App (TOTP)',
  lastVerification: 'Sin verificacion reciente',
}

export const initialSettingsMfaSetupData: SettingMfaSetupData = {
  qrCodeUrl: '',
  secret: '',
  otpauthUri: '',
}

export const initialSettingsStatusMessage = 'Configuracion usando datos mock para integrar backend luego.'

export const initialSettingsTab: SettingTabKey = 'account'

export const settingsTabs: SettingTabOption[] = [
  { key: 'account', label: 'Informacion de la cuenta' },
  { key: 'mfa', label: 'MFA y sesiones' },
]

export const settingsMfaSetupSteps: string[] = [
  '1. Instala Google Authenticator, Microsoft Authenticator o Authy.',
  '2. Escanea el QR de configuracion de 2FA.',
  '3. Ingresa el codigo de 6 digitos para confirmar setup.',
]

export const initialSettingsDevices: SettingDeviceSession[] = [
  {
    id: 'device-1',
    name: 'MacBook Pro - Chrome',
    location: 'Santiago, CL',
    lastSeen: 'Ahora',
    current: true,
  },
  {
    id: 'device-2',
    name: 'iPhone 15 - Safari',
    location: 'Santiago, CL',
    lastSeen: 'Hace 2 horas',
    current: false,
  },
  {
    id: 'device-3',
    name: 'Windows 11 - Edge',
    location: 'Valparaiso, CL',
    lastSeen: 'Ayer',
    current: false,
  },
]
