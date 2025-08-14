import axios from 'axios';
import api from './axiosInstance';

let initialized = false;

export function admin_api(getAccessToken, getRefreshToken, setTokens, logout) {
    if (initialized) return;
    initialized = true;

    // 요청 인터셉터: access token 자동 추가
    api.interceptors.request.use(config => {
        const token = getAccessToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
        failedQueue = [];
    };

    api.interceptors.response.use(
        res => res,
        err => {
            const originalRequest = err.config;
            if (err.response && err.response.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                return new Promise(async (resolve, reject) => {
                    try {
                        const refreshToken = getRefreshToken();
                        if (!refreshToken) throw new Error('No refresh token');

                        // 인터셉터 우회용 별도 클라이언트 생성 (같은 baseURL 사용)
                        const refreshClient = axios.create({
                            baseURL: api.defaults.baseURL || '',
                            withCredentials: true,
                        });

                        const r = await refreshClient.post('/user/auth/login', { refreshToken });
                        const newAccess = r.data.accessToken;
                        const newRefresh = r.data.refreshToken || refreshToken;
                        setTokens(newAccess, newRefresh);

                        api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
                        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                        processQueue(null, newAccess);
                        resolve(api(originalRequest));
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        logout();
                        reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                });
            }
            return Promise.reject(err);
        }
    );
}

export default admin_api;