import { privateApi } from "./axiosInstance";

// 신고하기 API
export const createReport = async (reportData) => {
    try {
        const response = await privateApi.post('/monitoring/report', reportData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
