import { privateApi } from "./axiosInstance";

export const getMyAccount = async () => {
  try {
    const response = await privateApi.get(`/asset/account/search`);
    return response.data.data;
  } catch (error) {
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
    return response.data.data || []; 
  } catch (error) {
    console.error(error);
    return []; // Return empty array on error to prevent map errors
  }
}

// Get accumulated amount by money type (0 = deposit, 1 = withdrawal)
export const getAccumulatedAmount = async (moneyType) => {
  try {
    const requestBody = { moneyType: moneyType };

    const response = await privateApi.post(`/asset/all`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return response.data; 

  } catch (error) {
    console.error(`Error getting accumulated amount for moneyType ${moneyType}:`, error);
    throw error;
  }
}
