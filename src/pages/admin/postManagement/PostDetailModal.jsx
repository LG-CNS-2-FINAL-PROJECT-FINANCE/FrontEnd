import React, { useState } from 'react';
import { privateApi as api } from '../../../api/axiosInstance';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getPostDetailById } from '../../../api/admin_project_api';

const Spinner = ({ className = 'w-4 h-4 text-white' }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
);

const XIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 10 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 10 0 01-1.414-1.414L8.586 10 4.293 5.707a1 10 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const StatusBadge = ({ status = 'PENDING' }) => {
    const map = {
        APPROVED: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
        REJECTED: 'bg-rose-100 text-rose-700 ring-rose-600/20',
        PENDING: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    };
    const label = status;
    const cls = map[status] || 'bg-slate-100 text-slate-700 ring-slate-600/20';
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
            {label}
        </span>
    );
};

const ActionButton = ({ kind = 'secondary', loading, disabled, onClick, children, icon }) => {
    const variants = {
        approve: disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-700',
        reject: disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-rose-600 text-white hover:bg-rose-700',
        secondary: disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50',
    };

    return (
        <button
            onClick={disabled || loading ? undefined : onClick}
            disabled={disabled || loading}
            className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200
                flex items-center gap-2 min-w-[100px] justify-center
                ${variants[kind]}
            `}
        >
            {loading && <Spinner />}
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

function formatDate(d) {
    if (!d) return null;
    try {
        const date = typeof d === 'number' ? new Date(d) : new Date(d);
        if (isNaN(date.getTime())) return d;
        return dayjs(date).format('YYYY-MM-DD');
    } catch {
        return d;
    }
}

function Field({ label, value, className = '' }) {
    return (
        <div className={className}>
            <div className="space-y-1">
                <div className="text-slate-500 font-medium">{label}</div>
                <div className="text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    {value || '-'}
                </div>
            </div>
        </div>
    );
}

export default function PostDetailModal({ open, onClose, postId, onStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    const {
        data: postDetail,
        isLoading,
        isError,
        error: queryError,
    } = useQuery({
        queryKey: ['postDetail', postId],
        queryFn: async ({ signal }) => getPostDetailById(postId, signal),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    if (!open || !postId) return null;

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

    if (!postDetail) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/60">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <p className="text-rose-600">해당 게시물을 찾을 수 없습니다.</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">닫기</button>
                </div>
            </div>
        );
    }

    const isActionDisabled = postDetail.status === 'APPROVED' || postDetail.status === 'REJECTED';

    const handleAction = async (actionType) => {
        setIsUpdating(true);
        setUpdateError('');
        try {
            const endpoint = actionType === 'approve' ? '/product/request/approve' : '/product/request/reject';

            const requestId = postDetail.requestId;
            if (!requestId) {
                throw new Error('Request ID is missing');
            }

            const payload = { requestId };

            console.log('Sending payload:', payload);
            console.log('Post detail object:', postDetail);

            const api_instance = api;
            await api_instance.post(endpoint, payload);

            onStatusChange(requestId, actionType === 'approve' ? 'APPROVED' : 'REJECTED');
            onClose();
        } catch (e) {
            console.error('게시물 상태 업데이트 실패:', e);
            console.error('Response data:', e?.response?.data);
            setUpdateError(e?.response?.data?.message || '상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsUpdating(false);
        }
    };

    const closeOnBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const titleId = 'post-detail-title';
    const descId = 'post-detail-desc';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-700/60 transition-opacity duration-300"
                onClick={closeOnBackdrop}
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100">

                <div className="bg-red-500 p-6 rounded-t-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-xl font-bold mb-1" id={titleId}>
                                    게시물 상세
                                </h2>
                                <p className="text-rose-100 text-sm">
                                    {postDetail.title || '제목 없음'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={postDetail.status} />
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {updateError && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {updateError}
                        </div>
                    )}

                    <div className="bg-slate-50 p-5 rounded-xl mb-6 border border-slate-200">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">게시물 정보</h3>
                            <div className="text-sm text-slate-500 space-y-1">
                                <div>게시물 번호: {postDetail.requestId}</div>
                                <div>사용자: {postDetail.userNo}</div>
                                {postDetail.goalAmount && <div>목표 금액: {postDetail.goalAmount}</div>}
                                {postDetail.minInvestment && <div>최저 투자금액: {postDetail.minInvestment}</div>}
                                {postDetail.adminId && <div>관리자 ID: {postDetail.adminId}</div>}
                                {postDetail.updateStopReason && <div>정지/수정 사유: {postDetail.updateStopReason}</div>}
                                {postDetail.rejectReason && <div>거절 사유: {postDetail.rejectReason}</div>}
                                {postDetail.files && postDetail.files.length > 0 && (
                                    <div>첨부 파일: {postDetail.files.map(file => (
                                        <a key={file.url} href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">{file.name}</a>
                                    ))}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <Field label="제목" value={postDetail.title} className="col-span-2" />
                            <Field label="시작일자" value={formatDate(postDetail.startDate)} />
                            <Field label="종료일자" value={formatDate(postDetail.endDate)} />
                            <Field label="게시물상태" value={postDetail.status} />
                            <Field label="요청유형" value={postDetail.type} />
                            <Field label="요약" value={postDetail.summary || '요약 없음'} className="col-span-2" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3 justify-center">
                            <ActionButton
                                kind="approve"
                                onClick={() => handleAction('approve')}
                                disabled={isActionDisabled || isUpdating}
                                loading={isUpdating}
                            >
                                승인
                            </ActionButton>

                            <ActionButton
                                kind="reject"
                                onClick={() => handleAction('reject')}
                                disabled={isActionDisabled || isUpdating}
                                loading={isUpdating}
                            >
                                거절
                            </ActionButton>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex justify-end">
                            <ActionButton
                                kind="secondary"
                                onClick={onClose}
                                disabled={isUpdating}
                            >
                                닫기
                            </ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}