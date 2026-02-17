import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
}

if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('accessToken')
  const storedRefreshToken = localStorage.getItem('refreshToken')
  const storedUser = localStorage.getItem('user')

  if (storedToken) {
    initialState.accessToken = storedToken
  }
  if (storedRefreshToken) {
    initialState.refreshToken = storedRefreshToken
  }
  if (storedUser) {
    try {
      initialState.user = JSON.parse(storedUser)
    } catch (e) {
    }
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, accessToken, refreshToken } = response.data

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('offlineAuthAt', String(Date.now()))
      }

      return { user, accessToken, refreshToken }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; firstName?: string; lastName?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data)
      const { user, accessToken, refreshToken } = response.data

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('offlineAuthAt', String(Date.now()))
      }

      return { user, accessToken, refreshToken }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout')
  } catch (error) {
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('offlineAuthAt')
    }
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to get user')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.error = null
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.error = null
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload))
        }
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
