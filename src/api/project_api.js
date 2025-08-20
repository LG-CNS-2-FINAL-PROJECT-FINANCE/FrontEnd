import { publicApi as api } from './axiosInstance';

function mapToInvestmentCardData(item) {
    return {
        requestId: item.requestId ?? null,       // 창작물 번호
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