import { useState } from 'react'
import { ButtonComponent, RightSidebarComponent, SelectComponent } from '@/components'
import { useStoreSelects, useStoreUsers } from '@/store'

interface UsersListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
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

  const [filters, setFilters] = useState({ userNameId: '', userEmailId: '', statusId: '', roleId: '' })
  const loadingAny = loadingUsers || loadingToggleStatus || loadingUsersFilterOptions

  const nameSelectOptions = userNameOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const emailSelectOptions = userEmailOptions.map((option) => ({ label: option.email, value: String(option.id) }))
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const roleSelectOptions = roleOptions.map((option) => ({ label: option.name, value: String(option.id) }))

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedNameRaw = userNameOptions.find((option) => String(option.id) === filters.userNameId)?.name.trim() ?? ''
    const selectedName = selectedNameRaw.split(/\s+/)[0]?.toLowerCase() ?? ''
    const selectedEmail = userEmailOptions.find((option) => String(option.id) === filters.userEmailId)?.email ?? ''
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedRoleId = roleOptions.find((option) => String(option.id) === filters.roleId)?.id

    setAdvancedFilters({
      name: selectedName,
      email: selectedEmail,
      status: selectedStatus ? String(selectedStatus.id) : '',
      roleId: selectedRoleId ? String(selectedRoleId) : '',
    })
    await searchUsers()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ userNameId: '', userEmailId: '', statusId: '', roleId: '' })
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
