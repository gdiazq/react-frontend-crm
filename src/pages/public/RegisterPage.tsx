import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessageComponent, ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_HOME, AUTH_ROUTE_LOGIN, AUTH_ROUTE_VERIFY_EMAIL } from '@/constant'
import { initialRegisterForm } from '@/factories'
import { registerValidationRules } from '@/validators'
import { useDebounce, useFormValidation } from '@/hooks'
import { mapperRegisterPayload } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuthFlow, useStoreTheme } from '@/store'

export default function RegisterPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const registerSubmitting = useStoreAuthFlow((s) => s.registerSubmitting)
  const checkEmailSubmitting = useStoreAuthFlow((s) => s.checkEmailSubmitting)
  const emailAvailable = useStoreAuthFlow((s) => s.emailAvailable)
  const register = useStoreAuthFlow((s) => s.register)
  const checkEmailAvailability = useStoreAuthFlow((s) => s.checkEmailAvailability)
  const setPendingVerifyEmail = useStoreAuthFlow((s) => s.setPendingVerifyEmail)

  const [form, setForm] = useState({ ...initialRegisterForm })
  const { errors, isValid, validateField, validateAll, setFieldError } = useFormValidation(form, registerValidationRules)
  const handleFormFieldChange = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSubmit = isValid && emailAvailable !== false && !checkEmailSubmitting

  const debouncedCheckEmail = useDebounce(async (email: string) => {
    const available = await checkEmailAvailability(email)
    if (available === false) {
      setFieldError('email', messages.auth.status.errors.registerEmailTaken)
    }
  }, 350)

  const handleEmailValue = (value: string) => {
    const email = value.trim()
    setForm((f) => ({ ...f, email }))
    setFieldError('email', null)
    useStoreAuthFlow.setState({ errorMessage: null, emailAvailable: null })
    if (!validateField('email')) return
    debouncedCheckEmail(email)
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.08),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.06),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.08),_transparent_40%)]" />

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <section className="r-xl soft-ring w-full max-w-lg border border-slate-200/80 bg-white/95 px-8 py-10 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-30px_rgba(15,23,42,0.15)] backdrop-blur-sm sm:px-10 sm:py-12 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <button
            type="button"
            className="num inline-flex items-center gap-2 r-full border border-[color:var(--accent-500)]/20 accent-bg-soft px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] accent-text shadow-sm transition hover:-translate-y-0.5 hover:border-[color:var(--accent-500)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-[color:var(--accent-400)]/25 dark:focus-visible:ring-offset-slate-950"
            onClick={() => navigate(AUTH_ROUTE_HOME)}
          >
            <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center r-full bg-white/70 text-[12px] dark:bg-slate-950/40">←</span>
            VOLVER AL INICIO
          </button>

          <header className="mt-5">
            <h1 className="display text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
              Crea tu
              <span className="display-it text-slate-500 dark:text-slate-400"> cuenta</span>
            </h1>
            <p className="mt-3 max-w-xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Registra tus datos para crear el acceso al CRM. Luego validaremos tu correo para activar la cuenta.
            </p>
          </header>

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

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="num bg-white px-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                  ¿ya tienes cuenta?
                </span>
              </div>
            </div>

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
        </section>
      </section>
      <FooterComponent />
    </main>
  )
}
