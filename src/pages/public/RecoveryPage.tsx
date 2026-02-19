import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_LOGIN, AUTH_ROUTE_VERIFY_EMAIL } from '@/constant'
import { initialForgotPasswordForm } from '@/factories'
import { mapperForgotPasswordPayload } from '@/mappers'
import { useStoreAuth, useStoreTheme } from '@/store'

export default function RecoveryPage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const forgotPasswordSubmitting = useStoreAuth((s) => s.forgotPasswordSubmitting)
  const errorMessage = useStoreAuth((s) => s.errorMessage)
  const successMessage = useStoreAuth((s) => s.successMessage)
  const forgotPassword = useStoreAuth((s) => s.forgotPassword)
  const setPendingVerifyEmail = useStoreAuth((s) => s.setPendingVerifyEmail)

  const [form, setForm] = useState({ ...initialForgotPasswordForm })

  useEffect(() => {
    useStoreAuth.setState({ errorMessage: null, successMessage: null })
    return () => { useStoreAuth.setState({ errorMessage: null, successMessage: null }) }
  }, [])

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) {
      useStoreAuth.setState({ errorMessage: 'Debes ingresar tu correo.' })
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
            onClick={() => { useStoreAuth.setState({ errorMessage: null, successMessage: null }); navigate(AUTH_ROUTE_LOGIN) }}
          >
            <span aria-hidden="true">←</span>
            Volver al login
          </button>

          <h1 className="mt-4 text-balance text-2xl font-bold">Recuperar contrasena</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ingresa tu correo para enviarte un codigo de recuperacion.
          </p>

          <form className="mt-7 space-y-4" onSubmit={submitForm}>
            <InputComponent
              value={form.email}
              label="Correo electronico"
              type="email"
              autoComplete="email"
              placeholder="Ingresa tu correo"
              onValueChange={(v) => setForm((f) => ({ ...f, email: v }))}
              required
            />

            <ButtonComponent type="submit" variant="solid" disabled={forgotPasswordSubmitting} className="w-full">
              {forgotPasswordSubmitting ? 'Enviando...' : 'Enviar codigo'}
            </ButtonComponent>
          </form>

          {errorMessage && <p className="mt-3 text-sm text-rose-400">{errorMessage}</p>}
          {!errorMessage && successMessage && <p className="mt-3 text-sm text-emerald-400">{successMessage}</p>}
        </section>
      </section>

      <FooterComponent />
    </main>
  )
}
