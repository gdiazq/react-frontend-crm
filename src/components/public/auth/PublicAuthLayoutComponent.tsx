import type { ReactNode } from 'react'
import { FooterComponent, ThemeToggle } from '@/components'
import { useStoreTheme } from '@/store'

interface PublicAuthLayoutComponentProps {
  children: ReactNode
  cardClassName?: string
}

export function PublicAuthLayoutComponent(props: PublicAuthLayoutComponentProps) {
  const { children, cardClassName = '' } = props
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.08),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.06),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.08),_transparent_40%)]" />

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <section className={`r-xl soft-ring w-full max-w-lg border border-slate-200/80 bg-white/95 px-10 py-12 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-30px_rgba(15,23,42,0.15)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none ${cardClassName}`}>
          {children}
        </section>
      </section>

      <FooterComponent />
    </main>
  )
}
