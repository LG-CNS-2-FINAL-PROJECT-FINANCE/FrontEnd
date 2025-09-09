import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserReports } from '../../../api/report_api';
import useUser from '../../../lib/useUser';
import { useTranslation } from 'react-i18next';

const ReportList = () => {
    const { user } = useUser();

    const { t } = useTranslation();

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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('report_list_title')}</h2>
                <p className="text-gray-600">{t('report_list_loading_message')}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('report_list_title')}</h2>
                <p className="text-red-600">{t('report_list_error_prefix')} {queryError?.message || t('report_list_error_fallback')}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('report_list_title')}</h2>
                <p className="text-gray-500">{t('report_list_login_required')}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('report_list_my_reports_title', { total: total})}</h2>
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="space-y-4">
                    {reports && reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.reportId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{report.reportType} | {t('report_list_project_label')}: {report.projectId}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(report.status)}`}>
                                        {report.status === 'PROCESSED' ? t('report_status_processed') :
                                            report.status === 'PENDING' ? t('report_status_pending') :
                                                report.status === 'REJECTED' ? t('report_status_rejected') :
                                                    report.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 mb-2">
                                    <p><span className="font-medium">{t('report_list_reporter_id_label')}:</span> {report.reportId}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            {t('report_list_no_reports')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportList;