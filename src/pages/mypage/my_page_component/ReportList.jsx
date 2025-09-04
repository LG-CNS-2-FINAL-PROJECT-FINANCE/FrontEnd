import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserReports } from '../../../api/report_api';
import useUser from '../../../lib/useUser';
import dayjs from 'dayjs';
s
const ReportList = () => {
    const { user } = useUser();

    const {
        data: fetchedData,
        isLoading: isQueryLoading,
        isError,
        error: queryError,
    } = useQuery({
        queryKey: ['userReports', user?.email],
        queryFn: async ({ signal }) => {
            return getUserReports({ signal });
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 1,
    });

    const reports = fetchedData?.reports || [];
    const total = fetchedData?.total ?? 0;

    const overallLoading = isQueryLoading;

    const getStatusClasses = (status) => {
        const displayStatus = status === 'PROCESSED' ? 'bg-green-100 text-green-800' :
            status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800';
        return displayStatus;
    };

    if (overallLoading) {
        return (
            <div className="w-full text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">신고내역</h2>
                <p className="text-gray-600">신고 내역을 불러오는 중...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">신고내역</h2>
                <p className="text-red-600">오류가 발생했습니다: {queryError?.message || '신고 목록을 불러올 수 없습니다.'}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">신고내역</h2>
                <p className="text-gray-500">로그인이 필요한 서비스입니다.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">나의 신고내역 ({total}건)</h2>
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="space-y-4">
                    {reports && reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.reportId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{report.reportType} | 프로젝트: {report.projectId}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(report.status)}`}>
                                        {report.status === 'PROCESSED' ? '처리완료' :
                                            report.status === 'PENDING' ? '처리중' :
                                                report.status === 'REJECTED' ? '처리거절' :
                                                    report.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 mb-2">
                                    <p><span className="font-medium">신고자 ID:</span> {report.reportId}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            신고내역이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportList;