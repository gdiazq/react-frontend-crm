import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  PublicAuthBackButtonComponent,
  PublicAuthDividerComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
} from '@/components'
import { AUTH_ROUTE_HOME, AUTH_ROUTE_LOGIN, AUTH_ROUTE_VERIFY_EMAIL } from '@/constant'
import { initialRegisterForm } from '@/factories'
import { useDebounce, useFormValidation } from '@/hooks'
import { mapperRegisterPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuthFlow } from '@/store'
import { registerValidationRules } from '@/validators'

export default function RegisterPage() {
  const navigate = useNavigate()
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const registerSubmitting = useStoreAuthFlow((s) => s.registerSubmitting)
  const checkEmailSubmitting = useStoreAuthFlow((s) => s.checkEmailSubmitting)
  const emailAvailable = useStoreAuthFlow((s) => s.emailAvailable)
  const register = useStoreAuthFlow((s) => s.register)
  const checkEmailAvailability = useStoreAuthFlow((s) => s.checkEmailAvailability)
  const setPendingVerifyEmail = useStoreAuthFlow((s) => s.setPendingVerifyEmail)

  const [form, setForm] = useState({ ...initialRegisterForm })
  const { errors, isValid, validateField, validateAll, setFieldError } = useFormValidation(form, registerValidationRules)
  const canSubmit = isValid && emailAvailable !== false && !checkEmailSubmitting

  const handleFormFieldChange = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const debouncedCheckEmail = useDebounce(async (email: string) => {
    const available = await checkEmailAvailability(email)
    if (available === false) setFieldError('email', messages.auth.status.errors.registerEmailTaken)
  }, 350)

  const handleEmailValue = (value: string) => {
    const email = value.trim()
    setForm((prev) => ({ ...prev, email }))
    setFieldError('email', null)
    useStoreAuthFlow.setState({ errorMessage: null, emailAvailable: null })
    if (!validateField('email')) return
    debouncedCheckEmail(email)
  }

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateAll()) return

    const available = await checkEmailAvailability(form.email.trim())
    if (available === false) {
      setFieldError('email', messages.auth.status.errors.registerEmailTaken)
      return
    }
    if (available === null) {
      useStoreAuthFlow.setState({ errorMessage: messages.auth.status.errors.registerValidateEmailError })
      return
    }

    const payload = mapperRegisterPayload(form)
    const success = await register(payload)
    if (success) {
      setPendingVerifyEmail(payload.email)
      navigate(AUTH_ROUTE_VERIFY_EMAIL)
    }
  }

  return (
    <PublicAuthLayoutComponent cardClassName="px-8 py-10 sm:px-10 sm:py-12">
      <PublicAuthBackButtonComponent
        label="VOLVER AL INICIO"
        variant="badge"
        onClick={() => navigate(AUTH_ROUTE_HOME)}
      />

      <PublicAuthHeaderComponent
        title="Crea tu"
        accentTitle="cuenta"
        titleClassName=""
        description="Registra tus datos para crear el acceso al CRM. Luego validaremos tu correo para activar la cuenta."
      />

      <form className="mt-10 space-y-6" onSubmit={submitForm}>
        <div className="space-y-4">
          <InputComponent
            value={form.username}
            label="Usuario"
            type="text"
            autoComplete="username"
            placeholder="Ingresa tu usuario"
            error={errors.username}
            onValueChange={handleFormFieldChange('username')}
            required
          />
          <InputComponent
            value={form.firstName}
            label="Nombre"
            type="text"
            autoComplete="given-name"
            placeholder="Ingresa tu nombre"
            error={errors.firstName}
            onValueChange={handleFormFieldChange('firstName')}
            required
          />
          <InputComponent
            value={form.lastName}
            label="Apellido"
            type="text"
            autoComplete="family-name"
            placeholder="Ingresa tu apellido"
            error={errors.lastName}
            onValueChange={handleFormFieldChange('lastName')}
            required
          />
          <InputComponent
            value={form.email}
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="Ingresa tu correo"
            error={errors.email}
            onValueChange={handleEmailValue}
            required
          />
          <InputComponent
            value={form.phoneNumber}
            label="Teléfono"
            type="tel"
            autoComplete="tel"
            placeholder="Ingresa tu teléfono"
            error={errors.phoneNumber}
            onValueChange={handleFormFieldChange('phoneNumber')}
            required
          />
        </div>

        <ButtonComponent type="submit" variant="solid" disabled={registerSubmitting || checkEmailSubmitting || !canSubmit} className="w-full">
          {registerSubmitting ? 'Registrando...' : 'Registrar cuenta'}
        </ButtonComponent>

        <PublicAuthDividerComponent label="¿ya tienes cuenta?" />

        <button
          type="button"
          className="num block w-full text-center text-[11px] uppercase tracking-[0.16em] accent-text transition hover:opacity-80"
          onClick={() => navigate(AUTH_ROUTE_LOGIN)}
        >
          Inicia sesión aquí →
        </button>
      </form>

      {checkEmailSubmitting && (
        <AlertMessageComponent
          message={messages.auth.ui.registerValidatingEmail}
          tone="info"
          className="mt-3"
        />
      )}
      {!checkEmailSubmitting && emailAvailable === false && (
        <AlertMessageComponent
          message={messages.auth.status.errors.registerEmailTaken}
          tone="error"
          className="mt-3"
          onClose={() => useStoreAuthFlow.setState({ emailAvailable: null })}
        />
      )}
      {!checkEmailSubmitting && emailAvailable !== false && errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          className="mt-3"
          onClose={() => useStoreAuthFlow.setState({ errorMessage: null })}
        />
      )}
    </PublicAuthLayoutComponent>
  )
}
