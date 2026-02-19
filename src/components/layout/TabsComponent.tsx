import type { SettingTabKey, SettingTabOption } from '@/types'

interface TabsComponentProps {
  tabs: SettingTabOption[]
  activeTab: SettingTabKey
  onTabChange: (tab: SettingTabKey) => void
}

export default function TabsComponent({ tabs, activeTab, onTabChange }: TabsComponentProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900/60">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab.key === activeTab
                ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
