import { ButtonComponent } from '@/components/ui/button/ButtonComponent'

interface HeroContentProps {
  onGoRegister: () => void
  onGoDashboard: () => void
}

export function HeroContent({ onGoRegister, onGoDashboard }: HeroContentProps) {
  return (
    <div>
      <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Gestiona leads, oportunidades y soporte en un solo panel
      </h1>
      <p className="mt-5 max-w-xl text-slate-600 dark:text-slate-300">
        Centraliza tu pipeline comercial, automatiza seguimientos y mejora conversiones con una vista clara de todo el
        ciclo de cliente.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonComponent variant="solid" onClick={onGoRegister}>
          Solicitar demo
        </ButtonComponent>
        <ButtonComponent variant="outline" onClick={onGoDashboard}>
          Ver dashboard
        </ButtonComponent>
      </div>
    </div>
  )
}
