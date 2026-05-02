import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, CheckboxComponent, FooterComponent, GitHubLoginButtonComponent, InputComponent, ThemeToggle } from '@/components'
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.08),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.06),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.08),_transparent_40%)]" />

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <section className="r-xl soft-ring w-full max-w-lg border border-slate-200/80 bg-white/95 px-10 py-12 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-30px_rgba(15,23,42,0.15)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <button
            type="button"
            className="num inline-flex items-center gap-2 r-full border border-[color:var(--accent-500)]/20 accent-bg-soft px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] accent-text shadow-sm transition hover:-translate-y-0.5 hover:border-[color:var(--accent-500)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-[color:var(--accent-400)]/25 dark:focus-visible:ring-offset-slate-950"
            onClick={() => navigate(AUTH_ROUTE_HOME)}
          >
            <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center r-full bg-white/70 text-[12px] dark:bg-slate-950/40">←</span>
            VOLVER AL INICIO
          </button>

          <header className="mt-5">
            <h1 className="display mt-4 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
              Hola,
              <span className="display-it text-slate-500 dark:text-slate-400"> inicia sesión</span>
            </h1>
            <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Ingresa tu correo para continuar con tu sesión.
            </p>
          </header>

          <form className="mt-10 space-y-6" onSubmit={submitForm}>
            <InputComponent
              value={form.email}
              label="Correo electrónico"
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

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="num bg-white px-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                  o continúa con
                </span>
              </div>
            </div>

            <GitHubLoginButtonComponent
              loading={githubOAuthSubmitting}
              onClick={handleGithubLogin}
              label="Continuar con GitHub"
              loadingLabel="Conectando con GitHub..."
            />

            <div className="flex flex-col gap-3 pt-2 text-[12.5px] sm:flex-row sm:items-center sm:justify-between">
              <CheckboxComponent
                label="Recordarme en este equipo"
                checked={remindMe}
                onCheckedChange={setRemindMe}
              />
              <button
                type="button"
                className="num text-[11px] uppercase tracking-[0.16em] accent-text transition hover:opacity-80"
                onClick={() => navigate(AUTH_ROUTE_RECOVERY)}
              >
                ¿Olvidaste tu contraseña? →
              </button>
            </div>

            {loginError && (
              <AlertMessageComponent
                message={errorMessage}
                tone="error"
                onClose={resetStatus}
              />
            )}

            {githubOAuthError && (
              <AlertMessageComponent
                message={githubOAuthError}
                tone="error"
                onClose={clearGithubOAuthStatus}
              />
            )}
          </form>
        </section>
      </section>

      <FooterComponent />
    </main>
  )
}
