import { ButtonComponent } from '@/components/ui/button/ButtonComponent'

interface HeroContentProps {
  onGoRegister: () => void
  onGoDashboard: () => void
}

export function HeroContent({ onGoRegister, onGoDashboard }: HeroContentProps) {
  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
        Plataforma RRHH y proyectos
      </div>

      <h1 className="display mt-6 max-w-4xl text-balance text-[48px] leading-[0.9] tracking-tight text-slate-950 dark:text-slate-50 sm:text-[72px] lg:text-[86px]">
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

      <div className="mt-8 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        <span className="r-full border border-slate-200 bg-white/75 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">RRHH</span>
        <span className="r-full border border-slate-200 bg-white/75 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">Contratos</span>
        <span className="r-full border border-slate-200 bg-white/75 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">Proyectos</span>
        <span className="r-full border border-slate-200 bg-white/75 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">Permisos</span>
      </div>
    </div>
  )
}
