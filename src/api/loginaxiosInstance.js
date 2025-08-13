import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_LOGIN || '',
    // withCredentials: true, // 쿠키 방식 필요시 사용
});

export function loginaxiosInstance(getAccessToken, getRefreshToken, setTokens, logout) {
    api.interceptors.request.use(config => {
        const token = getAccessToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
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

                        const r = await axios.post('/user/auth/login', { refreshToken }, { withCredentials: true });
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

export default api;