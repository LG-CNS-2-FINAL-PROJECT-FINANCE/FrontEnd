import { privateApi } from "./axiosInstance";

function mapReport(item) {
    return {
        reportNo: item.reportNo ?? null,            //신고번호
        projectId: item.projectId ?? null,          //프로젝트번호
        title: item.title ?? null,                  //제목
        reportId: item.reportId ?? null,            //신고자ID
        reportNickname: item.reportNickname ?? null,//신고자닉네임
        writerId: item.writerId ?? null,            //작성자ID
        writerNickname: item.writerNickname ?? null,//작성자닉네임
        reportType: item.reportType ?? null,        //신고유형
        status: item.status ?? null,                //처리상태


        //이 밑에꺼는 detail에서 사용
        content: item.content ?? null,              // 신고 내용
        processContent: item.processContent ?? null,// 처리 결과




    };
}


// 신고하기 API
export const createReport = async (reportData) => {
    try {
        const response = await privateApi.post('/monitoring/report', reportData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//신고 전체 조회
export async function getReports(options = {}) {
    console.log('[report_api] getReports 호출됨');
    const { signal, ...restOptions } = options;

    try {
        const params = { ...restOptions };

        const res = await privateApi.get('/monitoring/report/admin/list', { params, signal });
        const payload = res.data;
        console.log("payload확인", payload)

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

// 신고 상세 조회
export async function getReportDetail(reportNo, options = {}) {
    console.log(`[report_api] getReportDetail 호출됨. ReportNo: ${reportNo}`);
    const { signal } = options;

    try {
        const res = await privateApi.get(`/monitoring/report/admin/${reportNo}`, { signal });
        const payload = res.data;
        console.log("reportdetail payload 확인", payload)

        const reportDetail = mapReport(payload);
        return reportDetail;

    } catch (error) {
        if (error.name === 'CanceledError') {
            console.info(`[report_api] getReportDetail 쿼리 취소됨 (ReportId: ${reportNo})`, error);
        } else {
            console.error(`[report_api] getReportDetail 오류 (ReportNo: ${reportNo}):`, error);
        }
        throw error;
    }
}

// 개인 신고 목록 조회
export async function getUserReports(options = {}) {
    console.log('[report_api] getUserReports 호출됨');
    const { signal, ...restOptions } = options;

    try {
        const params = { ...restOptions };
        const res = await privateApi.get('/monitoring/writer/list', { params, signal });
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
        if (error.name === 'CanceledError') {
            console.info('[report_api] getUserReports 쿼리 취소됨:', error.message);
        } else {
            console.error('[report_api] getUserReports 오류:', error);
        }
        throw error;
    }
}


//상세조회 /report/writer/{reportNo}

