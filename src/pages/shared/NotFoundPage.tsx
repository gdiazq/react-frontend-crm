import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl border border-cyan-500/25 bg-slate-900/70 p-8 shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Error 404</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">La ruta solicitada no existe</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
            La URL que intentaste abrir no esta disponible o fue movida. Usa una de las acciones para continuar.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Ir al dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Ir al inicio
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
