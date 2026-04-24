import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || "An unexpected error occurred.";
        
        if (error.response?.status === 401) {
            console.warn('Session expired. Redirecting...');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        } else if (error.response?.status >= 500) {
            alert(`Server Error: ${message}`);
        }
        
        return Promise.reject(error);
    }
);
