import { publicApi as api } from './axiosInstance';

function mapToInvestmentCardData(item) {
    return {
        requestId: item._id ?? item.projectId ?? item.requestId ?? item.id ?? `unique-temp-${Math.random()}`,       // 창작물 번호
        userSeq: item.userSeq ?? null,           // 사용자 번호
        title: item.title ?? null,               // 제목
        amount: item.amount ?? null,             // 모금액
        startDate: item.startDate ?? null, //시작일
        endDate: item.endDate ?? null, //종료일
        deadline: item.deadline,      // 마감기간
        percent: item.percent,    // 달성률
        document: item.document && item.document.length > 0 ? item.document[0].url : 'default_image.jpg', // 이미지파일
        viewCount: item.viewCount,          // 조회수
        state: item.state        // 창작물 상태
    };
}

export async function getInvestments(options = {}) {
    console.log('[project_api] getInvestments 호출됨.');
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
        // 다른 페이로드 구조가 있다면 여기에 추가

        const investments = list.map(mapToInvestmentCardData);
        return investments;
    } catch (error) {
        console.error('[project_api] getInvestments 오류:', error);
        throw error;
    }
}