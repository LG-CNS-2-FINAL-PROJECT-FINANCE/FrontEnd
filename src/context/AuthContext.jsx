import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const TOKEN_KEY_ACCESS = 'ACCESS_TOKEN';
    const TOKEN_KEY_REFRESH = 'REFRESH_TOKEN';

    useEffect(() => {
        const savedAccess = localStorage.getItem(TOKEN_KEY_ACCESS);
        const savedRefresh = localStorage.getItem(TOKEN_KEY_REFRESH);
        if (savedAccess) setAccessToken(savedAccess);
        if (savedRefresh) setRefreshToken(savedRefresh);
        setLoading(false);
    }, []);

    const setTokens = useCallback((newAccess, newRefresh) => {
        if (newAccess) {
            setAccessToken(newAccess);
            localStorage.setItem(TOKEN_KEY_ACCESS, newAccess);
        } else {
            setAccessToken(null);
            localStorage.removeItem(TOKEN_KEY_ACCESS);
        }
        if (newRefresh) {
            setRefreshToken(newRefresh);
            localStorage.setItem(TOKEN_KEY_REFRESH, newRefresh);
        } else {
            setRefreshToken(null);
            localStorage.removeItem(TOKEN_KEY_REFRESH);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post('/user/auth/logout', {}, { withCredentials: true }).catch(()=>{});
        } catch (e) { /* ignore */ }
        setTokens(null, null);
        setUser(null);
    }, [setTokens]);

    const login = async ({ adminId, password }) => {
        const res = await axios.post('/user/auth/admin/login', { adminId, password }, { withCredentials: true });
        const { accessToken: a, refreshToken: r, user: u } = res.data;
        setTokens(a, r);
        if (u) setUser(u);
        return res;
    };

    return (
        <AuthContext.Provider value={{
            accessToken, refreshToken, user, setUser,
            setAccessToken: (t)=>setTokens(t, refreshToken),
            setRefreshToken: (t)=>setTokens(accessToken, t),
            login, logout, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}