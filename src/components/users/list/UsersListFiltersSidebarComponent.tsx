import { useState } from 'react'
import { ButtonComponent, RightSidebarComponent, SelectComponent } from '@/components'
import {
  mapperUserEmailSelectOptions,
  mapperUserFiltersPayload,
  mapperUserNameSelectOptions,
  mapperUserRoleSelectOptions,
  mapperUserStatusSelectOptions,
} from '@/mappers'
import { useStoreSelects, useStoreUsers } from '@/store'
import type { UsersFilterForm } from '@/types'

interface UsersListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

const initialFilters: UsersFilterForm = {
  userNameId: '',
  userEmailId: '',
  statusId: '',
  roleId: '',
}

export function UsersListFiltersSidebarComponent({ open, onClose }: UsersListFiltersSidebarComponentProps) {
  const loadingUsers = useStoreUsers((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreUsers((s) => s.operationLoading.toggle)
  const setAdvancedFilters = useStoreUsers((s) => s.setAdvancedFilters)
  const clearAdvancedFilters = useStoreUsers((s) => s.clearAdvancedFilters)
  const searchUsers = useStoreUsers((s) => s.searchUsers)

  const roleOptions = useStoreSelects((s) => s.roleOptions)
  const userNameOptions = useStoreSelects((s) => s.userNameOptions)
  const userEmailOptions = useStoreSelects((s) => s.userEmailOptions)
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingUsersFilterOptions = useStoreSelects((s) => s.loadingUsersFilterOptions)

  const [filters, setFilters] = useState<UsersFilterForm>({ ...initialFilters })
  const loadingAny = loadingUsers || loadingToggleStatus || loadingUsersFilterOptions

  const nameSelectOptions = mapperUserNameSelectOptions(userNameOptions)
  const emailSelectOptions = mapperUserEmailSelectOptions(userEmailOptions)
  const statusSelectOptions = mapperUserStatusSelectOptions(statusOptions)
  const roleSelectOptions = mapperUserRoleSelectOptions(roleOptions)

  const handleChangeFilter = (field: keyof UsersFilterForm, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    setAdvancedFilters(mapperUserFiltersPayload(filters, {
      names: userNameOptions,
      emails: userEmailOptions,
      statuses: statusOptions,
      roles: roleOptions,
    }))
    await searchUsers()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ ...initialFilters })
    clearAdvancedFilters()
    await searchUsers()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.userNameId} label="Nombre" options={nameSelectOptions} onValueChange={(value) => handleChangeFilter('userNameId', value)} />
        <SelectComponent value={filters.userEmailId} label="Email" options={emailSelectOptions} onValueChange={(value) => handleChangeFilter('userEmailId', value)} />
        <SelectComponent value={filters.statusId} label="Estado" options={statusSelectOptions} onValueChange={(value) => handleChangeFilter('statusId', value)} />
        <SelectComponent value={filters.roleId} label="Rol" options={roleSelectOptions} onValueChange={(value) => handleChangeFilter('roleId', value)} />
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingAny ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
