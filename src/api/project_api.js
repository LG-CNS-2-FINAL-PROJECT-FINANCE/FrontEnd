import { publicApi, privateApi } from './axiosInstance';

// Helper: choose client based on whether a token exists
function authedGet(url, options = {}) {
    const token = localStorage.getItem('accessToken');
    return token ? privateApi.get(url, options) : publicApi.get(url, options);
}

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
//        state: item.projectStatus ?? item.status ?? null,        // 창작물 상태
//        visiblity: item.projectVisibility ?? null, //프로젝트 가시성
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
    try {
        const { signal, ...restOptions } = options;
        const res = await authedGet('/product', { signal, ...restOptions });

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
export async function getInvestmentsDetail(url,projectId, options = {}){
    try{

        const res = await authedGet(`${url}/${projectId}`, options);

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

        // ✅ Map favorite flag robustly - handle different response formats
        detail.isFavorite = payload.favorite ?? payload.isFavorited ?? payload.favorited ?? false;
        detail.isInvested = payload.isInvested ?? false; // 투자 여부
        detail.tokenPrice = payload.tradePrice ?? null; // 토큰 가격 -> 이건 고민해봐야함 여기서 불러올지 아니면 다른 곳에서 불러올지

        return detail;

    } catch (error){
        console.error(`[project_api] getInvestmentsDetail 오류(ID -> ${projectId}):`, error);
        throw error;
    }
}


export const getProjectsRankingByAmount = async() =>{
    try {
        const res = await publicApi.get('/product/ranking/amount');
        return res.data;
    } catch (error) {
        console.error('[project_api] getProjectsRankingByAmount 오류:', error);
        throw error;
    }
}

export const getProjectsRankingByView = async() =>{
    try {
        const res = await publicApi.get('/product/ranking/view');
        return res.data;
    } catch (error) {
        console.error('[project_api] getProjectsRankingByView 오류:', error);
        throw error;
    }
}

function mapToAdminPostListItem(item) {
    return {
        requestId: item.projectId ?? item.requestId ?? item.id ?? null, // 요청 ID 또는 게시물 ID
        userNo: item.user_seq ?? item.userSeq ?? item.userId ?? null,   // 사용자 번호
        startDate: item.start_date ?? item.startDate ?? null,           // 시작일
        endDate: item.end_date ?? item.endDate ?? null,                 // 마감일
        status: item.status ?? item.postStatus ?? null,                 // 게시물 상태
        type: item.type ?? null,                                        // 게시물 유형 (CREATOR 등)
        title: item.title ?? null,                                      // 제목
        summary: item.summary ?? null,                                  // 요약
        state: item.projectStatus ?? item.status ?? null,        // 창작물 상태
        visiblity: item.projectVisibility ?? null, //프로젝트 가시성
    };
}

//관리자용 product 게시물 관리
export const getAdminProductList = async(options = {}) => {
    console.log('[project_api] getAdminProductList 호출됨');
    const { signal, ...restOptions } = options;

    try {
        const params = { /*page, size,*/ ...restOptions };

        const res = await privateApi.get('/product/list', { params, signal });
        const payload = res.data;

        let list = [];
        let total = 0;

        if (Array.isArray(payload)) {
            list = payload;
            total = payload.length;
        } else if (payload.content && Array.isArray(payload.content)) {
            list = payload.content;
            total = payload.totalElements ?? payload.total ?? payload.size ?? payload.count ?? list.length;
        } else if (payload.data && Array.isArray(payload.data)) {
            list = payload.data;
            total = payload.total ?? list.length;
        }

        const adminProducts = list.map(mapToAdminPostListItem);
        return { posts: adminProducts, total };

    } catch (error){
        console.error('[project_api] getAdminProductList 오류:', error);
        throw error;
    }
}