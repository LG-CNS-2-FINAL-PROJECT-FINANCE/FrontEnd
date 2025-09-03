import { privateApi } from './axiosInstance';

function mapReport(item) {
    return {
        reportNo: item.reportNo ?? null,            //신고번호
        projectId: item.projectId ?? null,          //프로젝트번호
        reportId: item.reportId ?? null,            //신고자ID
        writerId: item.writerId ?? null,            //작성자ID
        reportType: item.reportType ?? null,        //신고유형
        status: item.status ?? null,                //처리상태

        //이 밑에꺼는 detail에서 사용
        content: item.content ?? null,              // 신고 내용
    };
}

export async function getReports(options = {}) {
    console.log('[report_api] getReports 호출됨');
    const { signal, ...restOptions } = options;

    try {
        const params = { ...restOptions };

        const res = await privateApi.get('/monitoring/report', { params, signal });
        const payload = res.data;

        let list = [];
        let total = 0;

        if (Array.isArray(payload)) {
            list = payload;
            total = payload.length;
        } else if (payload.content && Array.isArray(payload.content)) {
            list = payload.content;
            total = payload.totalElements ?? payload.total ?? list.length;
        } else if (payload.data && Array.isArray(payload.data)) {
            list = payload.data;
            total = payload.total ?? list.length;
        }

        const reports = list.map(mapReport);
        return { reports, total };

    } catch (error) {
        console.error('[report_api] getReports 오류:', error);
        throw error;
    }
}