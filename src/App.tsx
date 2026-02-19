import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { CookieConsentBanner } from '@/components'
import { useStoreTheme } from '@/store'

const COOKIE_CONSENT_KEY = 'crm_cookie_consent'

export default function App() {
  const initTheme = useStoreTheme((s) => s.initTheme)
  const [cookieConsentVisible, setCookieConsentVisible] = useState(() => {
    const cookieString = typeof document !== 'undefined' ? document.cookie || '' : ''
    const accepted = cookieString
      .split(';')
      .some((raw) => raw.trim() === `${COOKIE_CONSENT_KEY}=accepted`)
    return !accepted
  })

  useEffect(() => {
    initTheme()
  }, [initTheme])

  const handleAcceptCookieConsent = () => {
    document.cookie = `${COOKIE_CONSENT_KEY}=accepted; Path=/; Max-Age=31536000; SameSite=Lax`
    setCookieConsentVisible(false)
  }

  return (
    <>
      <RouterProvider router={router} />
      <CookieConsentBanner isVisible={cookieConsentVisible} onAccept={handleAcceptCookieConsent} />
    </>
  )
}
