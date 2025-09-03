import { privateApi } from "./axiosInstance";

export const getMyAccount = async () => {
  try {
    const response = await privateApi.get(`/asset/account/search`);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.code === 'NotFound') {
      console.info('[asset_api] getMyAccount: 계좌가 아직 생성되지 않았습니다. (404 정상 오류)');
      return null;
    }
    console.error('[asset_api] getMyAccount 오류:', error.response?.data || error.message);
    throw error;
  }
};

export const getMyWallet = async () => {
  try {
    const response = await privateApi.get(`/asset/wallet/search`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createMyAccount = async () => {
  try {
    const response = await privateApi.post(`/asset/account`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createMyWallet = async () => {
  try {
    const response = await privateApi.post(`/asset/wallet`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const depositAccount = async (deposit) =>{
  console.log("deposit: ", deposit);
  try {
    const response = await privateApi.post(`/asset/account/deposit`, { "price": deposit }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const withdrawalAccount = async (withdrawal) =>{
  try {
    const response = await privateApi.post(`/asset/account/withdrawal`, { withdrawal }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAccountAllHistory = async () => {
  try{
    const response = await privateApi.get(`/asset/history`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAccountSpecificHistory = async (moneyType) => {
  try{
    const response = await privateApi.get(`/asset/history?moneyType=${moneyType}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const getWalletToken = async () => {
  try{
    const response = await privateApi.get(`/asset/wallet-token/search`);
    console.log(response)
    return response.data.data || []; 
  } catch (error) {
    console.error(error);
    return []; // Return empty array on error to prevent map errors
  }
}
