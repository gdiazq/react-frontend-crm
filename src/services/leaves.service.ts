import axios from 'axios'
import { axiosInstance } from '@/config'
import {
  mapperCreateLeaveFormData,
  mapperLeavesQueryParams,
  mapperUpdateLeaveFormData,
} from '@/mappers'
import type {
  LeaveCreatePayload,
  LeaveCreateResponse,
  LeaveDetail,
  LeavePagedResponse,
  LeaveUpdatePayload,
  LeaveUpdateResponse,
  LeavesQueryParams,
} from '@/types'

export const leavesService = {
  getLeaves: async (queryParams: LeavesQueryParams) => {
    const { data } = await axiosInstance.get<LeavePagedResponse>('/rrhh/leaves/paged', {
      params: mapperLeavesQueryParams(queryParams),
    })
    return data
  },

  getLeaveDetail: async (leaveId: number) => {
    const { data } = await axiosInstance.get<LeaveDetail>(`/rrhh/leaves/${leaveId}`)
    return data
  },

  createLeave: async (payload: LeaveCreatePayload, files: File[] = []) => {
    const formData = mapperCreateLeaveFormData(payload, files)
    const { data } = await axiosInstance.post<LeaveCreateResponse>('/rrhh/leaves/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateLeave: async (payload: LeaveUpdatePayload, files: File[] = []) => {
    const formData = mapperUpdateLeaveFormData(payload, files)
    const { data } = await axiosInstance.put<LeaveUpdateResponse>('/rrhh/leaves/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  getLeavesByEmployee: async (employeeId: number) => {
    const { data } = await axiosInstance.get<LeaveDetail[]>(`/rrhh/leaves/select/by-employee/${employeeId}`)
    return data
  },

  exportLeavesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/leaves/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
