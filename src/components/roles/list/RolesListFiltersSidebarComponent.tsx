import { useState } from 'react'
import {
  ButtonComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { mapperRoleStatusFilter, mapperRoleStatusSelectOptions } from '@/mappers'
import { useStoreRoles, useStoreSelects } from '@/store'
import type { RoleFilterForm } from '@/types'

interface RolesListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function RolesListFiltersSidebarComponent(props: RolesListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreRoles((s) => s.queryParams)
  const loadingRoles = useStoreRoles((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreRoles((s) => s.operationLoading.toggle)
  const setStatusFilter = useStoreRoles((s) => s.setStatusFilter)
  const clearStatusFilter = useStoreRoles((s) => s.clearStatusFilter)
  const searchRoles = useStoreRoles((s) => s.searchRoles)
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const [filters, setFilters] = useState<RoleFilterForm>(() => ({ statusId: queryParams.status }))

  const statusSelectOptions = mapperRoleStatusSelectOptions(statusOptions)
  const loadingAny = loadingRoles || loadingToggleStatus || loadingStatusOptions

  const handleApply = async () => {
    setStatusFilter(mapperRoleStatusFilter(filters.statusId, statusOptions))
    await searchRoles()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ statusId: '' })
    clearStatusFilter()
    await searchRoles()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent
          value={filters.statusId}
          label="Estado"
          options={statusSelectOptions}
          onValueChange={(value) => setFilters({ statusId: value })}
        />
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingAny ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
