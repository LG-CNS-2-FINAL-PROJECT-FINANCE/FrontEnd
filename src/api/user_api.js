import { jwtDecode } from "jwt-decode";

import instance from "./axiosInstance";

export const login = async ({ email, password }) => {
  console.log("Login API 호출");
  console.log("Email :" + email);
  console.log("Password :" + password);
  try {
    const response = await instance.post(
      "/login",
      {
        email,
        password,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
