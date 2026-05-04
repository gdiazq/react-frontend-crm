import type { SettingTabKey, SettingTabOption } from '@/types'

interface TabsComponentProps {
  tabs: SettingTabOption[]
  activeTab: SettingTabKey
  onTabChange: (tab: SettingTabKey) => void
}

export function TabsComponent({ tabs, activeTab, onTabChange }: TabsComponentProps) {
  return (
    <div className="r-2xl border border-slate-200 bg-white p-1.5 soft-ring dark:border-white/10 dark:bg-slate-950">
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab, index) => {
          const active = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              className={`r-xl group inline-flex min-h-10 flex-1 items-center justify-center gap-2 px-3 py-2 text-[12.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 sm:flex-none ${
                active
                  ? 'bg-slate-950 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              <span className={`num text-[10px] ${active ? 'text-cyan-200 dark:text-cyan-800' : 'text-slate-400 dark:text-slate-500'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
