import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_LOGIN, AUTH_ROUTE_VERIFY_EMAIL } from '@/constant'
import { initialForgotPasswordForm } from '@/factories'
import { mapperForgotPasswordPayload } from '@/mappers'
import { useStoreAuthFlow, useStoreTheme } from '@/store'

export default function RecoveryPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const forgotPasswordSubmitting = useStoreAuthFlow((s) => s.forgotPasswordSubmitting)
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const successMessage = useStoreAuthFlow((s) => s.successMessage)
  const forgotPassword = useStoreAuthFlow((s) => s.forgotPassword)
  const setPendingVerifyEmail = useStoreAuthFlow((s) => s.setPendingVerifyEmail)

  const [form, setForm] = useState({ ...initialForgotPasswordForm })
  const handleEmailChange = (value: string) => {
    setForm((prev) => ({ ...prev, email: value }))
  }

  useEffect(() => {
    useStoreAuthFlow.setState({ errorMessage: null, successMessage: null })
    return () => { useStoreAuthFlow.setState({ errorMessage: null, successMessage: null }) }
  }, [])

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) {
      useStoreAuthFlow.setState({ errorMessage: 'Debes ingresar tu correo.' })
      return
    }

    const payload = mapperForgotPasswordPayload(form)
    const success = await forgotPassword(payload)
    if (success) {
      setPendingVerifyEmail(payload.email)
      navigate(AUTH_ROUTE_VERIFY_EMAIL)
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
            onClick={() => { useStoreAuthFlow.setState({ errorMessage: null, successMessage: null }); navigate(AUTH_ROUTE_LOGIN) }}
          >
            <span aria-hidden="true">←</span>
            VOLVER AL LOGIN
          </button>

          <header className="mt-5">
            <h1 className="display mt-4 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
              Recuperar
              <span className="display-it text-slate-500 dark:text-slate-400"> tu contraseña</span>
            </h1>
            <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Ingresa tu correo y te enviaremos un código para restablecer tu acceso.
            </p>
          </header>

          <form className="mt-10 space-y-6" onSubmit={submitForm}>
            <InputComponent
              value={form.email}
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              placeholder="Ingresa tu correo"
              onValueChange={handleEmailChange}
              required
            />

            <ButtonComponent type="submit" variant="solid" disabled={forgotPasswordSubmitting} className="w-full">
              {forgotPasswordSubmitting ? 'Enviando...' : 'Enviar código'}
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
    </main>
  )
}
