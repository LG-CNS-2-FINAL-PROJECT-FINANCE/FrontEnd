import axios from 'axios';
import { privateApi as api } from './axiosInstance';

export function adminApiSetup(getAccessToken, getRefreshToken, setTokens, logout) {
    // 고유 retry 키
    const RETRY_FLAG = '__isRetryRequest';

    // refresh 전용 클라이언트 (인터셉터 없음)
    const refreshClient = axios.create({
        baseURL: api.defaults.baseURL,
        withCredentials: true, // 서버가 쿠키 기반이면 true
    });

    // 요청 인터셉터: 매 요청에 최신 토큰 첨부
    const reqId = api.interceptors.request.use((config) => {
        try {
            const token = typeof getAccessToken === 'function' ? getAccessToken() : null;
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            // 안전하게 무시
            console.warn('request interceptor error', e);
        }
        return config;
    });

    // 401 처리: 큐 + 리프레시
    let isRefreshing = false;
    let queue = []; // [{ resolve, reject }]

    const processQueue = (error, token = null) => {
        queue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
        queue = [];
    };

    const resId = api.interceptors.response.use(
        res => res,
        err => {
            const originalRequest = err?.config;
            if (!originalRequest) return Promise.reject(err);

            const status = err.response ? err.response.status : null;

            // auth 관련 엔드포인트는 리프레시 대상에서 제외(무한 재시도 방지)
            const url = originalRequest.url || '';
            if (url.includes('/auth/') && status === 401) {
                return Promise.reject(err);
            }

            if (status === 401 && !originalRequest[RETRY_FLAG]) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        queue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    });
                }

                originalRequest[RETRY_FLAG] = true;
                isRefreshing = true;

                return new Promise(async (resolve, reject) => {
                    try {
                        const refreshToken = typeof getRefreshToken === 'function' ? getRefreshToken() : null;
                        if (!refreshToken) throw new Error('No refresh token');

                        // 실제 서버 리프레시 엔드포인트에 맞춰 경로 조정하세요
                        const r = await refreshClient.post('/user/auth/refresh', { refreshToken });

                        const newAccess = r.data?.accessToken;
                        const newRefresh = r.data?.refreshToken || refreshToken;
                        if (!newAccess) throw new Error('No new access token');

                        // 저장 핸들러 호출 (AuthProvider에서 tokenRef/localStorage 설정)
                        setTokens && setTokens(newAccess, newRefresh);

                        api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

                        processQueue(null, newAccess);
                        resolve(api(originalRequest));
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        // 로그아웃 처리
                        logout && logout();
                        reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                });
            }

            return Promise.reject(err);
        }
    );

    // 반환: 인터셉터 해제 함수 (앱 언마운트/테스트 시 사용)
    return function ejectInterceptors() {
        api.interceptors.request.eject(reqId);
        api.interceptors.response.eject(resId);
    };
}

export default api;