import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔁 Request interceptor for token
api.interceptors.request.use(async (config) => {
    const session = await getSession();
    const token = session?.access_token;

    if (token) {
        console.log("token is here: ", token)
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(session)

    return config;
});

// 🔁 Response interceptor for refresh logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                return api(error.config); // retry original request
            } catch (refreshError) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
