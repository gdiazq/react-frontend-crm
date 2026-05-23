import { create } from 'zustand'
import {
  mapperSelectActiveInactiveOptions,
  mapperSelectCompanyRepresentativeOptions,
  mapperSelectEmployeeStatusOptions,
  mapperSelectPermissionOptions,
  mapperSelectProjectTypeOptions,
  mapperSelectProjectSpecialtyOptions,
  mapperSelectProjectStatusOptions,
  mapperSelectRoleOptions,
  mapperSelectStatusOptions,
  mapperSelectSupervisorOptions,
  mapperSelectUserEmailOptions,
  mapperSelectUserNameOptions,
  mapperSelectVisitorOptions,
} from '@/mappers'
import messages from '@/messages/messages'
import { selectsService } from '@/services'
import type { SelectsStore } from '@/types'

let inflightPermissionOptions: Promise<void> | null = null

export const useStoreSelects = create<SelectsStore>()((set) => ({
  roleOptions: [],
  permissionOptions: [],
  projectTypeOptions: [],
  projectSpecialtyOptions: [],
  projectStatusOptions: [],
  userNameOptions: [],
  userEmailOptions: [],
  statusOptions: [],
  employeeStatusOptions: [],
  projectActiveInactiveOptions: [],
  loadingRoleOptions: false,
  loadingPermissionOptions: false,
  loadingStatusOptions: false,
  loadingEmployeeStatusOptions: false,
  loadingProjectActiveInactiveOptions: false,
  loadingUsersFilterOptions: false,
  loadingProjectTypeOptions: false,
  loadingProjectSpecialtyOptions: false,
  loadingProjectStatusOptions: false,
  visitorOptions: [],
  supervisorOptions: [],
  companyRepresentativeOptions: [],
  loadingVisitorOptions: false,
  loadingSupervisorOptions: false,
  loadingCompanyRepresentativeOptions: false,
  visitorOptionsErrorMessage: null,
  supervisorOptionsErrorMessage: null,
  companyRepresentativeOptionsErrorMessage: null,
  roleOptionsErrorMessage: null,
  permissionOptionsErrorMessage: null,
  statusOptionsErrorMessage: null,
  employeeStatusOptionsErrorMessage: null,
  projectActiveInactiveOptionsErrorMessage: null,
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
    if (inflightPermissionOptions) return inflightPermissionOptions

    inflightPermissionOptions = (async () => {
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
        inflightPermissionOptions = null
      }
    })()

    return inflightPermissionOptions
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

  getEmployeeStatusOptions: async () => {
    try {
      set({
        loadingEmployeeStatusOptions: true,
        employeeStatusOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getEmployeeStatusOptions()
      set({ employeeStatusOptions: mapperSelectEmployeeStatusOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          employeeStatusOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadStatusError,
          errorBack: error,
        })
      } else {
        set({
          employeeStatusOptionsErrorMessage: messages.selects.status.errors.loadStatusError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingEmployeeStatusOptions: false })
    }
  },

  clearEmployeeStatusOptionsStatus: () => {
    set({ employeeStatusOptionsErrorMessage: null })
  },

  getProjectActiveInactiveOptions: async () => {
    try {
      set({
        loadingProjectActiveInactiveOptions: true,
        projectActiveInactiveOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getProjectActiveInactiveOptions()
      set({ projectActiveInactiveOptions: mapperSelectActiveInactiveOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          projectActiveInactiveOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadActiveInactiveError,
          errorBack: error,
        })
      } else {
        set({
          projectActiveInactiveOptionsErrorMessage: messages.selects.status.errors.loadActiveInactiveError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingProjectActiveInactiveOptions: false })
    }
  },

  clearProjectActiveInactiveOptionsStatus: () => {
    set({ projectActiveInactiveOptionsErrorMessage: null })
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

  getVisitorOptions: async () => {
    try {
      set({
        loadingVisitorOptions: true,
        visitorOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getVisitorOptions()
      set({ visitorOptions: mapperSelectVisitorOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          visitorOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadVisitorsError,
          errorBack: error,
        })
      } else {
        set({
          visitorOptionsErrorMessage: messages.selects.status.errors.loadVisitorsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingVisitorOptions: false })
    }
  },

  clearVisitorOptionsStatus: () => {
    set({ visitorOptionsErrorMessage: null })
  },

  getSupervisorOptions: async () => {
    try {
      set({
        loadingSupervisorOptions: true,
        supervisorOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getSupervisorOptions()
      set({ supervisorOptions: mapperSelectSupervisorOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          supervisorOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadSupervisorsError,
          errorBack: error,
        })
      } else {
        set({
          supervisorOptionsErrorMessage: messages.selects.status.errors.loadSupervisorsError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingSupervisorOptions: false })
    }
  },

  clearSupervisorOptionsStatus: () => {
    set({ supervisorOptionsErrorMessage: null })
  },

  getCompanyRepresentativeOptions: async () => {
    try {
      set({
        loadingCompanyRepresentativeOptions: true,
        companyRepresentativeOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getCompanyRepresentativeOptions()
      set({ companyRepresentativeOptions: mapperSelectCompanyRepresentativeOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          companyRepresentativeOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadCompanyRepresentativesError,
          errorBack: error,
        })
      } else {
        set({
          companyRepresentativeOptionsErrorMessage: messages.selects.status.errors.loadCompanyRepresentativesError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingCompanyRepresentativeOptions: false })
    }
  },

  clearCompanyRepresentativeOptionsStatus: () => {
    set({ companyRepresentativeOptionsErrorMessage: null })
  },
}))
