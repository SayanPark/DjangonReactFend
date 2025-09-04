import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './constants.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || API_BASE_URL;

const apiInstance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 300000,  // Increased timeout to 300 seconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

let logoutHandler = null;

export function setLogoutHandler(handler) {
    logoutHandler = handler;
}

apiInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors by refreshing token and retrying request
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh_token = Cookies.get('refresh_token');
                if (!refresh_token) {
                    if (logoutHandler) {
                        logoutHandler();
                    }
                    return Promise.reject(error);
                }
                const response = await axios.post(`${apiBaseUrl}/user/token/refresh/`, {
                    refresh: refresh_token,
                });
                const newAccessToken = response.data.access;
                Cookies.set('access_token', newAccessToken, {
                    expires: 1,
                    path: '/',
                    sameSite: 'Lax',
                    secure: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
                });
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiInstance(originalRequest);
            } catch (refreshError) {
                if (logoutHandler) {
                    logoutHandler();
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiInstance;
