import { privateApi as api } from './axiosInstance';

function mapToMyInvestment(item) {

    const product = {};

    return {
        // requestId : item.product.requestId ?? null,
        projectId: item.product.projectId ?? null, //프로젝트아이디
        title: item.product.title ?? null, //제목
        amount: item.product.amount ?? null, //투자금
        deadline: item.product.deadline ?? null, // 마감 기한
        progress: item.product.percent ?? null, //퍼센트
        // views: item.viewCount ?? null, //조회수
        // status: item.status ?? null, // 상태
        // startDate: item.startDate ?? null, //시작일
        endDate: item.product.endDate ?? null, //마감일
        // account: item.account ?? null, //계좌
        DefaultImageUrl: item.image && Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : 'bull.png', //이미지

        investedPrice : item.investedPrice, // 투자금
        tokenQuantity : item.tokenQuantity, // 투자수량
        invStatus : item.invStatus, // 상태


        // investedAmount: item.investedAmount ?? null,
        // tokenQuantity: item.tokenQuantity ?? null,
        content: product.content ?? null, //본문
        summary: product.summary ?? null, //요약
    };
}

function mapToMyProduct(item) {
    return {
        requestId: item.requestId ?? null,
        projectId: item.projectId ?? null,
        title: item.title ?? null,
        amount: item.amount ?? null,
        deadline: item.deadline ?? null,
        progress: item.percent ?? null,
        views: item.viewCount ?? null,
        status: item.status ?? null,
        startDate: item.startDate ?? null,
        endDate: item.endDate ?? null,
        type: item.type ?? null,
    };
}

export async function getMyInvestmentList(options = {}) {
    console.log('[myPage_api] getMyInvestmentList 호출됨');

    try {
        const { signal, ...restOptions } = options;

        const res = await api.get('/market/invest/mylist', { signal, ...restOptions });
        const payload = res.data;
        console.log('getMyInvestment payload확인', payload);

        let list = [];
        if (Array.isArray(payload)) {
            list = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
            list = payload.data;
        } else if (payload.content && Array.isArray(payload.content)) {
            list = payload.content;
        }

        const myInvestments = list.map(mapToMyInvestment);
        return myInvestments;

    } catch (error) {
        console.error('[myPage_api] getMyInvestmentList 오류:', error);
        throw error;
    }
}

export async function getMyProductList(options = {}){
    console.log('[myPage_api] getMyProductList 호출됨');

    try {
        const {signal, ...restOptions} = options;

        const res = await api.get('/product/request/myPage', {signal, ...restOptions});
        const payload = res.data;
        console.log('getMyProductList payload 확인', payload);

        let list = [];
        if (Array.isArray(payload)) {
            list = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
            list = payload.data;
        } else if (payload.content && Array.isArray(payload.content)) {
            list = payload.content;
        }

        const myProducts = list.map(mapToMyProduct);
        return myProducts;
    }catch (error){
        console.log('[myPage_api] getMyProductList 오류', error);
        throw error;
    }
}

// 요청삭제 API
export async function deleteRequest(requestId) {
    console.log(`[myPage_api] deleteProductRequest 호출됨. RequestId: ${requestId}`);

    try {
        const res = await api.post(`/product/request/cancel/${requestId}`);
        console.log(`[myPage_api] deleteProductRequest 응답:`, res.data);
        return res.data;

    } catch (error) {
        console.error(`[myPage_api] deleteProductRequest 오류 (RequestId: ${requestId}):`, error);
        throw error;
    }
}