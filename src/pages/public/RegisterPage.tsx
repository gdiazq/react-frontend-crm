import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_HOME, AUTH_ROUTE_VERIFY_EMAIL } from '@/constant'
import { initialRegisterForm } from '@/factories'
import { registerValidationRules } from '@/validators'
import { useFormValidation } from '@/hooks'
import { mapperRegisterPayload } from '@/mappers'
import { useStoreAuth, useStoreTheme } from '@/store'

export default function RegisterPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const errorMessage = useStoreAuth((s) => s.errorMessage)
  const registerSubmitting = useStoreAuth((s) => s.registerSubmitting)
  const checkEmailSubmitting = useStoreAuth((s) => s.checkEmailSubmitting)
  const emailAvailable = useStoreAuth((s) => s.emailAvailable)
  const register = useStoreAuth((s) => s.register)
  const checkEmailAvailability = useStoreAuth((s) => s.checkEmailAvailability)
  const setPendingVerifyEmail = useStoreAuth((s) => s.setPendingVerifyEmail)

  const [form, setForm] = useState({ ...initialRegisterForm })
  const { errors, isValid, validateField, validateAll, setFieldError } = useFormValidation(form, registerValidationRules)
  const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canSubmit = isValid && emailAvailable !== false && !checkEmailSubmitting

  useEffect(() => {
    return () => {
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
    }
  }, [])

  const handleEmailValue = (value: string) => {
    const email = value.trim()
    setForm((f) => ({ ...f, email }))
    setFieldError('email', null)
    useStoreAuth.setState({ errorMessage: null, emailAvailable: null })

    if (emailTimerRef.current) clearTimeout(emailTimerRef.current)

    const hasError = !validateField('email')
    if (hasError) return

    emailTimerRef.current = setTimeout(async () => {
      const available = await checkEmailAvailability(email)
      if (available === false) {
        setFieldError('email', 'El correo ya esta registrado.')
      }
    }, 350)
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    const available = await checkEmailAvailability(form.email.trim())
    if (available === false) {
      setFieldError('email', 'El correo ya esta registrado.')
      return
    }
    if (available === null) {
      useStoreAuth.setState({ errorMessage: 'No se pudo validar el correo. Intenta nuevamente.' })
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
          <h1 className="mt-4 text-balance text-2xl font-bold">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Registra tu acceso para usar el CRM.</p>

          <form className="mt-7 space-y-4" onSubmit={submitForm}>
            <InputComponent value={form.username} label="Usuario" type="text" autoComplete="username" placeholder="johndoe" error={errors.username} onValueChange={(v) => setForm((f) => ({ ...f, username: v }))} required />
            <InputComponent value={form.firstName} label="Nombre" type="text" autoComplete="given-name" placeholder="John" error={errors.firstName} onValueChange={(v) => setForm((f) => ({ ...f, firstName: v }))} required />
            <InputComponent value={form.lastName} label="Apellido" type="text" autoComplete="family-name" placeholder="Doe" error={errors.lastName} onValueChange={(v) => setForm((f) => ({ ...f, lastName: v }))} required />
            <InputComponent value={form.email} label="Correo" type="email" autoComplete="email" placeholder="Ingresa tu correo" error={errors.email} onValueChange={handleEmailValue} required />
            <InputComponent value={form.phoneNumber} label="Telefono" type="tel" autoComplete="tel" placeholder="+1234567890" error={errors.phoneNumber} onValueChange={(v) => setForm((f) => ({ ...f, phoneNumber: v }))} required />

            <ButtonComponent type="submit" variant="solid" disabled={registerSubmitting || checkEmailSubmitting || !canSubmit} className="w-full">
              {registerSubmitting ? 'Registrando...' : 'Registrar cuenta'}
            </ButtonComponent>
          </form>

          {checkEmailSubmitting && (
            <p className="mt-3 text-sm text-cyan-700 dark:text-cyan-300">Validando disponibilidad del correo...</p>
          )}
          {!checkEmailSubmitting && emailAvailable === false && (
            <p className="mt-3 text-sm text-rose-400">El correo ya esta registrado.</p>
          )}
          {!checkEmailSubmitting && emailAvailable !== false && errorMessage && (
            <p className="mt-3 text-sm text-rose-400">{errorMessage}</p>
          )}
        </section>
      </section>
      <FooterComponent />
    </main>
  )
}
