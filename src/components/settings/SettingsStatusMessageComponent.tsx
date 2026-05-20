interface SettingsStatusMessageComponentProps {
  message: string
}

export function SettingsStatusMessageComponent({ message }: SettingsStatusMessageComponentProps) {
  if (!message) return null

  return (
    <div className="r-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
      {message}
    </div>
  )
}
