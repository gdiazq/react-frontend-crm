import { create } from 'zustand'
import {
  mapperSelectPermissionOptions,
  mapperSelectProjectTypeOptions,
  mapperSelectProjectSpecialtyOptions,
  mapperSelectProjectStatusOptions,
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
  permissionOptions: [],
  projectTypeOptions: [],
  projectSpecialtyOptions: [],
  projectStatusOptions: [],
  userNameOptions: [],
  userEmailOptions: [],
  statusOptions: [],
  loadingRoleOptions: false,
  loadingPermissionOptions: false,
  loadingStatusOptions: false,
  loadingUsersFilterOptions: false,
  loadingProjectTypeOptions: false,
  loadingProjectSpecialtyOptions: false,
  loadingProjectStatusOptions: false,
  roleOptionsErrorMessage: null,
  permissionOptionsErrorMessage: null,
  statusOptionsErrorMessage: null,
  usersFilterOptionsErrorMessage: null,
  projectTypeOptionsErrorMessage: null,
  projectSpecialtyOptionsErrorMessage: null,
  projectStatusOptionsErrorMessage: null,
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

  getPermissionOptions: async () => {
    try {
      set({
        loadingPermissionOptions: true,
        permissionOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getPermissionOptions()
      set({ permissionOptions: mapperSelectPermissionOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          permissionOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadPermissionsError,
          errorBack: error,
        })
      } else {
        set({
          permissionOptionsErrorMessage: messages.selects.status.errors.loadPermissionsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingPermissionOptions: false })
    }
  },

  clearPermissionOptionsStatus: () => {
    set({ permissionOptionsErrorMessage: null })
  },

  getStatusOptions: async () => {
    try {
      set({
        loadingStatusOptions: true,
        statusOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getStatusOptions()
      set({ statusOptions: mapperSelectStatusOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          statusOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadStatusError,
          errorBack: error,
        })
      } else {
        set({
          statusOptionsErrorMessage: messages.selects.status.errors.loadStatusError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingStatusOptions: false })
    }
  },

  clearStatusOptionsStatus: () => {
    set({ statusOptionsErrorMessage: null })
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

  getProjectTypeOptions: async () => {
    try {
      set({
        loadingProjectTypeOptions: true,
        projectTypeOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getProjectTypeOptions()
      set({ projectTypeOptions: mapperSelectProjectTypeOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          projectTypeOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadProjectTypesError,
          errorBack: error,
        })
      } else {
        set({
          projectTypeOptionsErrorMessage: messages.selects.status.errors.loadProjectTypesError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingProjectTypeOptions: false })
    }
  },

  clearProjectTypeOptionsStatus: () => {
    set({ projectTypeOptionsErrorMessage: null })
  },

  getProjectSpecialtyOptions: async () => {
    try {
      set({
        loadingProjectSpecialtyOptions: true,
        projectSpecialtyOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getProjectSpecialtyOptions()
      set({ projectSpecialtyOptions: mapperSelectProjectSpecialtyOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          projectSpecialtyOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadProjectSpecialtiesError,
          errorBack: error,
        })
      } else {
        set({
          projectSpecialtyOptionsErrorMessage: messages.selects.status.errors.loadProjectSpecialtiesError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingProjectSpecialtyOptions: false })
    }
  },

  clearProjectSpecialtyOptionsStatus: () => {
    set({ projectSpecialtyOptionsErrorMessage: null })
  },

  getProjectStatusOptions: async () => {
    try {
      set({
        loadingProjectStatusOptions: true,
        projectStatusOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getProjectStatusOptions()
      set({ projectStatusOptions: mapperSelectProjectStatusOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          projectStatusOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadProjectStatusesError,
          errorBack: error,
        })
      } else {
        set({
          projectStatusOptionsErrorMessage: messages.selects.status.errors.loadProjectStatusesError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingProjectStatusOptions: false })
    }
  },

  clearProjectStatusOptionsStatus: () => {
    set({ projectStatusOptionsErrorMessage: null })
  },
}))
