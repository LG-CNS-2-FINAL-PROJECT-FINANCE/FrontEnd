import { privateApi as api } from './axiosInstance';

function mapToUiPost(item) {
    return {
        requestId: item.project_id ?? item.requestId ?? item.id ?? null,
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
                                   page = 1,
                                   size = 20,
                                   type,
                                   q,
                                   startDate,
                                   endDate,
                                   status,
                                   signal,
                                   title,
                               } = {}) {

    console.log('[admin_project_api] getPosts 호출됨. 원본 파라미터:', { page, size, type, q, startDate, endDate, status, title});

    const params = { page, size };
    if (type) {
        params.type = type;
        params.q = q;
    }
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status && status !== 'ALL') params.status = status;
    if (title) params.title = title;

    console.log('[admin_project_api] 서버로 전송될 최종 쿼리 파라미터:', params);

    const res = await api.get('/product/request', { params, signal });
    const payload = res.data;

    let list = [];
    let total = 0;

    if (Array.isArray(payload)) {
        list = payload;
        total = payload.length;
    } else if (payload.posts && Array.isArray(payload.posts)) {
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
    return { posts, total, page, size };
}