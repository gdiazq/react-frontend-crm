import { create } from 'zustand'

const THEME_KEY = 'crm-theme'

interface ThemeStore {
  isDark: boolean
  errorBack: Error | null
  initTheme: () => void
  setTheme: (value: boolean) => void
  toggleTheme: () => void
}

const applyThemeClass = (value: boolean) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', value)
  }
}

export const useStoreTheme = create<ThemeStore>()((set, get) => ({
  isDark: true,
  errorBack: null,

  initTheme: () => {
    try {
      const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
      let isDark = true
      if (storedTheme === 'light') {
        isDark = false
      } else if (typeof window !== 'undefined' && storedTheme !== 'dark') {
        window.localStorage.setItem(THEME_KEY, 'dark')
      }

      applyThemeClass(isDark)
      set({ isDark })
    } catch (error) {
      set({ errorBack: error instanceof Error ? error : new Error('Unknown theme initialization error') })
    }
  },

  setTheme: (value: boolean) => {
    applyThemeClass(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_KEY, value ? 'dark' : 'light')
    }
    set({ isDark: value })
  },

  toggleTheme: () => {
    get().setTheme(!get().isDark)
  },
}))
