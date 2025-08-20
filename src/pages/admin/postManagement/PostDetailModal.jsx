import React, { useState, useEffect } from 'react';
import { privateApi as api } from '../../../api/axiosInstance';
import dayjs from 'dayjs';

export default function PostDetailModal({ open, onClose, post, onStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [open, onClose]);

    if (!open || !post) return null;

    const isActionDisabled = post.status === 'APPROVED' || post.status === 'REJECTED';

    const handleAction = async (actionType) => {
        setIsUpdating(true);
        setUpdateError('');
        try {
            const endpoint = actionType === 'approve' ?
                '/product/request/approve' :
                '/product/request/reject';

            const payload = { requestId: post.requestId };

            await api.post(endpoint, payload);

            onStatusChange(post.requestId, actionType === 'approve' ? 'APPROVED' : 'REJECTED');
        } catch (e) {
            console.error('게시물 상태 업데이트 실패:', e);
            setUpdateError(e?.response?.data?.message || '상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsUpdating(false);
            if (!updateError) {
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        게시물 상세: {post.title || '제목 없음'}
                    </h2>
                </div>

                <div className="p-6">
                    {updateError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            {updateError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <strong>게시물번호:</strong> {post.requestId}
                        </div>
                        <div>
                            <strong>사용자번호:</strong> {post.userNo}
                        </div>
                        <div className="col-span-2">
                            <strong>제목:</strong> {post.title}
                        </div>
                        <div>
                            <strong>시작일자:</strong> {formatDate(post.startDate)}
                        </div>
                        <div>
                            <strong>종료일자:</strong> {formatDate(post.endDate)}
                        </div>
                        <div>
                            <strong>게시물상태:</strong> {post.status}
                        </div>
                        <div className="col-span-2">
                            <strong>요약:</strong> {post.summary || '요약 없음'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => handleAction('approve')}
                        disabled={isActionDisabled || isUpdating} // << 이제 isActionDisabled에 접근 가능
                        className={`px-4 py-2 mr-2 rounded text-white ${
                            isActionDisabled ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isUpdating ? '승인 중...' : '승인'}
                    </button>
                    <button
                        onClick={() => handleAction('reject')}
                        disabled={isActionDisabled || isUpdating} // << 이제 isActionDisabled에 접근 가능
                        className={`px-4 py-2 mr-2 rounded text-white ${
                            isActionDisabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {isUpdating ? '거절 중...' : '거절'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatDate(d) {
    if (!d) return null;
    try {
        const date = typeof d === 'number' ? new Date(d) : new Date(d);
        if (isNaN(date.getTime())) return d;
        return dayjs(date).format('YYYY-MM-DD');
    } catch (e) {
        return d;
    }
}