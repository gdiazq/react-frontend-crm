import type { SelectRoleOption } from './selects.interface'

export interface SelectsStore {
  roleOptions: SelectRoleOption[]
  loadingRoleOptions: boolean
  roleOptionsErrorMessage: string | null
  errorBack: unknown | null
  getRoleOptions: () => Promise<void>
  clearRoleOptionsStatus: () => void
}
