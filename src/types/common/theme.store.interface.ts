export interface ThemeStore {
  isDark: boolean
  errorBack: Error | null
  initTheme: () => void
  setTheme: (value: boolean) => void
  toggleTheme: () => void
}
