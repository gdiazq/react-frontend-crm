import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  PublicAuthBackButtonComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
} from '@/components'
import { AUTH_ROUTE_LOGIN, AUTH_ROUTE_VERIFY_EMAIL } from '@/constant'
import { initialForgotPasswordForm } from '@/factories'
import { mapperForgotPasswordPayload } from '@/mappers'
import { useStoreAuthFlow } from '@/store'

export default function RecoveryPage() {
  const navigate = useNavigate()
  const forgotPasswordSubmitting = useStoreAuthFlow((s) => s.forgotPasswordSubmitting)
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const successMessage = useStoreAuthFlow((s) => s.successMessage)
  const forgotPassword = useStoreAuthFlow((s) => s.forgotPassword)
  const setPendingVerifyEmail = useStoreAuthFlow((s) => s.setPendingVerifyEmail)

  const [form, setForm] = useState({ ...initialForgotPasswordForm })

  useEffect(() => {
    useStoreAuthFlow.setState({ errorMessage: null, successMessage: null })
    return () => { useStoreAuthFlow.setState({ errorMessage: null, successMessage: null }) }
  }, [])

  const clearStatus = () => useStoreAuthFlow.setState({ errorMessage: null, successMessage: null })

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
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
    <PublicAuthLayoutComponent>
      <PublicAuthBackButtonComponent
        label="VOLVER AL LOGIN"
        onClick={() => { clearStatus(); navigate(AUTH_ROUTE_LOGIN) }}
      />

      <PublicAuthHeaderComponent
        title="Recuperar"
        accentTitle="tu contraseña"
        description="Ingresa tu correo y te enviaremos un código para restablecer tu acceso."
      />

      <form className="mt-10 space-y-6" onSubmit={submitForm}>
        <InputComponent
          value={form.email}
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="Ingresa tu correo"
          onValueChange={(email) => setForm((prev) => ({ ...prev, email }))}
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
    </PublicAuthLayoutComponent>
  )
}
