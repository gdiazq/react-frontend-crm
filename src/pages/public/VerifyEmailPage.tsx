import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, FooterComponent, ResendVerificationModal, ThemeToggle, VerificationCodeInputComponent } from '@/components'
import { AUTH_ROUTE_CREATE_PASSWORD, AUTH_ROUTE_LOGIN } from '@/constant'
import { initialResendVerificationForm, initialVerifyEmailForm } from '@/factories'
import { verifyEmailValidationRules } from '@/validators'
import { useFormValidation } from '@/hooks'
import { mapperResendVerificationPayload, mapperVerifyEmailPayload } from '@/mappers'
import { useStoreAuthFlow, useStoreTheme } from '@/store'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const verifySubmitting = useStoreAuthFlow((s) => s.verifySubmitting)
  const resendSubmitting = useStoreAuthFlow((s) => s.resendSubmitting)
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const successMessage = useStoreAuthFlow((s) => s.successMessage)
  const pendingVerifyEmail = useStoreAuthFlow((s) => s.pendingVerifyEmail)
  const pendingVerifyPhone = useStoreAuthFlow((s) => s.pendingVerifyPhone)
  const verifyEmail = useStoreAuthFlow((s) => s.verifyEmail)
  const resendVerification = useStoreAuthFlow((s) => s.resendVerification)
  const setPendingVerifyEmail = useStoreAuthFlow((s) => s.setPendingVerifyEmail)

  const queryEmail = (searchParams.get('email') ?? '').trim()
  const queryCode = (searchParams.get('code') ?? '').trim()
  const verifyTargetEmail = (queryEmail || pendingVerifyEmail || '').trim()
  const verifiedRef = useRef(false)

  const [form, setForm] = useState(() => ({ ...initialVerifyEmailForm, code: queryCode }))
  const [resendForm, setResendForm] = useState({ ...initialResendVerificationForm })
  const [showResendModal, setShowResendModal] = useState(false)
  const [resendModalError, setResendModalError] = useState<string | null>(null)
  const { errors, validateAll } = useFormValidation(form, verifyEmailValidationRules)
  const handleVerificationCodeChange = (value: string) => {
    setForm({ code: value })
  }
  const handleResendPhoneNumberChange = (value: string) => {
    setResendForm({ phoneNumber: value })
  }

  useEffect(() => {
    if (queryEmail) {
      setPendingVerifyEmail(queryEmail)
      useStoreAuthFlow.setState({ errorMessage: null })
    }
  }, [queryEmail, setPendingVerifyEmail])

  useEffect(() => {
    if (!verifyTargetEmail && !verifiedRef.current) {
      useStoreAuthFlow.setState({ errorMessage: 'No se encontro el correo a verificar. Vuelve a registrarte.' })
    }
  }, [verifyTargetEmail])

  const handleResendCode = async () => {
    setResendModalError(null)

    if (!verifyTargetEmail) {
      setResendModalError('No se encontro el correo para reenviar el codigo.')
      return
    }
    if (!pendingVerifyPhone) {
      setResendModalError('No se encontro el telefono de verificacion. Vuelve a registrarte.')
      return
    }
    if (!resendForm.phoneNumber.trim()) {
      setResendModalError('Debes ingresar tu numero de telefono para reenviar el codigo.')
      return
    }

    const inputPhone = resendForm.phoneNumber.replace(/\s+/g, '')
    const expectedPhone = pendingVerifyPhone.replace(/\s+/g, '')
    if (inputPhone !== expectedPhone) {
      setResendModalError('El numero de telefono no coincide con el registrado.')
      return
    }

    const payload = mapperResendVerificationPayload(verifyTargetEmail, resendForm)
    const success = await resendVerification(payload)
    if (success) {
      setForm({ code: '' })
      setResendForm({ phoneNumber: '' })
      setShowResendModal(false)
      return
    }

    setResendModalError(useStoreAuthFlow.getState().errorMessage || 'No se pudo reenviar el codigo.')
    useStoreAuthFlow.setState({ errorMessage: null })
  }

  const submitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!verifyTargetEmail) {
      useStoreAuthFlow.setState({ errorMessage: 'No se encontro el correo a verificar o falta el codigo.' })
      return
    }
    if (!validateAll()) return

    const payload = mapperVerifyEmailPayload(verifyTargetEmail, form)
    const success = await verifyEmail(payload)
    if (success) {
      verifiedRef.current = true
      useStoreAuthFlow.setState({ errorMessage: null })
      navigate(AUTH_ROUTE_CREATE_PASSWORD)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.08),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.06),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.08),_transparent_40%)]" />

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <section className="r-xl soft-ring w-full max-w-lg border border-slate-200/80 bg-white/95 px-10 py-12 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-30px_rgba(15,23,42,0.15)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <button
            type="button"
            className="num inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:focus-visible:ring-offset-slate-950"
            onClick={() => navigate(AUTH_ROUTE_LOGIN)}
          >
            <span aria-hidden="true">←</span>
            VOLVER AL LOGIN
          </button>

          <header className="mt-5">
            <h1 className="display mt-4 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
              Verifica
              <span className="display-it text-slate-500 dark:text-slate-400"> tu correo</span>
            </h1>
            <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Ingresa el código de 6 dígitos que enviamos
              {verifyTargetEmail ? (
                <>
                  {' '}a <span className="num text-slate-800 dark:text-slate-200">{verifyTargetEmail}</span>
                </>
              ) : ' a tu correo'}
              {' '}para continuar.
            </p>
          </header>

          <form className="mt-10 space-y-6" onSubmit={submitForm}>
            <VerificationCodeInputComponent
              value={form.code}
              error={errors.code}
              onValueChange={handleVerificationCodeChange}
            />

            <div className="flex items-center justify-between">
              <span className="num text-[10.5px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                ¿No lo recibiste?
              </span>
              <button
                type="button"
                className="num text-[11px] uppercase tracking-[0.16em] accent-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={resendSubmitting}
                onClick={() => { setResendForm({ phoneNumber: '' }); setResendModalError(null); setShowResendModal(true) }}
              >
                {resendSubmitting ? 'Reenviando...' : 'Reenviar código →'}
              </button>
            </div>

            <ButtonComponent type="submit" variant="solid" disabled={verifySubmitting} className="w-full">
              {verifySubmitting ? 'Verificando...' : 'Verificar correo'}
            </ButtonComponent>

            {errorMessage && (
              <AlertMessageComponent
                message={errorMessage}
                tone="error"
                onClose={() => useStoreAuthFlow.setState({ errorMessage: null })}
              />
            )}
            {!errorMessage && successMessage && (
              <AlertMessageComponent
                message={successMessage}
                tone="success"
                onClose={() => useStoreAuthFlow.setState({ successMessage: null })}
              />
            )}
          </form>
        </section>
      </section>

      <FooterComponent />

      <ResendVerificationModal
        open={showResendModal}
        phoneNumber={resendForm.phoneNumber}
        submitting={resendSubmitting}
        errorMessage={resendModalError}
        onClose={() => setShowResendModal(false)}
        onConfirm={handleResendCode}
        onPhoneNumberChange={handleResendPhoneNumberChange}
      />
    </main>
  )
}
