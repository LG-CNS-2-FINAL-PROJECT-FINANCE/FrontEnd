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
