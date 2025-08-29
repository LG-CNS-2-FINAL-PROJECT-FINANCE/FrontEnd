import { privateApi, publicApi } from "./axiosInstance";

export const getMarketProducts = async () => {
  try {
    const response = await publicApi.get(`/product/market/trading`);
    return response.data.content;
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const tradeSell = async (data) => {
  try {
    const response = await privateApi.post(`/market/trade/sell`, data);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const tradePurchase = async (data) => {
  try {
    const response = await privateApi.post(`/market/trade/purchase`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTokenTradeDoneHistoryByProjectId = async (projectId) => {
  try {
    const response = await privateApi.get(`/market/trade/${projectId}/history`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTokenTradePurchaseHistory = async (projectId) => {
  try {
    const response = await privateApi.get(`/market/trade/${projectId}/purchase`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTokenTradeSellHistory = async (projectId) => {
  try {
    const response = await privateApi.get(`/market/trade/${projectId}/sell`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const deleteTokenTrade = async (data) => {
  try {
    const response = await privateApi.post(`/market/trade/order/delete`, data );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getTokenTradeDoneHistoryByUserId = async () => {
  try {
    const response = await privateApi.get(`/market/trade/history`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTokenOrderHistoryByUserId = async () => {
  try {
    const response = await privateApi.get(`/market/trade/list`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTokenOrderHistoryByUserIdAndTradeType = async (tradeType) => {
  try {
    const response = await privateApi.get(`/market/trade/history/${tradeType}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 프로젝트별 체결 거래 내역 조회
export const getMyTradeDoneHistoryByProjectId = async (projectId) => {
  try {
    const response = await privateApi.get(`/market/trade/${projectId}/user/history`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 프로젝트별 미체결 거래 내역 조회
export const getMyTradeYetHistoryByProjectId = async (projectId) => {
  try {
    const response = await privateApi.get(`/market/trade/${projectId}/user/list`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};