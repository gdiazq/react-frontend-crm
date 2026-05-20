import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  CheckboxComponent,
  GitHubLoginButtonComponent,
  InputComponent,
  PublicAuthBackButtonComponent,
  PublicAuthDividerComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
} from '@/components'
import {
  AUTH_ROUTE_HOME,
  AUTH_ROUTE_LOGIN_CREDENTIALS,
  AUTH_ROUTE_RECOVERY,
  REMEMBER_EMAIL_STORAGE_KEY,
} from '@/constant'
import { initialPreLoginForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperPreLoginPayload } from '@/mappers'
import { useStoreAuth, useStorePreLogin } from '@/store'
import { preLoginValidationRules } from '@/validators'

const getRememberedEmail = () => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(REMEMBER_EMAIL_STORAGE_KEY) || ''
}

export default function LoginPage() {
  const navigate = useNavigate()
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

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
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
    <PublicAuthLayoutComponent>
      <PublicAuthBackButtonComponent
        label="VOLVER AL INICIO"
        variant="badge"
        onClick={() => navigate(AUTH_ROUTE_HOME)}
      />

      <PublicAuthHeaderComponent
        title="Hola,"
        accentTitle="inicia sesión"
        description="Ingresa tu correo para continuar con tu sesión."
      />

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

        <PublicAuthDividerComponent label="o continúa con" />

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
    </PublicAuthLayoutComponent>
  )
}
