import type { PasswordRequirement } from '@/types'

interface CreatePasswordRequirementsComponentProps {
  requirements: PasswordRequirement[]
}

export function CreatePasswordRequirementsComponent({ requirements }: CreatePasswordRequirementsComponentProps) {
  return (
    <div className="mt-4 grid gap-1 text-xs">
      {requirements.map((requirement) => (
        <p key={requirement.key} className={requirement.valid ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}>
          {requirement.valid ? '✓' : '•'} {requirement.label}
        </p>
      ))}
    </div>
  )
}
