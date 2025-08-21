import { publicApi as api } from './axiosInstance';

function mapToInvestmentCardData(item) {
    return {
        requestId: item._id ?? item.projectId ?? item.requestId ?? item.id ?? `unique-temp-${Math.random()}`,       // 창작물 번호
        userSeq: item.userSeq ?? null,           // 사용자 번호
        title: item.title ?? null,               // 제목
        amount: item.amount ?? null,             // 모금액
        startDate: item.startDate ?? null, //시작일
        endDate: item.endDate ?? null, //종료일
        deadline: item.deadline ?? null,      // 마감기간
        percent: item.percent ?? null,    // 달성률
        image: item.image && item.image.length > 0 ? item.image[0].url : 'default_image.jpg', // 이미지파일
        document: item.document ?? null, //문서 파일
        viewCount: item.viewCount ?? null,          // 조회수
        state: item.status ?? null,        // 창작물 상태
        summary: item.summary ?? null, //요약
        content: item.content ?? null, //등록 설명
        minInvestment: item.minInvestment, //최소금액
        account: item.account, //계좌번호
        favorites: item.favorites, //좋아요 유무 -> userSeq가 담김


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
        // 다른 페이로드 구조가 있다면 여기에 추가

        const investments = list.map(mapToInvestmentCardData);
        return investments;
    } catch (error) {
        console.error('[project_api] getInvestments 오류:', error);
        throw error;
    }
}

//investmentDetail에 사용
export async function getInvestmentsDetail(option = {}){
    console.log('[project_api] getInvestmentsDetail 호출됨');

    try{

    } catch (error){
        console.error('[project_api] getInvestmentsDetail 오류:', error);
        throw error;
    }
}