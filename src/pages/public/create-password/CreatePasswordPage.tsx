import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  CreatePasswordRequirementsComponent,
  PasswordInputComponent,
  PublicAuthBackButtonComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
} from '@/components'
import { AUTH_ROUTE_LOGIN, CREATE_PASSWORD_TOKEN_MAX_AGE_MS } from '@/constant'
import { initialCreatePasswordForm } from '@/factories'
import { usePasswordTokenCountdown } from '@/hooks'
import {
  mapperCreatePasswordPayload,
  mapperCreatePasswordSubmitError,
  mapperCreatePasswordValidation,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuthFlow } from '@/store'

export default function CreatePasswordPage() {
  const navigate = useNavigate()
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
    maxAgeMs: CREATE_PASSWORD_TOKEN_MAX_AGE_MS,
    onMissingToken: () => {
      useStoreAuthFlow.setState({ errorMessage: messages.auth.status.errors.createPasswordMissingToken })
      redirectToLogin()
    },
    onExpired: () => {
      useStoreAuthFlow.setState({ errorMessage: messages.auth.status.errors.createPasswordTokenExpired })
      redirectToLogin()
    },
  })

  const {
    passwordRequirements,
    missingPasswordRequirements,
    passwordsMatch,
    isValidForm,
  } = mapperCreatePasswordValidation(form, Boolean(pendingPasswordToken))

  const submitForm = async (event: React.FormEvent) => {
    
    event.preventDefault()
    if (!isValidForm) {
      useStoreAuthFlow.setState({
        errorMessage: mapperCreatePasswordSubmitError(missingPasswordRequirements, passwordsMatch),
      })
      return
    }

    const payload = mapperCreatePasswordPayload(pendingPasswordToken ?? '', form)
    const success = await createPassword(payload)
    if (success) {
      clearTimers()
      useStoreAuthFlow.getState().reset()
      navigate(AUTH_ROUTE_LOGIN)
    }
  }

  return (
    <PublicAuthLayoutComponent cardClassName="max-w-md">
      <PublicAuthBackButtonComponent label="VOLVER AL LOGIN" onClick={() => navigate(AUTH_ROUTE_LOGIN)} />

      <PublicAuthHeaderComponent
        title="Crea tu"
        accentTitle="contraseña"
        description={`Tiempo restante: ${remainingSeconds}s`}
      />

      <CreatePasswordRequirementsComponent requirements={passwordRequirements} />

      <form className="mt-7 space-y-4" onSubmit={submitForm}>
        <PasswordInputComponent
          value={form.password}
          label="Nueva contraseña"
          autocomplete="new-password"
          onValueChange={(password) => setForm((prev) => ({ ...prev, password }))}
          required
        />

        <PasswordInputComponent
          value={form.confirmPassword}
          label="Confirmar contraseña"
          autocomplete="new-password"
          onValueChange={(confirmPassword) => setForm((prev) => ({ ...prev, confirmPassword }))}
          required
        />

        {form.confirmPassword && !passwordsMatch && (
          <p className="text-xs text-rose-400">{messages.auth.status.errors.createPasswordMismatchInline}</p>
        )}

        <ButtonComponent type="submit" variant="solid" disabled={createPasswordSubmitting} className="w-full">
          {createPasswordSubmitting ? 'Guardando...' : 'Crear contraseña'}
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
    </PublicAuthLayoutComponent>
  )
}
