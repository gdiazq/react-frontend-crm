import { useState, useRef, useCallback, useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import QRCode from 'qrcode'
import { useStoreAuth } from '@/store'
import { mapperSettingProfileForm } from '@/mappers'
import type { SettingMfaSetupData, SettingUpdateProfileForm } from '@/types'

interface UseSettingsInitOptions {
  mfaSetupData: SettingMfaSetupData
  currentUsername: string
  getCurrentUser: () => Promise<void>
  loadMfaAndSessions: (email: string) => Promise<void>
  setProfile: Dispatch<SetStateAction<SettingUpdateProfileForm>>
}

const buildOtpAuthUri = (secret: string, username: string) => {
  const issuer = 'CRM'
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(username || 'user')}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(issuer)}`
}

export function useSettingsInit({
  mfaSetupData,
  currentUsername,
  getCurrentUser,
  loadMfaAndSessions,
  setProfile,
}: UseSettingsInitOptions) {
  const [mfaQrImage, setMfaQrImage] = useState('')

  // Latest-ref pattern: buildMfaQrImage is stable but always reads fresh data
  const mfaSetupDataRef = useRef(mfaSetupData)
  mfaSetupDataRef.current = mfaSetupData
  const currentUsernameRef = useRef(currentUsername)
  currentUsernameRef.current = currentUsername

  const buildMfaQrImage = useCallback(async () => {
    const data = mfaSetupDataRef.current
    const username = currentUsernameRef.current
    const value =
      data.otpauthUri ||
      data.qrCodeUrl ||
      (data.secret ? buildOtpAuthUri(data.secret, username) : '')

    if (!value) { setMfaQrImage(''); return }
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
      setMfaQrImage(value); return
    }
    try {
      const dataUrl = await QRCode.toDataURL(value, { width: 220, margin: 1, errorCorrectionLevel: 'M' })
      setMfaQrImage(dataUrl)
    } catch {
      setMfaQrImage('')
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await getCurrentUser()
      const u = useStoreAuth.getState().user
      if (u) setProfile(mapperSettingProfileForm(u))
      await loadMfaAndSessions(u?.email ?? '')
      await buildMfaQrImage()
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { mfaQrImage, buildMfaQrImage }
}
