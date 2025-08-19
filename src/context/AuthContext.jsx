import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { privateApi as api } from '../api/axiosInstance';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const tokenRef = useRef(null);

    const TOKEN_KEY_ACCESS = 'ACCESS_TOKEN';
    const TOKEN_KEY_REFRESH = 'REFRESH_TOKEN';

    useEffect(() => {
        const savedAccess = localStorage.getItem(TOKEN_KEY_ACCESS);
        const savedRefresh = localStorage.getItem(TOKEN_KEY_REFRESH);
        if (savedAccess) {
            setAccessToken(savedAccess);
            tokenRef.current = savedAccess;
            api.defaults.headers.common['Authorization'] = `Bearer ${savedAccess}`;
            console.log('초기 토큰 복원:', savedAccess);
        }
        if (savedRefresh) setRefreshToken(savedRefresh);
        setLoading(false);
    }, []);

    const setTokens = useCallback((newAccess, newRefresh) => {
        if (newAccess) {
            setAccessToken(newAccess);
            tokenRef.current = newAccess;
            localStorage.setItem(TOKEN_KEY_ACCESS, newAccess);
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
            console.log('setTokens: access set', newAccess);
        } else {
            setAccessToken(null);
            tokenRef.current = null;
            localStorage.removeItem(TOKEN_KEY_ACCESS);
            if (api.defaults?.headers?.common) delete api.defaults.headers.common['Authorization'];
            console.log('setTokens: access removed');
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
        const tokenFromRef = tokenRef.current;
        const tokenFromStorage = localStorage.getItem(TOKEN_KEY_ACCESS);
        const token = tokenFromRef || tokenFromStorage || null;

        console.log('로그아웃 요청, token=', token);

        try {
            await api.post('/user/auth/logout', {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true,
            });
        } catch (e) {
            console.warn('서버 로그아웃 실패', e?.response?.status, e?.response?.data);
        } finally {
            setTokens(null, null);
            setUser(null);
            if (api.defaults?.headers?.common) delete api.defaults.headers.common['Authorization'];
        }
    }, [setTokens]);

    const login = async ({ adminId, password }) => {
        try {
            const res = await api.post('/user/auth/admin/login', { adminId, password }, { withCredentials: true });
            console.log('login res.status=', res.status);
            console.log('login res.data=', res.data);
            console.log('login res.headers=', res.headers);

            const headerToken = res.headers?.authorization?.replace(/^Bearer\s+/i, '') || null;
            const { accessToken: a, refreshToken: r, user: u } = res.data || {};
            const finalAccess = a || headerToken;
            console.log('extracted accessToken=', finalAccess);

            setTokens(finalAccess, r);
            if (u) setUser(u);
            return res;
        } catch (err) {
            console.error('로그인 실패', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            accessToken, refreshToken, user, setUser, setTokens, logout, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}