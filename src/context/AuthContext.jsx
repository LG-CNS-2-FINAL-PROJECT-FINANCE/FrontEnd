import React, { createContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { privateApi, publicApi } from '../api/axiosInstance';
import { adminApiSetup } from '../api/admin_api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessTokenState] = useState(null);
    const [refreshToken, setRefreshTokenState] = useState(null);
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    const tokenRef = useRef(null);

    const TOKEN_KEY_ACCESS = 'ACCESS_TOKEN';
    const TOKEN_KEY_REFRESH = 'REFRESH_TOKEN';

    const getAccessToken = useCallback(() => tokenRef.current, []);
    const getRefreshToken = useCallback(() => localStorage.getItem(TOKEN_KEY_REFRESH) || refreshToken, [refreshToken]);

    const setTokens = useCallback((newAccess, newRefresh) => {
        if (newAccess) {
            setAccessTokenState(newAccess);
            tokenRef.current = newAccess;
            localStorage.setItem(TOKEN_KEY_ACCESS, newAccess);
            privateApi.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
            console.log('setTokens: access set', newAccess);
        } else {
            setAccessTokenState(null);
            tokenRef.current = null;
            localStorage.removeItem(TOKEN_KEY_ACCESS);
            if (privateApi.defaults?.headers?.common) delete privateApi.defaults.headers.common['Authorization'];
            console.log('setTokens: access removed');
        }
        if (newRefresh) {
            setRefreshTokenState(newRefresh);
            localStorage.setItem(TOKEN_KEY_REFRESH, newRefresh);
        } else {
            setRefreshTokenState(null);
            localStorage.removeItem(TOKEN_KEY_REFRESH);
        }
    }, [refreshToken]);

    const logout = useCallback(async () => {
        console.log('로그아웃 요청');
        try {
            const currentAccessToken = tokenRef.current;
            if (currentAccessToken) {
                await privateApi.post('/user/logout', {}, {
                    headers: { Authorization: `Bearer ${currentAccessToken}` },
                    withCredentials: true,
                });
            }
        } catch (e) {
            console.warn('서버 로그아웃 실패:', e?.response?.status, e?.response?.data);
        } finally {
            setTokens(null, null);
            setUserState(null);
            console.log('로그아웃 완료: 클라이언트 상태 정리');
        }
    }, [setTokens]); // queryClient도 의존성 배열에 있었으나 주석 제거됨

    const loginMutation = useMutation({
        mutationFn: async ({ adminId, password }) => {
            const res = await publicApi.post('/user/auth/admin/login', { adminId, password }, { withCredentials: true });
            return res;
        },
        onSuccess: (res) => {
            console.log('loginMutation success res.status=', res.status);
            console.log('loginMutation success res.data=', res.data);
            console.log('loginMutation success res.headers=', res.headers);

            const headerToken = res.headers?.authorization?.replace(/^Bearer\s+/i, '') || null;
            const { accessToken: a, refreshToken: r, user: u } = res.data || {};
            const finalAccess = a || headerToken;

            setTokens(finalAccess, r);
            setUserState(u);
        },
        onError: (error) => {
            console.error('loginMutation error:', error);
            throw error;
        }
    });

    const login = useCallback(async ({ adminId, password }) => {
        return loginMutation.mutateAsync({ adminId, password });
    }, [loginMutation]);

    useEffect(() => {
        const savedAccess = localStorage.getItem(TOKEN_KEY_ACCESS);
        const savedRefresh = localStorage.getItem(TOKEN_KEY_REFRESH);

        setTokens(savedAccess, savedRefresh);
        setLoading(false);

        const ejectInterceptors = adminApiSetup(getAccessToken, getRefreshToken, setTokens, logout);

        return () => {
            console.log('[AuthContext] 언마운트 시 인터셉터 해제');
            ejectInterceptors();
        };
    }, []);

    const contextValue = useMemo(() => ({
        accessToken,
        refreshToken,
        user,
        setUser: setUserState,
        loading,
        setTokens,
        login,
        logout,
        getAccessToken,
        getRefreshToken,
        loginLoading: loginMutation.isLoading,
        loginError: loginMutation.error,
    }), [accessToken, refreshToken, user, loading, setTokens, login, logout, getAccessToken, getRefreshToken, loginMutation.isLoading, loginMutation.error, setUserState]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}