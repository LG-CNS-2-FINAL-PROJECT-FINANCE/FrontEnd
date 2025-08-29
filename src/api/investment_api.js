import { privateApi } from './axiosInstance';

// Investment API - 투자 신청
export const buyInvestment = async (investmentData) => {
    try {
        const response = await privateApi.post('/market/invest/buy', investmentData);
        return response.data;
    } catch (error) {
        console.error('[investment_api] buyInvestment 오류:', error);
        throw error;
    }
};

// Investment API - 내 투자 내역 조회
export const getMyInvestments = async (projectId) => {
    try {
        // GET /{projectId}/mylist - userSeq는 JWT 토큰에서 자동으로 추출
        const response = await privateApi.get(`/market/invest/${projectId}/mylist`);
        return response.data;
    } catch (error) {
        console.error('[investment_api] getMyInvestments 오류:', error);
        throw error;
    }
};

// Investment API - 투자 취소
export const cancelInvestment = async (investmentSeq, requestData) => {
    try {
        const response = await privateApi.post(`/market/invest/${investmentSeq}/cancel`, requestData);
        return response.data;
    } catch (error) {
        console.error('[investment_api] cancelInvestment 오류:', error);
        throw error;
    }
};
