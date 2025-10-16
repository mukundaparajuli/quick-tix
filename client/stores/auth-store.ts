import { $axios } from '@/lib/axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    name: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (userData: RegisterData) => Promise<void>
    logout: () => void
    clearAuth: () => void
}

interface RegisterData {
    name: string
    email: string
    password: string
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true })
                try {
                    const response = await $axios.post('/auth/login', { email, password })
                    console.log(response)
                    const { user, token } = response.data

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            register: async (userData: RegisterData) => {
                set({ isLoading: true })
                try {
                    const response = await $axios.post('/auth/register', userData)
                    const { user, token } = response.data

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            logout: () => {
                // Call logout endpoint if needed
                $axios.post('/auth/logout').catch(console.error)
                get().clearAuth()
            },

            clearAuth: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)