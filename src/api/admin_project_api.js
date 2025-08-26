import { privateApi as api } from './axiosInstance';

function mapToUiPost(item) {
    return {
        requestId: item.projectId ?? item.requestId ?? item.id ?? null,
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