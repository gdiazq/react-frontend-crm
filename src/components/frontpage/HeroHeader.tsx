import { ButtonComponent } from '@/components/ui/button/ButtonComponent'

interface HeroHeaderProps {
  onGoRegister: () => void
  onGoLogin: () => void
}

export function HeroHeader({ onGoRegister, onGoLogin }: HeroHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-cyan-100 p-2 ring-1 ring-cyan-300/70 dark:bg-cyan-400/20 dark:ring-cyan-300/30">
          <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">CRM</span>
        </div>
        <p className="text-sm tracking-wide text-slate-600 dark:text-slate-300">Velocity Suite</p>
      </div>

      <div className="flex items-center gap-2">
        <ButtonComponent variant="outline" onClick={onGoRegister}>
          Registrar
        </ButtonComponent>
        <ButtonComponent variant="outline" onClick={onGoLogin}>
          Iniciar sesion
        </ButtonComponent>
      </div>
    </div>
  )
}
