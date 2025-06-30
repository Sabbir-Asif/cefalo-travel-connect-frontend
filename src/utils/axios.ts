import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { refreshTokenAPI } from "./api/auth";

let accessToken: string | null = null;

export const setAccessTokenInAxios = (token: string | null) => {
    accessToken = token;
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken && config.headers) {
        config.headers.authorization = `${accessToken}`;
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh-token") &&
            !originalRequest.url?.includes("/auth/login")
        ) {
            originalRequest._retry = true;

            try {
                const { accessToken: newToken } = await refreshTokenAPI();
                setAccessTokenInAxios(newToken);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    authorization: `${newToken}`,
                };

                return api(originalRequest);
            } catch (refreshErr) {
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);