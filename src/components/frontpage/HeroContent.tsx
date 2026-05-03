import { ButtonComponent } from '@/components/ui/button/ButtonComponent'

interface HeroContentProps {
  onGoRegister: () => void
  onGoDashboard: () => void
}

export function HeroContent({ onGoRegister, onGoDashboard }: HeroContentProps) {
  return (
    <div className="relative">
      <h1 className="display max-w-4xl text-balance text-[48px] leading-[0.9] tracking-tight text-slate-950 dark:text-slate-50 sm:text-[72px] lg:text-[86px]">
        Controla personas,
        <span className="display-it text-slate-500 dark:text-slate-400"> contratos y operaciones</span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
        REG CRM ordena el flujo diario de trabajadores, contratos, anexos, permisos, traspasos, finiquitos, proyectos y accesos en una experiencia unica, clara y auditable.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonComponent variant="solid" className="h-11 px-5" onClick={onGoRegister}>
          Solicitar acceso
        </ButtonComponent>
        <ButtonComponent variant="outline" className="h-11 bg-white/80 px-5" onClick={onGoDashboard}>
          Ver demo visual
        </ButtonComponent>
      </div>
    </div>
  )
}
