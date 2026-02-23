import { create } from 'zustand'
import {
  mapperSelectRoleOptions,
  mapperSelectStatusOptions,
  mapperSelectUserEmailOptions,
  mapperSelectUserNameOptions,
} from '@/mappers'
import messages from '@/messages/messages'
import { selectsService } from '@/services'
import type { SelectsStore } from '@/types'

export const useStoreSelects = create<SelectsStore>()((set) => ({
  roleOptions: [],
  userNameOptions: [],
  userEmailOptions: [],
  statusOptions: [],
  loadingRoleOptions: false,
  loadingUsersFilterOptions: false,
  roleOptionsErrorMessage: null,
  usersFilterOptionsErrorMessage: null,
  errorBack: null,

  getRoleOptions: async () => {
    try {
      set({
        loadingRoleOptions: true,
        roleOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getRoleOptions()
      set({ roleOptions: mapperSelectRoleOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          roleOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadRolesError,
          errorBack: error,
        })
      } else {
        set({
          roleOptionsErrorMessage: messages.selects.status.errors.loadRolesError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingRoleOptions: false })
    }
  },

  clearRoleOptionsStatus: () => {
    set({ roleOptionsErrorMessage: null })
  },

  getUsersFilterOptions: async () => {
    try {
      set({
        loadingUsersFilterOptions: true,
        usersFilterOptionsErrorMessage: null,
        errorBack: null,
      })

      const [names, emails, statuses, roles] = await Promise.all([
        selectsService.getUserNameOptions(),
        selectsService.getUserEmailOptions(),
        selectsService.getStatusOptions(),
        selectsService.getRoleOptions(),
      ])

      set({
        userNameOptions: mapperSelectUserNameOptions(names),
        userEmailOptions: mapperSelectUserEmailOptions(emails),
        statusOptions: mapperSelectStatusOptions(statuses),
        roleOptions: mapperSelectRoleOptions(roles),
      })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          usersFilterOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadUsersFiltersError,
          errorBack: error,
        })
      } else {
        set({
          usersFilterOptionsErrorMessage: messages.selects.status.errors.loadUsersFiltersError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingUsersFilterOptions: false })
    }
  },

  clearUsersFilterOptionsStatus: () => {
    set({ usersFilterOptionsErrorMessage: null })
  },
}))
