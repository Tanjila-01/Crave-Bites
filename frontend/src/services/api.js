import axios from 'axios';

// Create a centralized Axios instance for all API calls
export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    // Proper CSRF configuration for Django
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

// Interceptor for handling token refresh and common errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized (Expired tokens)
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/token/')) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token via HttpOnly cookie
                await api.post('/auth/token/refresh/');
                processQueue(null, true);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                console.warn('Session expired. Redirecting to login...');
                localStorage.removeItem('isLoggedIn');
                if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Standardized error messages for the UI
        const message = error.response?.data?.error || error.response?.data?.detail || "An unexpected error occurred.";
        
        // Global error feedback for critical failures
        if (error.response?.status >= 500) {
            console.error(`Critical Server Error [${error.response.status}]:`, message);
        }
        
        return Promise.reject(error);
    }
);

export default api;
