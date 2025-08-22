import { privateApi, publicApi } from "./axiosInstance.js";

export const kakaologin = async (code) => {
  console.log("Kakao login API 호출");
  console.log("Code:", code);
  try {
    const response = await publicApi.post(
      `/user/auth/login?code=${code.code}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const { accessToken, refreshToken } = response.data;
    console.log("Kakao login 성공:", response.data);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMe = async () => {
  try {
    const response = await privateApi.get(`/user`);
    return response.data;
  } catch (error) {
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
