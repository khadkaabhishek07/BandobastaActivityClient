import axios, { AxiosError } from 'axios'
import type { ApiResponse } from '../types/dto'
import { apiAuth } from './auth'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const api = axios.create({ baseURL: API_BASE_URL })

// Attach token when available
api.interceptors.request.use((config) => {
  const token = apiAuth.getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Unwrap ApiResponse<T> if present
api.interceptors.response.use(
  (response) => {
    const value = response.data as ApiResponse<unknown> | unknown
    if (
      typeof value === 'object' &&
      value !== null &&
      'success' in (value as any) &&
      'data' in (value as any)
    ) {
      const res = value as ApiResponse<unknown>
      return Promise.resolve({ ...response, data: res.data })
    }
    return response
  },
  (error: AxiosError<any>) => {
    const msg = (error.response?.data as any)?.message || error.message
    return Promise.reject(new Error(msg))
  }
)

