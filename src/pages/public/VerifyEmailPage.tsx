import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonComponent, FooterComponent, ResendVerificationModal, ThemeToggle, VerificationCodeInputComponent } from '@/components'
import { AUTH_ROUTE_CREATE_PASSWORD, AUTH_ROUTE_LOGIN } from '@/constant'
import { initialResendVerificationForm, initialVerifyEmailForm } from '@/factories'
import { verifyEmailValidationRules } from '@/validators'
import { useFormValidation } from '@/hooks'
import { mapperResendVerificationPayload, mapperVerifyEmailPayload } from '@/mappers'
import { useStoreAuthFlowFlow, useStoreTheme } from '@/store'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
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

  const [form, setForm] = useState({ ...initialVerifyEmailForm })
  const [resendForm, setResendForm] = useState({ ...initialResendVerificationForm })
  const [showResendModal, setShowResendModal] = useState(false)
  const [resendModalError, setResendModalError] = useState<string | null>(null)
  const { errors, validateAll } = useFormValidation(form, verifyEmailValidationRules)

  useEffect(() => {
    if (!pendingVerifyEmail) {
      useStoreAuthFlow.setState({ errorMessage: 'No se encontro el correo a verificar. Vuelve a registrarte.' })
    }
  }, [])

  const handleResendCode = async () => {
    setResendModalError(null)

    if (!pendingVerifyEmail) {
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

    const payload = mapperResendVerificationPayload(pendingVerifyEmail, resendForm)
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

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pendingVerifyEmail) {
      useStoreAuthFlow.setState({ errorMessage: 'No se encontro el correo a verificar o falta el codigo.' })
      return
    }
    if (!validateAll()) return

    const payload = mapperVerifyEmailPayload(pendingVerifyEmail, form)
    const success = await verifyEmail(payload)
    if (success) navigate(AUTH_ROUTE_CREATE_PASSWORD)
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),_transparent_35%)]" />

      <section className="flex flex-1 items-center justify-center p-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 opacity-90 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-300 dark:focus-visible:ring-offset-slate-950"
            onClick={() => navigate(AUTH_ROUTE_LOGIN)}
          >
            <span aria-hidden="true">←</span>
            Volver al login
          </button>

          <h1 className="mt-4 text-balance text-2xl font-bold">Verifica tu correo</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ingresa el codigo enviado al correo para activar tu cuenta.
          </p>

          <form className="mt-7 space-y-4" onSubmit={submitForm}>
            <VerificationCodeInputComponent
              value={form.code}
              error={errors.code}
              onValueChange={(v) => setForm({ code: v })}
            />

            <button
              type="button"
              className="text-xs font-semibold text-cyan-700 transition hover:text-cyan-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-cyan-300 dark:hover:text-cyan-200"
              disabled={resendSubmitting}
              onClick={() => { setResendForm({ phoneNumber: '' }); setResendModalError(null); setShowResendModal(true) }}
            >
              {resendSubmitting ? 'Reenviando codigo...' : 'Reenviar codigo'}
            </button>

            <ButtonComponent type="submit" variant="solid" disabled={verifySubmitting} className="w-full">
              {verifySubmitting ? 'Verificando...' : 'Verificar correo'}
            </ButtonComponent>
          </form>

          {errorMessage && <p className="mt-3 text-sm text-rose-400">{errorMessage}</p>}
          {!errorMessage && successMessage && <p className="mt-3 text-sm text-emerald-400">{successMessage}</p>}
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
        onPhoneNumberChange={(v) => setResendForm({ phoneNumber: v })}
      />
    </main>
  )
}
