import axios from 'axios'

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL as string

const TOKEN_KEY = 'auth_token'
const USER_ID_KEY = 'auth_user_id'

export const apiAuth = {
  async login(identifier: string, password: string) {
    const url = `${AUTH_BASE_URL}/user/authenticate/login`
    const { data } = await axios.post(url, { identifier, password })
    const token = data?.accessToken || data?.token || ''
    const userId = data?.id || data?.userId || ''
    if (!token) throw new Error('No access token received')
    localStorage.setItem(TOKEN_KEY, token)
    if (userId) localStorage.setItem(USER_ID_KEY, String(userId))
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY)
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
  },
}

