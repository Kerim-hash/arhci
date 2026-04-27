export const storage_js = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

export const tokenStorage = {
  getAccessToken: () => storage_js.getItem('access_token'),
  getRefreshToken: () => storage_js.getItem('refresh_token'),

  setTokens: (accessToken: string, refreshToken?: string) => {
    storage_js.setItem('access_token', accessToken)
    if (refreshToken) {
      storage_js.setItem('refresh_token', refreshToken)
    }
  },

  clearTokens: () => {
    storage_js.removeItem('access_token')
    storage_js.removeItem('refresh_token')
  },

  hasValidTokens: () => {
    return !!(
      storage_js.getItem('access_token') && storage_js.getItem('refresh_token')
    )
  },
}

export const storage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

export const tokenStorage_js = {
  getAccessToken: () => storage.getItem('access_token'),
  getRefreshToken: () => storage.getItem('refresh_token'),

  setTokens: (accessToken: string, refreshToken?: string) => {
    storage.setItem('access_token', accessToken)
    if (refreshToken) {
      storage.setItem('refresh_token', refreshToken)
    }
  },

  clearTokens: () => {
    storage.removeItem('access_token')
    storage.removeItem('refresh_token')
  },

  hasValidTokens: () => {
    return !!(
      storage.getItem('access_token') && storage.getItem('refresh_token')
    )
  },
}
