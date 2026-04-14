import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperTerminationQuizQuestionQueryParams } from '@/mappers'
import type {
  TerminationQuizQuestionCreatePayload,
  TerminationQuizQuestionCreateResponse,
  TerminationQuizQuestionDetail,
  TerminationQuizQuestionPagedResponse,
  TerminationQuizQuestionQueryParams,
  TerminationQuizQuestionUpdatePayload,
} from '@/types'

export const terminationQuizQuestionService = {
  getTerminationQuizQuestion: async (queryParams: TerminationQuizQuestionQueryParams) => {
    const { data } = await axiosInstance.get<TerminationQuizQuestionPagedResponse>('/rrhh/termination-quiz-question/paged', {
      params: mapperTerminationQuizQuestionQueryParams(queryParams),
    })
    return data
  },

  getTerminationQuizQuestionDetail: async (id: number) => {
    const { data } = await axiosInstance.get<TerminationQuizQuestionDetail>(`/rrhh/termination-quiz-question/${id}`)
    return data
  },

  createTerminationQuizQuestion: async (payload: TerminationQuizQuestionCreatePayload) => {
    const { data } = await axiosInstance.post<TerminationQuizQuestionCreateResponse>('/rrhh/termination-quiz-question/create', payload)
    return data
  },

  updateTerminationQuizQuestion: async (payload: TerminationQuizQuestionUpdatePayload) => {
    const { data } = await axiosInstance.put<TerminationQuizQuestionCreateResponse>('/rrhh/termination-quiz-question/update', payload)
    return data
  },

  toggleTerminationQuizQuestionStatus: async (id: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/termination-quiz-question/${id}/status`, { active })
  },

  isAxiosError: axios.isAxiosError,
}
