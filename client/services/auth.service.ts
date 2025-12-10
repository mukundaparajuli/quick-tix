import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { $axios } from "@/lib/axios"

export const loginWithCredentials = async (data: LoginForm) => {
    const response = await $axios.post("/auth/login", data)
    return response.data
}

export const registerWithCredentials = async (data: RegisterForm) => {
    const response = await $axios.post("/auth/register", data)
    return response.data
}

export const verifyEmail = async (token: string) => {
    const response = await $axios.get(`/auth/verify-email/${token}`)
    return response.data
}
