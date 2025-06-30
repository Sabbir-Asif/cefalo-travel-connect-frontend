import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { UserResponse } from "../types/User";
import {
    getMeAPI,
    loginAPI,
    logoutAPI,
    refreshTokenAPI,
    signupAPI,
} from "../utils/api/auth";
import { setAccessTokenInAxios } from "../utils/axios";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user && !!accessToken;

    const login = async (email: string, password: string) => {
        const { user, accessToken } = await loginAPI(email, password);
        setUser(user);
        setAccessToken(accessToken);
        setAccessTokenInAxios(accessToken);
    };

    const signup = async (
        name: string,
        email: string,
        phone_number: string,
        password: string
    ) => {
        const user = await signupAPI({ name, email, phone_number, password });
        setUser(user);
    };

    const logout = async () => {
        await logoutAPI();
        setUser(null);
        setAccessToken(null);
        setAccessTokenInAxios(null);
    };

    useEffect(() => {
        const refresh = async () => {
            try {
                const { accessToken } = await refreshTokenAPI();
                setAccessToken(accessToken);
                setAccessTokenInAxios(accessToken);
                const user = await getMeAPI();
                setUser(user);
            } catch (err) {
                console.error(err);
                await logout();
            } finally {
                setLoading(false);
            }
        };
        refresh();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{ user, accessToken, isAuthenticated, login, signup, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
