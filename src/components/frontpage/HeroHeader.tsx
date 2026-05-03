import { ButtonComponent } from '@/components/ui/button/ButtonComponent'

interface HeroHeaderProps {
  onGoRegister: () => void
  onGoLogin: () => void
}

export function HeroHeader({ onGoRegister, onGoLogin }: HeroHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="r-xl grid h-11 w-11 place-items-center bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-cyan-300 dark:text-slate-950">
          <span className="num text-[12px] font-bold tracking-[0.18em]">VS</span>
        </div>
        <p className="num text-[12px] uppercase tracking-[0.22em] text-slate-700 dark:text-slate-200">VELOCITY SUITE</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ButtonComponent variant="outline" className="bg-white/80 backdrop-blur dark:bg-slate-950/60" onClick={onGoRegister}>
          Crear cuenta
        </ButtonComponent>
        <ButtonComponent variant="solid" onClick={onGoLogin}>
          Iniciar sesion
        </ButtonComponent>
      </div>
    </div>
  )
}
