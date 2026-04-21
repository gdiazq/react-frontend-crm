import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, FooterComponent, InputComponent, PasswordInputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_DASHBOARD, AUTH_ROUTE_LOGIN, AUTH_ROUTE_RECOVERY } from '@/constant'
import { initialLoginCredentialsForm } from '@/factories'
import { loginCredentialsValidationRules } from '@/validators'
import { useFormValidation } from '@/hooks'
import { useStoreAuth, useStoreLoginCredentials, useStoreTheme } from '@/store'

export default function LoginCredentialsPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const mfaRequired = useStoreLoginCredentials((s) => s.mfaRequired)
  const loginError = useStoreAuth((s) => s.loginError)
  const loginSubmitting = useStoreAuth((s) => s.loginSubmitting)
  const messageAlert = useStoreAuth((s) => s.messageAlert)
  const submitLogin = useStoreLoginCredentials((s) => s.submitLogin)
  const clearSession = useStoreLoginCredentials((s) => s.clearSession)
  const hydrate = useStoreLoginCredentials((s) => s.hydrate)

  const [form, setForm] = useState({ ...initialLoginCredentialsForm })
  const { errors, validateField } = useFormValidation(form, loginCredentialsValidationRules)
  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }))
  }
  const handleTotpCodeChange = (value: string) => {
    setForm((prev) => ({ ...prev, totpCode: value.replace(/\s+/g, '') }))
  }

  useEffect(() => {
    const hasSession = hydrate()
    if (!hasSession) {
      navigate(AUTH_ROUTE_LOGIN)
    }
  }, [hydrate, navigate])

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateField('password')) return
    if (mfaRequired && !form.totpCode.trim()) return

    const success = await submitLogin(form)
    if (success) navigate(AUTH_ROUTE_DASHBOARD)
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
            onClick={() => { clearSession(); navigate(AUTH_ROUTE_LOGIN) }}
          >
            <span aria-hidden="true">←</span>
            VOLVER AL LOGIN
          </button>

          <header className="mt-5">
            <h1 className="display mt-4 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
              Confirma
              <span className="display-it text-slate-500 dark:text-slate-400"> tu identidad</span>
            </h1>
            <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Ingresa tu contraseña {mfaRequired ? 'y el código MFA ' : ''}para acceder a tu sesión.
            </p>
          </header>

          <form className="mt-10 space-y-6" onSubmit={submitForm}>
            <PasswordInputComponent
              value={form.password}
              label="Contraseña"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              error={errors.password}
              onValueChange={handlePasswordChange}
            />

            {mfaRequired && (
              <InputComponent
                value={form.totpCode}
                label="Código MFA"
                type="text"
                autoComplete="one-time-code"
                placeholder="123456"
                onValueChange={handleTotpCodeChange}
              />
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="num text-[11px] uppercase tracking-[0.16em] accent-text transition hover:opacity-80"
                onClick={() => navigate(AUTH_ROUTE_RECOVERY)}
              >
                ¿Olvidaste tu contraseña? →
              </button>
            </div>

            <ButtonComponent type="submit" variant="solid" disabled={loginSubmitting} className="w-full">
              {loginSubmitting ? 'Accediendo...' : 'Iniciar sesión'}
            </ButtonComponent>

            {loginError && (
              <AlertMessageComponent
                message={messageAlert?.message || 'Usuario o contraseña incorrectos.'}
                tone="error"
                onClose={() => useStoreAuth.setState({ loginError: false })}
              />
            )}
          </form>
        </section>
      </section>

      <FooterComponent />
    </main>
  )
}
