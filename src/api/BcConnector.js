import { privateApi } from './axiosInstance';

/**
 * 백엔드에서 EIP-712 서명용 typed-data(domain/types/message)를 받아옵니다.
 */

export const requestPermitSignature = async ({ projectId, userAddress, tokenAmount }) => {
    try {
        const res = await privateApi.post('/contract/trade/signature', {
            projectId,
            userAddress,
            tokenAmount
        });
        // 기대 응답: { data: { domain, types, message } }
        return res.data?.data;
    } catch (error) {
        console.error('[bc_connector] requestPermitSignature 오류:', error);
        throw error;
    }
};




/**
 * 서명 결과를 포함해 실제 거래/예치/취소 등을 호출할 때 사용할 API 예시
 */
export const submitSellOrderWithSignature = async ({
    projectId,
    purchasePrice,
    tokenQuantity,
    signature, // { v,r,s,deadline,owner,spender,value,verifyingContract,chainId }
}) => {
    try {
        const res = await privateApi.post(`/market/trade/${projectId}/sell`, {
            purchasePrice,
            tokenQuantity,
            signature,
        });
        return res.data;
    } catch (error) {
        console.error('[bc_connector] submitSellOrderWithSignature 오류:', error);
        throw error;
    }
};

/**
 * 판매 후 블록체인에 토큰을 예치하는 API
 */
export const depositTokenWithPermit = async ({
    projectId,
    sellId,
    sellerAddress,
    tokenAmount,
    deadline,
    v,
    r,
    s
    }) => {
    try {
        const res = await privateApi.post('/contract/trade/deposit', {
            projectId,
            sellId,
            sellerAddress,
            tokenAmount,
            deadline,
            v,
            r,
            s
        });
        return res.data;
    } catch (error) {
        console.error('[bc_connector] depositTokenWithPermit 오류:', error);
        throw error;
    }
};


