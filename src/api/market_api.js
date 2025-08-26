import { privateApi } from "./axiosInstance";

export const getTokenTradeHistory = async () => {
  try {
    const response = await privateApi.get(`/market/trade/history`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
