import { publicApi as api } from './axiosInstance';

function mapToInvestmentCardData(item) {
    return {
        projectId: item._id ?? item.projectId ?? item.requestId ?? item.id ?? `unique-temp-${Math.random()}`,       // 창작물 번호
        // id: item._id ?? item.projectId ?? item.requestId ?? item.id ?? `unique-temp-${Math.random()}`,
        userSeq: item.userSeq ?? null,           // 사용자 번호
        title: item.title ?? null,               // 제목
        amount: item.amount ?? null,             // 모금액
        startDate: item.startDate ?? null, //시작일
        endDate: item.endDate ?? null, //종료일
        deadline: item.deadline ?? null,      // 마감기간
        percent: item.percent ?? null,    // 달성률
        DefaultImageUrl: item.image && Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : 'bull.png', // 이미지파일 첫 번째 파일
        imageUrl: item.image && Array.isArray(item.image) && item.image.length > 0 ? item.image : [], // 이미지파일 모든 파일
        document: item.document ?? null, //문서 파일
        viewCount: item.viewCount ?? null,          // 조회수
        state: item.status ?? null,        // 창작물 상태
        summary: item.summary ?? null, //요약
        content: item.content ?? null, //등록 설명
        goalAmount: item.goalAmount ?? null, //목표 금액
        minInvestment: item.minInvestment, //최소금액
        account: item.account, //계좌번호
        // favorites: item.favorites, //좋아요 유무 -> userSeq가 담김 현재 사용X


    };
}

//investmentList에 사용
export async function getInvestments(options = {}) {
    console.log('[project_api] getInvestments 호출됨');

    try {
        const { signal, ...restOptions } = options;
        const res = await api.get('/product', { signal, ...restOptions });

        const payload = res.data;

        let list = [];
        if (Array.isArray(payload)) { // 서버가 직접 배열을 반환하는 경우
            list = payload;
        } else if (payload.posts && Array.isArray(payload.posts)) { // 서버가 { posts: [] } 형태로 반환하는 경우
            list = payload.posts;
        } else if (payload.data && Array.isArray(payload.data)) { // 서버가 { data: [] } 형태로 반환하는 경우
            list = payload.data;
        }

        const investments = list.map(mapToInvestmentCardData);
        return investments;
    } catch (error) {
        console.error('[project_api] getInvestments 오류:', error);
        throw error;
    }
}

//investmentDetail에 사용
export async function getInvestmentsDetail(projectId, options = {}){
    console.log(`[project_api] getInvestmentsDetail 호출됨. ID: ${projectId}`);

    try{
        const res = await api.get(`/product/${projectId}`, options);
        const payload = res.data;

        const detail = mapToInvestmentCardData(payload);

        detail.projectNumber = detail.projectId;
        detail.author = detail.userSeq;
        detail.currentAmount = detail.amount;
        // detail.minInvestment = detail.minInvestment;
        detail.targetAmount = detail.goalAmount; // 목표 금액
        detail.progress = detail.percent; // 진행률
        detail.description = payload.content; // 상세 설명

        // detail.files = payload.document; // 첨부 파일
        if (Array.isArray(payload.document)) {
            detail.files = payload.document.map(urlStr => {
                const fileName = urlStr.split('/').pop();
                return { name: fileName, url: urlStr };
            });
        } else if (typeof payload.document === 'string' && payload.document.length > 0) {
            const fileNameFromUrl = payload.document.split('/').pop();
            detail.files = [{ name: fileNameFromUrl, url: payload.document }];
        } else {
            detail.files = [];
        }

        detail.isFavorite = payload.isFavorite ?? false; // 좋아요 여부
        detail.isInvested = payload.isInvested ?? false; // 투자 여부
        detail.tokenPrice = payload.tokenPrice ?? null; // 토큰 가격 -> 이건 고민해봐야함 여기서 불러올지 아니면 다른 곳에서 불러올지

        return detail;

    } catch (error){
        console.error('[project_api] getInvestmentsDetail 오류(ID -> ${id}):', error);
        throw error;
    }
}