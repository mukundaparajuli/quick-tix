import useAuthStore from '@/stores/auth-store';
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const bypassUrls = ['/auth/login', '/auth/refresh-token', '/auth/register'];

export const $axios = axios.create({
    baseURL: ` ${baseURL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
})

$axios.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

$axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (!error.config || !error.config.url) {
            throw error;
        }

        if (bypassUrls.includes(error.config.url) || !accessToken) {
            throw error;
        }

        return Promise.reject(error)
    }
)