import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, FooterComponent, PasswordInputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_LOGIN } from '@/constant'
import { initialCreatePasswordForm } from '@/factories'
import { usePasswordTokenCountdown } from '@/hooks'
import { mapperCreatePasswordPayload, mapperMissingPasswordRequirements, mapperPasswordRequirements } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuthFlow, useStoreTheme } from '@/store'

const PASSWORD_TOKEN_MAX_AGE_MS = 2 * 60 * 1000

export default function CreatePasswordPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const createPasswordSubmitting = useStoreAuthFlow((s) => s.createPasswordSubmitting)
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const successMessage = useStoreAuthFlow((s) => s.successMessage)
  const pendingPasswordToken = useStoreAuthFlow((s) => s.pendingPasswordToken)
  const pendingPasswordTokenIssuedAt = useStoreAuthFlow((s) => s.pendingPasswordTokenIssuedAt)
  const createPassword = useStoreAuthFlow((s) => s.createPassword)
  const clearPendingPasswordToken = useStoreAuthFlow((s) => s.clearPendingPasswordToken)

  const [form, setForm] = useState({ ...initialCreatePasswordForm })

  const redirectToLogin = () => {
    clearPendingPasswordToken()
    navigate(AUTH_ROUTE_LOGIN)
  }

  const { remainingSeconds, clearTimers } = usePasswordTokenCountdown({
    token: pendingPasswordToken,
    tokenIssuedAt: pendingPasswordTokenIssuedAt,
    maxAgeMs: PASSWORD_TOKEN_MAX_AGE_MS,
    onMissingToken: () => {
      useStoreAuthFlow.setState({ errorMessage: messages.auth.status.errors.createPasswordMissingToken })
      redirectToLogin()
    },
    onExpired: () => {
      useStoreAuthFlow.setState({ errorMessage: messages.auth.status.errors.createPasswordTokenExpired })
      redirectToLogin()
    },
  })

  const passwordRequirements = mapperPasswordRequirements(form.password, 10)
  const missingPasswordRequirements = mapperMissingPasswordRequirements(passwordRequirements)
  const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword
  const isValidForm =
    Boolean(pendingPasswordToken) && missingPasswordRequirements.length === 0 && passwordsMatch

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidForm) {
      const issues = [...missingPasswordRequirements]
      if (!passwordsMatch) issues.push(messages.auth.status.errors.createPasswordConfirmMismatch)
      useStoreAuthFlow.setState({ errorMessage: `${messages.auth.status.errors.createPasswordMissingRequirementsPrefix} ${issues.join(', ')}.` })
      return
    }

    const payload = mapperCreatePasswordPayload(pendingPasswordToken || '', form)
    const success = await createPassword(payload)
    if (success) {
      clearTimers()
      useStoreAuthFlow.getState().reset()
      navigate(AUTH_ROUTE_LOGIN)
    }
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

          <h1 className="mt-4 text-balance text-2xl font-bold">Crea tu contrasena</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Tiempo restante: {remainingSeconds}s
          </p>

          <div className="mt-4 grid gap-1 text-xs">
            {passwordRequirements.map((req) => (
              <p key={req.label} className={req.valid ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}>
                {req.valid ? '✓' : '•'} {req.label}
              </p>
            ))}
          </div>

          <form className="mt-7 space-y-4" onSubmit={submitForm}>
            <PasswordInputComponent
              value={form.password}
              label="Nueva contrasena"
              autocomplete="new-password"
              onValueChange={(v) => setForm((f) => ({ ...f, password: v }))}
              required
            />

            <PasswordInputComponent
              value={form.confirmPassword}
              label="Confirmar contrasena"
              autocomplete="new-password"
              onValueChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))}
              required
            />

            {form.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-rose-400">{messages.auth.status.errors.createPasswordMismatchInline}</p>
            )}

            <ButtonComponent type="submit" variant="solid" disabled={createPasswordSubmitting} className="w-full">
              {createPasswordSubmitting ? 'Guardando...' : 'Crear contrasena'}
            </ButtonComponent>
          </form>

          {errorMessage && (
            <AlertMessageComponent
              message={errorMessage}
              tone="error"
              className="mt-3"
              onClose={() => useStoreAuthFlow.setState({ errorMessage: null })}
            />
          )}
          {!errorMessage && successMessage && (
            <AlertMessageComponent
              message={successMessage}
              tone="success"
              className="mt-3"
              onClose={() => useStoreAuthFlow.setState({ successMessage: null })}
            />
          )}
        </section>
      </section>

      <FooterComponent />
    </main>
  )
}
