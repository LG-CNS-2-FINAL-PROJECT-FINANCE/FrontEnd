import { privateApi as api } from './axiosInstance';

function mapToMyInvestment(item) {
    return {
        projectId: item.projectId ?? null, //프로젝트아이디
        title: item.title ?? null, //제목
        amount: item.amount ?? null, //투자금
        deadline: item.deadline ?? null, // 마감 기한
        progress: item.percent ?? null, //퍼센트
        // views: item.viewCount ?? null, //조회수
        // status: item.status ?? null, // 상태
        // startDate: item.startDate ?? null, //시작일
        endDate: item.endDate ?? null, //마감일
        // account: item.account ?? null, //계좌

        investedPrice : item.investedPrice, // 투자금
        tokenQuantity : item.tokenQuantity, // 투자수량
        invStatus : item.invStatus, // 상태


        // investedAmount: item.investedAmount ?? null,
        // tokenQuantity: item.tokenQuantity ?? null,
        content: item.content ?? null, //본문
        summary: item.summary ?? null, //요약
    };
}

export async function getMyInvestmentList(options = {}) {
    console.log('[myPage_api] getMyInvestmentList 호출됨');

    try {
        const { signal, ...restOptions } = options;

        const res = await api.get('/market/invest/mylist', { signal, ...restOptions });
        const payload = res.data;
        console.log('payload확인', payload)

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