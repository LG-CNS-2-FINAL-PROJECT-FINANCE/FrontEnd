import {privateApi as api} from './axiosInstance';

function mapToMyFavorite(item){

    const product = {};

    return {
        projectId: item.projectId ?? null, //프로젝트아이디
        title: item.title ?? null, //제목
        amount: item.amount ?? null, //투자금
        deadline: item.deadline ?? null, // 마감 기한
        progress: item.percent ?? null, //퍼센트
        startDate: item.startDate ?? null, //시작일
        endDate: item.endDate ?? null, //마감일
        content: item.content ?? null, //본문
        summary: item.summary ?? null, //요약
    }

}

export async function getMyFavoriteList(options = {}){
    console.log('[favorite_api] getMyFavorite 호출됨');

    try {
        const { signal, ...restOptions } = options;

        const res = await api.get('/product/favorite/me', { signal, ...restOptions });
        const payload = res.data;
        console.log('getFavorite payload확인', payload)

        let list = [];
        if (Array.isArray(payload)) {
            list = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
            list = payload.data;
        } else if (payload.content && Array.isArray(payload.content)) {
            list = payload.content;
        }

        const myFavorite = list.map(mapToMyFavorite);
        return myFavorite;

    } catch (error) {
        console.error('[favorite_api] getMyInvestmentList 오류:', error);
        throw error;
    }
}