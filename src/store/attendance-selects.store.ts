import { create } from 'zustand'
import messages from '@/messages/messages'
import { attendanceSelectsService } from '@/services'
import type { AttendanceSelectsStore } from '@/types'

export const useStoreAttendanceSelects = create<AttendanceSelectsStore>()((set) => ({
  employeeWithContractOptions: [],
  attendanceEmployeeOptions: [],
  attendanceStatusOptions: [],
  attendanceMarkTypeOptions: [],
  projectCostCenterOptions: [],
  loadingAttendanceFormOptions: false,
  loadingAttendanceEmployeeOptions: false,
  loadingAttendanceMarkTypeOptions: false,
  loadingProjectCostCenterOptions: false,
  attendanceFormOptionsErrorMessage: null,
  attendanceEmployeeOptionsErrorMessage: null,
  attendanceMarkTypeOptionsErrorMessage: null,
  projectCostCenterOptionsErrorMessage: null,
  errorBack: null,

  getAttendanceFormOptions: async () => {
    try {
      set({ loadingAttendanceFormOptions: true, attendanceFormOptionsErrorMessage: null, errorBack: null })
      const [employeesWithContract, attendanceStatuses] = await Promise.all([
        attendanceSelectsService.getEmployeeWithContractOptions(),
        attendanceSelectsService.getAttendanceStatusOptions(),
      ])
      set({
        employeeWithContractOptions: employeesWithContract,
        attendanceStatusOptions: attendanceStatuses,
      })
    } catch (error) {
      if (attendanceSelectsService.isAxiosError(error)) {
        set({
          attendanceFormOptionsErrorMessage: error.response?.data?.message || messages.attendance.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({ attendanceFormOptionsErrorMessage: messages.attendance.status.errors.loadFormOptionsError, errorBack: error })
      }
    } finally {
      set({ loadingAttendanceFormOptions: false })
    }
  },

  clearAttendanceFormOptionsStatus: () => {
    set({ attendanceFormOptionsErrorMessage: null })
  },

  getAttendanceEmployeeOptions: async () => {
    try {
      set({ loadingAttendanceEmployeeOptions: true, attendanceEmployeeOptionsErrorMessage: null, errorBack: null })
      const options = await attendanceSelectsService.getAttendanceEmployeeOptions()
      set({ attendanceEmployeeOptions: options })
    } catch (error) {
      if (attendanceSelectsService.isAxiosError(error)) {
        set({
          attendanceEmployeeOptionsErrorMessage: error.response?.data?.message || messages.attendance.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({ attendanceEmployeeOptionsErrorMessage: messages.attendance.status.errors.loadFormOptionsError, errorBack: error })
      }
    } finally {
      set({ loadingAttendanceEmployeeOptions: false })
    }
  },

  clearAttendanceEmployeeOptionsStatus: () => {
    set({ attendanceEmployeeOptionsErrorMessage: null })
  },

  getAttendanceMarkTypeOptions: async () => {
    try {
      set({ loadingAttendanceMarkTypeOptions: true, attendanceMarkTypeOptionsErrorMessage: null, errorBack: null })
      const options = await attendanceSelectsService.getAttendanceMarkTypeOptions()
      set({ attendanceMarkTypeOptions: options })
    } catch (error) {
      if (attendanceSelectsService.isAxiosError(error)) {
        set({
          attendanceMarkTypeOptionsErrorMessage: error.response?.data?.message || messages.attendance.status.errors.loadMarkTypeOptionsError,
          errorBack: error,
        })
      } else {
        set({ attendanceMarkTypeOptionsErrorMessage: messages.attendance.status.errors.loadMarkTypeOptionsError, errorBack: error })
      }
    } finally {
      set({ loadingAttendanceMarkTypeOptions: false })
    }
  },

  clearAttendanceMarkTypeOptionsStatus: () => {
    set({ attendanceMarkTypeOptionsErrorMessage: null })
  },

  getProjectCostCenterOptions: async () => {
    try {
      set({ loadingProjectCostCenterOptions: true, projectCostCenterOptionsErrorMessage: null, errorBack: null })
      const options = await attendanceSelectsService.getProjectCostCenterOptions()
      set({ projectCostCenterOptions: options })
    } catch (error) {
      if (attendanceSelectsService.isAxiosError(error)) {
        set({
          projectCostCenterOptionsErrorMessage: error.response?.data?.message || messages.attendance.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({ projectCostCenterOptionsErrorMessage: messages.attendance.status.errors.loadFormOptionsError, errorBack: error })
      }
    } finally {
      set({ loadingProjectCostCenterOptions: false })
    }
  },

  getProjectCostCenterOption: async (costCenter: number) => {
    if (!Number.isInteger(costCenter) || costCenter <= 0) return

    try {
      const option = await attendanceSelectsService.getProjectCostCenterOption(costCenter)
      set((state) => {
        if (state.projectCostCenterOptions.some((item) => item.id === option.id)) return state
        return { projectCostCenterOptions: [...state.projectCostCenterOptions, option] }
      })
    } catch (error) {
      set({ errorBack: error })
    }
  },

  clearProjectCostCenterOptionsStatus: () => {
    set({ projectCostCenterOptionsErrorMessage: null })
  },
}))
