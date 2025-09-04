import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getReportDetail } from '../../../api/report_api';

const Spinner = ({ className = 'w-4 h-4 text-white' }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
);

/*const StatusBadge = ({ status = 'PENDING' }) => {
    const map = {
        PROCESSED: 'bg-green-100 text-green-700 ring-green-600/20', // 처리 완료
        PENDING: 'bg-amber-100 text-amber-800 ring-amber-600/20',  // 대기 중
        REJECTED: 'bg-red-100 text-red-700 ring-red-600/20',     // 거절/기각
    };
    const label = status;
    const cls = map[status] || 'bg-slate-100 text-slate-700 ring-slate-600/20';
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
            {label}
        </span>
    );
};*/

function Field({ label, value, className = '' }) {
    return (
        <div className={className}>
            <div className="space-y-1">
                <div className="text-slate-500 font-medium">{label}</div>
                <div className="text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 break-words whitespace-pre-wrap"> {/* 줄바꿈, 긴 텍스트 처리 */}
                    {value || '-'}
                </div>
            </div>
        </div>
    );
}

export default function ReportDetailModal({ open, onClose, reportNo }) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    const {
        data: reportDetail,
        isLoading,
        isError,
        error: queryError,
    } = useQuery({
        queryKey: ['reportDetail', reportNo],
        queryFn: async ({ signal }) => getReportDetail(reportNo, { signal }),
        enabled: !!reportNo,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // 배경 스크롤 방지
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);


    if (!open || !reportId) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/60">
                <Spinner className="w-8 h-8 text-white" />
                <p className="ml-2 text-white">데이터 로딩 중...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/60">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <p className="text-rose-600">오류 발생: {queryError?.message || '상세 정보를 불러올 수 없습니다.'}</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">닫기</button>
                </div>
            </div>
        );
    }

    if (!reportDetail) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/60">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <p className="text-rose-600">해당 신고 내역을 찾을 수 없습니다.</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">닫기</button>
                </div>
            </div>
        );
    }

    const closeOnBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-700/60 transition-opacity duration-300"
                onClick={closeOnBackdrop}
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100
                            max-h-[90vh] overflow-y-auto hide-scrollbar">

                <div className="bg-red-500 p-6 rounded-t-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-xl font-bold mb-1">
                                    신고 상세 정보
                                </h2>
                                <p className="text-rose-100 text-sm">
                                    신고번호: {reportDetail.reportNo}
                                </p>
                            </div>
                        </div>
                        {/*<div className="flex items-center gap-3">
                            <StatusBadge status={reportDetail.status} />
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>*/}
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-slate-50 p-5 rounded-xl mb-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">기본 정보</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <Field label="신고번호" value={reportDetail.reportNo} />
                            <Field label="프로젝트번호" value={reportDetail.projectId} />
                            <Field label="신고자 ID" value={reportDetail.reportId} />
                            <Field label="작성자 ID" value={reportDetail.writerId} />
                            <Field label="신고 유형" value={reportDetail.reportType} />
                        </div>

                        {reportDetail.content && (
                            <div className="mb-4">
                                <Field label="신고 내용" value={reportDetail.content} className="col-span-2" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="pt-4 border-t border-slate-200 flex justify-end">
                            <button
                                kind="secondary"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 bg-white text-slate-600 border border-slate-300 hover:bg-slate-50" // ActionButton 직접 클래스 삽입
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}