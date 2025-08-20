// api.js (JS)
import axios from "axios";

// 1) 토큰 유틸 (localStorage에 저장)
const getAccessToken = () => localStorage.getItem("accessToken");
const setAccessToken = (t) => localStorage.setItem("accessToken", t);
const getRefreshToken = () => localStorage.getItem("refreshToken");
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// 2-1) 인스턴스
export const publicApi = axios.create({
  // Local환경에서의 BaseUrl
  baseURL: "http://192.168.0.222:8080/api",
  withCredentials: false,
});

// 2-2) 인스턴스
export const privateApi = axios.create({
  // Local환경에서의 BaseUrl
  baseURL: "http://192.168.0.222:8080/api",
  withCredentials: false,
});

// 3) 리프레시 전용 클라이언트 (응답 인터셉터 타지 않게 분리)
const refreshClient = axios.create({
  baseURL: "http://192.168.0.222:8080/api",
  withCredentials: false,
});

// 4) 요청 인터셉터: AccessToken 자동 첨부
privateApi.interceptors.request.use((config) => {
  const at = getAccessToken();
  if (at) config.headers.Authorization = `Bearer ${at}`;
  return config;
});

// 5) 401 처리(동시성 제어 + 큐잉)
let isRefreshing = false;
let queue = []; // { resolve, reject }

const flushQueue = (error, newToken) => {
  queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(newToken)
  );
  queue = [];
};

privateApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config: original } = error;
    if (!response) return Promise.reject(error);

    // auth 경로에서의 401은 재시도하지 않음
    if (original.url?.startsWith("/auth/")) return Promise.reject(error);

    if (response.status !== 401) return Promise.reject(error);
    if (original._retry) return Promise.reject(error);
    original._retry = true;

    // 동시에 여러 401 처리 → 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        queue.push({ resolve, reject })
      ).then((newToken) => {
        if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
        return privateApi(original);
      });
    }

    // 리프레시 시도
    isRefreshing = true;
    try {
      const rt = getRefreshToken(); // 쿠키 기반이면 이 라인 불필요
      // (헤더/바디 기반) POST /auth/refresh { refreshToken }
      const { data } = await refreshClient.post("/auth/refresh", {
        refreshToken: rt,
      });
      // (쿠키 기반) await refreshClient.post("/auth/refresh") // 바디 없이

      const newAT = data?.accessToken;
      if (!newAT) throw new Error("NO_ACCESS_TOKEN_IN_RESPONSE");

      setAccessToken(newAT);
      flushQueue(null, newAT);

      // 실패했던 원요청 재시도
      original.headers.Authorization = `Bearer ${newAT}`;
      return privateApi(original);
    } catch (e) {
      flushQueue(e, null);
      clearTokens();
      // window.location.replace("/login"); // 필요시
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
