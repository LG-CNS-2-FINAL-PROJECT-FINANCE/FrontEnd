import { privateApi as api } from './axiosInstance';

function mapToUiPost(item) {
    return {
        requestId: item.requestId ?? item.id ?? null,
        userNo: item.user_seq ?? item.userSeq ?? item.userId ?? null,
        startDate: item.start_date ?? item.startDate ?? null,
        endDate: item.end_date ?? item.endDate ?? null,
        status: item.status ?? item.postStatus ?? null,
        type: item.type ?? null,
        title: item.title ?? null,
        summary: item.summary ?? null,
    };
}

export async function getPosts({
                                   // page = 1,
                                   // size = 10,
                                    searchBy,
                                    keyword,
                                    requestType,
                                    requestStatus,
                                    startDate,
                                    endDate,
                                    signal,
                                } = {}) {

    console.log('[admin_project_api] getPosts 호출됨. 원본 파라미터:', {  searchBy, keyword, requestType, startDate, endDate, requestStatus});

    const params = {};
    if (searchBy && keyword) {
        params.searchBy = searchBy;
        params.keyword = keyword;
    }

    if (requestType && requestType !== 'ALL') {
        params.type = requestType;
    }

    if (requestStatus && requestStatus !== 'ALL') {
        params.status = {
            'APPROVED': 'APPROVED',
            'REJECTED': 'REJECTED',
            'PENDING': 'PENDING',
        }[requestStatus];
        if (!params.status) {
            console.warn(`[admin_project_api] Unknown status for API mapping: ${requestStatus}`);
        }
    }

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    console.log(`[admin_project_api] 요청될 전체 URL: ${api.defaults.baseURL}/product/search/admin?${new URLSearchParams(params).toString()}`);

    const res = await api.get('/product/search/admin', { params, signal });
    const payload = res.data;
    console.log("현재 getPosts 매소드 get요청 작동", res);

    let list = [];
    let total = 0;

    if (Array.isArray(payload)) {
        list = payload;
        total = payload.length;
    } else if (payload.content && Array.isArray(payload.content)) {
        list = payload.content;
        total = payload.totalElements ?? payload.total ?? payload.size ?? payload.count ?? list.length;
    } else if (payload.posts && Array.isArray(payload.posts)) {
        list = payload.posts;
        total = payload.total ?? payload.count ?? list.length;
    } else if (payload.data && Array.isArray(payload.data)) {
        list = payload.data;
        total = payload.total ?? list.length;
    } else { // 5. 그 외의 경우
        list = [];
        total = 0;
    }

    const posts = list.map(mapToUiPost);
    return { posts, total };
}

export async function getPostsList({ page=1, size=10, signal } = {}) {
    console.log('[admin_project_api] getPostsList 호출됨. 원본 파라미터:', { page, size });

    const params = { page, size };

    const res = await api.get('/product/request', { params, signal });
    const payload = res.data;

    console.log("현재 getPostsList 매소드 get요청 작동", res);

    let list = [];
    let total = 0;

    if (Array.isArray(payload)) {
        list = payload;
        total = payload.length;
    } else if (payload.content && Array.isArray(payload.content)) {
        list = payload.content;
        total = payload.totalElements ?? payload.total ?? payload.size ?? payload.count ?? list.length;
    }
    else if (payload.posts && Array.isArray(payload.posts)) {
        list = payload.posts;
        total = payload.total ?? payload.count ?? list.length;
    } else if (payload.data && Array.isArray(payload.data)) {
        list = payload.data;
        total = payload.total ?? list.length;
    } else {
        list = [];
        total = 0;
    }

    const posts = list.map(mapToUiPost);
    return { posts, total};
}

function mapToPostDetail(item) {
    return {
        requestId: item.requestId ?? item.id?? null, //요청번호
        userNo: item.userSeq ?? item.user_seq ?? item.userId ?? null, //작성자id
        projectId: item.projectId ?? null, //창작물 번호
        title: item.title ?? null, //제목
        summary: item.summary ?? null, //요약
        startDate: item.startDate ?? item.start_date ?? null, //시작일
        endDate: item.endDate ?? item.end_date ?? null, //마감일
        goalAmount: item.goalAmount ?? null, //목표금액
        minInvestment: item.minInvestment ?? null, //최저투자금액
        files: item.document && Array.isArray(item.document) 
            ? item.document
                .filter(url => url && typeof url === 'string' && url.trim() !== '') // Filter out empty/invalid URLs
                .map(url => ({ 
                    name: url.split('/').pop() || 'Unknown File', 
                    url: url.trim() 
                })) 
            : [], //파일
        images: item.image && Array.isArray(item.image) 
            ? item.image
                .filter(url => url && typeof url === 'string' && url.trim() !== '') // Filter out empty/invalid URLs
                .map(url => ({ 
                    name: url.split('/').pop() || 'Unknown Image', 
                    url: url.trim() 
                })) 
            : [], //이미지
        imageUrl: item.image && Array.isArray(item.image) && item.image.length > 0 
            ? item.image.find(url => url && typeof url === 'string' && url.trim() !== '') 
            : null, //단일 이미지 URL (기존 호환성)
        updateStopReason: item.reason ?? null, //사유 (update, stop)
        type: item.type ?? null, //창작물 유형
        status: item.status ?? item.postStatus ?? null, //창작물 상태 (status) - APPROVED, PENDING, REJECTED
        adminId: item.adminId ?? null, //관리자ID
        rejectReason: item.rejectReason ?? null, //사유 (reject)

        content: item.content ?? null, // 상세 설명
        viewCount: item.viewCount ?? null, // 조회수
        amount: item.amount ?? null, // 현재 모금액
    };
}

export async function getPostDetailById(requestId, signal) {
    console.log(`[admin_project_api] getPostDetailById 호출됨. requestId: ${requestId}`);
    try {
        const res = await api.get(`/product/request/${requestId}`, { signal });
        const payload = res.data; // 상세 정보는 content 필드 없이 단일 객체로 올 것으로 예상

        // 받은 payload를 mapToPostDetail을 통해 프론트엔드에서 사용하기 쉽게 매핑
        const postDetail = mapToPostDetail(payload);
        return postDetail;

    } catch (error) {
        console.error(`[admin_project_api] getPostDetailById 오류 (requestId: ${requestId}):`, error);
        throw error;
    }
}

//게시물 숨김처리
export async function togglePostHoldStatus(projectId, adminId, holdReason) {
    console.log(`[admin_project_api] togglePostHoldStatus 호출됨. ProjectId: ${projectId}, AdminId: ${adminId}`);

    const payload = {
        // adminId: adminId,
        holdReason: holdReason
    };

    try {
        const res = await api.post(`/product/request/hold/toggle/${projectId}`, payload);
        console.log(`[admin_project_api] togglePostHoldStatus 응답:`, res.data);
        return res.data;

    } catch (error) {
        console.error(`[admin_project_api] togglePostHoldStatus 오류 (ProjectId: ${projectId}):`, error);
        throw error;
    }
}
