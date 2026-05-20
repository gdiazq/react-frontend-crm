import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  PasswordInputComponent,
  PublicAuthBackButtonComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
} from '@/components'
import { AUTH_ROUTE_DASHBOARD, AUTH_ROUTE_LOGIN, AUTH_ROUTE_RECOVERY } from '@/constant'
import { initialLoginCredentialsForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { useStoreAuth, useStoreLoginCredentials } from '@/store'
import { loginCredentialsValidationRules } from '@/validators'

export default function LoginCredentialsPage() {
  const navigate = useNavigate()
  const mfaRequired = useStoreLoginCredentials((s) => s.mfaRequired)
  const loginError = useStoreAuth((s) => s.loginError)
  const loginSubmitting = useStoreAuth((s) => s.loginSubmitting)
  const messageAlert = useStoreAuth((s) => s.messageAlert)
  const submitLogin = useStoreLoginCredentials((s) => s.submitLogin)
  const clearSession = useStoreLoginCredentials((s) => s.clearSession)
  const hydrate = useStoreLoginCredentials((s) => s.hydrate)

  const [form, setForm] = useState({ ...initialLoginCredentialsForm })
  const { errors, validateField } = useFormValidation(form, loginCredentialsValidationRules)

  useEffect(() => {
    const hasSession = hydrate()
    if (!hasSession) navigate(AUTH_ROUTE_LOGIN)
  }, [hydrate, navigate])

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }))
  }

  const handleTotpCodeChange = (value: string) => {
    setForm((prev) => ({ ...prev, totpCode: value.replace(/\s+/g, '') }))
  }

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateField('password')) return
    if (mfaRequired && !form.totpCode.trim()) return

    const success = await submitLogin(form)
    if (success) navigate(AUTH_ROUTE_DASHBOARD)
  }

  return (
    <PublicAuthLayoutComponent>
      <PublicAuthBackButtonComponent
        label="VOLVER AL LOGIN"
        onClick={() => { clearSession(); navigate(AUTH_ROUTE_LOGIN) }}
      />

      <PublicAuthHeaderComponent
        title="Confirma"
        accentTitle="tu identidad"
        description={`Ingresa tu contraseña ${mfaRequired ? 'y el código MFA ' : ''}para acceder a tu sesión.`}
      />

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
    </PublicAuthLayoutComponent>
  )
}
