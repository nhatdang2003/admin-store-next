import { PUBLIC_ENDPOINTS } from '@/constants/endpoint';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Token management utilities
export const tokenManager = {
    getAccessToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    setAccessToken: (accessToken: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('access_token', accessToken);
    },

    clearTokens: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
    },

    isTokenExpired: (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch {
            return true;
        }
    }
};

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BACKEND,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true, // Quan trọng: để gửi cookies tự động
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            const token = tokenManager.getAccessToken();

            const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint =>
                config.url?.includes(endpoint)
            );

            if (token && !isPublicEndpoint) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // Handle 401 Unauthorized
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Call refresh token endpoint - cookie sẽ được gửi tự động
                    const refreshResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/auth/refresh`,
                        {
                            withCredentials: true, // Gửi cookies (refresh token)
                        }
                    );
                    const { access_token } = refreshResponse.data?.data;

                    // Chỉ cập nhật access token trong localStorage
                    tokenManager.setAccessToken(access_token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return instance(originalRequest);

                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    tokenManager.clearTokens();

                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }

                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// Create the main axios instance
export const apiClient = createAxiosInstance();

// HTTP methods wrapper
export const httpClient = {
    get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.get<T>(url, config);
        return response.data;
    },

    post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.post<T>(url, data, config);
        return response.data;
    },

    put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.put<T>(url, data, config);
        return response.data;
    },

    delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.delete<T>(url, config);
        return response.data;
    },

    patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.patch<T>(url, data, config);
        return response.data;
    },
};

export default httpClient; 