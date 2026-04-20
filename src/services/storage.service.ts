import { APP_URL } from '@/constant'

const normalizedBaseUrl = APP_URL.endsWith('/') ? APP_URL.slice(0, -1) : APP_URL

export const storageService = {
  getDownloadUrl: (fileId: number) => `${normalizedBaseUrl}/rrhh/storage/download/${fileId}`,
}
