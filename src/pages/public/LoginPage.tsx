import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonComponent, FooterComponent, GitHubLoginButtonComponent, InputComponent, ThemeToggle } from '@/components'
import {
  AUTH_ROUTE_HOME,
  AUTH_ROUTE_LOGIN_CREDENTIALS,
  AUTH_ROUTE_RECOVERY,
  REMEMBER_EMAIL_STORAGE_KEY,
} from '@/constant'
import { initialPreLoginForm } from '@/factories'
import { preLoginValidationRules } from '@/validators'
import { useFormValidation } from '@/hooks'
import { mapperPreLoginPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStorePreLogin, useStoreTheme } from '@/store'

const getRememberedEmail = () => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(REMEMBER_EMAIL_STORAGE_KEY) || ''
}

export default function LoginPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const preLoginSubmitting = useStorePreLogin((s) => s.preLoginSubmitting)
  const loginError = useStorePreLogin((s) => s.loginError)
  const errorMessage = useStorePreLogin((s) => s.errorMessage)
  const preLogin = useStorePreLogin((s) => s.preLogin)
  const resetStatus = useStorePreLogin((s) => s.resetStatus)
  const githubOAuthSubmitting = useStoreAuth((s) => s.githubOAuthSubmitting)
  const githubOAuthError = useStoreAuth((s) => s.githubOAuthError)
  const startGithubOAuth = useStoreAuth((s) => s.startGithubOAuth)
  const clearGithubOAuthStatus = useStoreAuth((s) => s.clearGithubOAuthStatus)

  const [form, setForm] = useState(() => ({
    ...initialPreLoginForm,
    email: getRememberedEmail(),
  }))
  const [remindMe, setRemindMe] = useState(() => getRememberedEmail().length > 0)
  const { errors, validateField, onValidation } = useFormValidation(form, preLoginValidationRules)

  useEffect(() => {
    resetStatus()
    clearGithubOAuthStatus()
    return () => {
      resetStatus()
      clearGithubOAuthStatus()
    }
  }, [clearGithubOAuthStatus, resetStatus])

  const handleEmailValue = (value: string) => {
    setForm((f) => ({ ...f, email: value }))
    if (loginError) resetStatus()
  }

  const handleGithubLogin = async () => {
    await startGithubOAuth()
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateField('email')) return

    const payload = mapperPreLoginPayload(form)
    const success = await preLogin(payload.email)
    if (!success) return

    if (remindMe) {
      localStorage.setItem(REMEMBER_EMAIL_STORAGE_KEY, form.email)
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_STORAGE_KEY)
    }

    navigate(AUTH_ROUTE_LOGIN_CREDENTIALS)
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
            onClick={() => navigate(AUTH_ROUTE_HOME)}
          >
            <span aria-hidden="true">←</span>
            Volver al inicio
          </button>

          <div className="mt-4 text-center">
            <h2 className="mt-4 text-balance text-2xl font-bold">Hola, inicia sesion</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Ingresa tu correo para continuar</p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={submitForm}>
            <InputComponent
              value={form.email}
              label="Correo electronico"
              type="text"
              autoComplete="username"
              placeholder="Ingresa tu correo"
              error={errors.email}
              onValueChange={handleEmailValue}
              onBlur={onValidation('email')}
              required
            />

            <ButtonComponent type="submit" variant="solid" disabled={preLoginSubmitting} className="w-full">
              {preLoginSubmitting ? 'Validando...' : 'Continuar'}
            </ButtonComponent>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">o</span>
              </div>
            </div>

            <GitHubLoginButtonComponent
              loading={githubOAuthSubmitting}
              onClick={handleGithubLogin}
              label={messages.auth.ui.loginGithubLabel}
              loadingLabel={messages.auth.ui.loginGithubLoading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remindMe}
                  onChange={(e) => setRemindMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400"
                />
                <span className="text-slate-600 dark:text-slate-300">Recordarme</span>
              </label>
              <button
                type="button"
                className="font-semibold text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                onClick={() => navigate(AUTH_ROUTE_RECOVERY)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {loginError && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200">
                {errorMessage}
              </div>
            )}

            {githubOAuthError && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200">
                {githubOAuthError}
              </div>
            )}
          </form>
        </section>
      </section>

      <FooterComponent />
    </main>
  )
}
