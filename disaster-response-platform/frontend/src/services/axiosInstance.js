import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true // send cookies
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401 and token refresh
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {}, { withCredentials: true });
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.data.accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
                return axiosInstance(originalRequest);
            }
        } catch (refreshError) {
            // Refresh failed, logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;
