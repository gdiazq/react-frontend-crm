export interface SettingUpdateProfileForm {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface SettingUpdateAvatarForm {
  file: File | null
  previewUrl: string
}
