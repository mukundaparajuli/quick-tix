import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                return api(error.config);
            } catch (refreshError) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;