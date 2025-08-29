import React from 'react';

const ReportList = ({ reports }) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">신고내역</h2>
            <div className="border border-gray-300 rounded-lg p-6 bg-white">

                
                <div className="space-y-4">
                    {reports && reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        report.status === '처리완료' ? 'bg-green-100 text-green-800' :
                                        report.status === '처리중' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {report.status}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-2">
                                    <p><span className="font-medium">신고 대상:</span> {report.target}</p>
                                    <p><span className="font-medium">신고 사유:</span> {report.reason}</p>
                                </div>
                                
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>신고일: {report.reportDate}</span>
                                    {report.processDate && (
                                        <span>처리일: {report.processDate}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            신고내역이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportList;
