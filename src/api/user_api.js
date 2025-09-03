import { privateApi, publicApi } from "./axiosInstance.js";

export const kakaologin = async (code) => {
  try {
    const response = await publicApi.post(
      `/user/auth/login?code=${code.code}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = response.data;
    console.log("Kakao login 성공:", response.data);
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (accessTokenExpiresAt)
      localStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);
    if (refreshTokenExpiresAt)
      localStorage.setItem("refreshTokenExpiresAt", refreshTokenExpiresAt);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMe = async () => {
  try {
    const response = await privateApi.get(`/user/info`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response ? error.response.data : error;
  }
};

export const registerUserInfo = async (userInfo) => {
  try {
    const response = await privateApi.post("/user/register", userInfo, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiresAt");
    localStorage.removeItem("refreshTokenExpiresAt");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const selectRole = async (role) => {
  try {
    const response = await privateApi.post("/user/role", null, {
      params: { role },
    });
    const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response.data;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (accessTokenExpiresAt) localStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (refreshTokenExpiresAt) localStorage.setItem("refreshTokenExpiresAt", refreshTokenExpiresAt);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const editUser = async (userSeq, nickname) => {
  try {
    const response = await privateApi.post(`user/edit`, {
      // userSeq,
      nickname,
    });
    return response.data;
  } catch (error) {
    console.error("❌ editUser 요청 실패:", error);
    throw error;
  }
};

//사용자 탈퇴 요청 API
export const secessionUser = async () => {
  try {
    console.log("[secessionUser 호출] 유저 탈퇴 요청")
    const response = await privateApi.post(`user/delete`)
    return response.data;
  } catch (error){
    console.error("유저 탈퇴 요청 실패", error);
    throw error;
  }
}

//KYC 인증
export async function userKYC(kycData) {
  console.log('[user_api] 백엔드 KYC 인증 요청 시작:', kycData);
  try {
    const response = await privateApi.post('/test/kyc/apick/resident-id/verify', kycData);
    console.log('[user_api] 백엔드로부터 KYC 인증 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('[user_api] 백엔드 KYC 인증 요청 실패:', error.response?.data || error.message);
    throw error.response?.data || new Error('KYC 인증 요청 중 오류가 발생했습니다.');
  }
}