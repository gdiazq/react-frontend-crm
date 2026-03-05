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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),_transparent_35%)]" />

      <section className="flex flex-1 items-center justify-center p-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 opacity-90 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-300 dark:focus-visible:ring-offset-slate-950"
            onClick={() => { clearSession(); navigate(AUTH_ROUTE_LOGIN) }}
          >
            <span aria-hidden="true">←</span>
            Volver al login
          </button>

          <div className="mt-4 text-center">
            <h2 className="mt-4 text-balance text-2xl font-bold">Hola, inicia sesion</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Ingresa tu contraseña para continuar</p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={submitForm}>
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
                label="Codigo MFA"
                type="text"
                autoComplete="one-time-code"
                placeholder="123456"
                onValueChange={handleTotpCodeChange}
              />
            )}

            <div className="flex items-center justify-end text-sm">
              <button
                type="button"
                className="font-semibold text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                onClick={() => navigate(AUTH_ROUTE_RECOVERY)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <ButtonComponent type="submit" variant="solid" disabled={loginSubmitting} className="w-full">
              {loginSubmitting ? 'Accediendo...' : 'Iniciar sesion'}
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
