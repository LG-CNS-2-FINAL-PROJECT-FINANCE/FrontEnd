import React, { useState, useEffect, useContext } from 'react';
import { privateApi as api } from '../../../api/axiosInstance';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getPostDetailById } from '../../../api/admin_project_api';
import CopyIcon from '../../../component/CopyIcon';
import PostHoldModal from './PostHoldModal';
import {AuthContext} from "../../../context/AuthContext";

const Spinner = ({ className = 'w-4 h-4 text-white' }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
);

const StatusBadge = ({ status = 'PENDING' }) => {
    const map = {
        APPROVED: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
        REJECTED: 'bg-rose-100 text-rose-700 ring-rose-600/20',
        PENDING: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    };
    const cls = map[status] || 'bg-slate-100 text-slate-700 ring-slate-600/20';
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
            {status}
        </span>
    );
};

const ActionButton = ({ kind = 'secondary', loading, disabled, onClick, children }) => {
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
    const [copiedMessage, setCopiedMessage] = useState({ show: false, text: '' });
    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);

    const { user: authUser } = useContext(AuthContext);

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

    const handleCopy = (text, fieldName) => {
        setCopiedMessage({ show: true, text: `${fieldName} 복사 완료!` });
        // 일정 시간 후 메시지 숨김
        setTimeout(() => {
            setCopiedMessage({ show: false, text: '' });
        }, 1500); // 1.5초 후 사라짐
    };

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
    
    // Check if there are invalid files/images that would cause AWS SDK errors
    const hasInvalidFiles = (postDetail.files && postDetail.files.some(file => 
        !file.url || file.url.trim() === '' || !file.name || file.name.trim() === ''
    )) || (postDetail.images && postDetail.images.some(image => 
        !image.url || image.url.trim() === '' || !image.name || image.name.trim() === ''
    ));
    
    const isApprovalDisabled = isActionDisabled || (postDetail.type === 'STOP' && hasInvalidFiles);

    const handleAction = async (actionType) => {
        setIsUpdating(true);
        setUpdateError('');
        try {
            const endpoint = actionType === 'approve' ? '/product/request/approve' : '/product/request/reject';

            const requestId = postDetail.requestId;
            if (!requestId) {
                throw new Error('Request ID is missing');
            }

            // Check for problematic files/images before proceeding with approval
            if (actionType === 'approve' && ((postDetail.files && postDetail.files.length > 0) || (postDetail.images && postDetail.images.length > 0))) {
                const invalidFiles = postDetail.files ? postDetail.files.filter(file => 
                    !file.url || file.url.trim() === '' || !file.name || file.name.trim() === ''
                ) : [];
                
                const invalidImages = postDetail.images ? postDetail.images.filter(image => 
                    !image.url || image.url.trim() === '' || !image.name || image.name.trim() === ''
                ) : [];
                
                if (invalidFiles.length > 0 || invalidImages.length > 0) {
                    setUpdateError('파일/이미지 처리 중 오류가 발생했습니다. 일부 첨부 파일이나 이미지에 문제가 있어 승인할 수 없습니다. 백엔드 관리자에게 문의하세요.');
                    return;
                }
            }

            const payload = { requestId };

            await api.post(endpoint, payload);

            onStatusChange(requestId, actionType === 'approve' ? 'APPROVED' : 'REJECTED');
            onClose();
        } catch (e) {
            // Provide specific error message for AWS SDK errors
            let errorMessage = '상태 업데이트에 실패했습니다. 다시 시도해주세요.';
            if (e?.response?.status === 500 && e?.response?.data?.message?.includes('Key cannot be empty')) {
                errorMessage = '파일 처리 중 AWS 오류가 발생했습니다. 첨부 파일에 문제가 있을 수 있습니다. 백엔드 관리자에게 문의하세요.';
            } else if (e?.response?.data?.message) {
                errorMessage = e.response.data.message;
            }
            
            setUpdateError(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const closeOnBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleOpenHoldModal = () => {
        setIsHoldModalOpen(true);
    };

    const handleCloseHoldModal = () => {
        setIsHoldModalOpen(false);
        onClose();
        onStatusChange();
    };


    const titleId = 'post-detail-title';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-700/60 transition-opacity duration-300"
                onClick={closeOnBackdrop}
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto scrollbar-hide">

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

                    {/* Warning for STOP requests with file/image issues */}
                    {postDetail.type === 'STOP' && ((postDetail.files && postDetail.files.some(file => !file.url || file.url.trim() === '')) || 
                    (postDetail.images && postDetail.images.some(image => !image.url || image.url.trim() === ''))) && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            이 중단 요청에는 문제가 있는 첨부 파일이나 이미지가 포함되어 있습니다. 승인 시 오류가 발생할 수 있습니다.
                        </div>
                    )}

                    {copiedMessage.show && (
                        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm text-center animate-pulse">
                            {copiedMessage.text}
                        </div>
                    )}

                    <div className="bg-slate-50 p-5 rounded-xl mb-6 border border-slate-200">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">게시물 정보</h3>
                                {/*<button
                                    onClick={handleOpenHoldModal}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm hover:bg-slate-300 transition-colors"
                                >
                                    숨김 처리
                                </button>*/}
                            </div>
                            <div className="text-sm text-slate-500 space-y-1">
                                <div className="flex items-center">
                                    <span>게시물 번호: {postDetail.requestId}</span>
                                    <CopyIcon textToCopy={postDetail.requestId} onCopySuccess={() => handleCopy(postDetail.requestId, '게시물 번호')} />
                                </div>
                                <div className="flex items-center">
                                    <span>사용자번호: {postDetail.userNo}</span>
                                    <CopyIcon textToCopy={postDetail.userNo} onCopySuccess={() => handleCopy(postDetail.userNo, '사용자 번호')} />
                                </div>
                                <div className="flex items-center">
                                    <span>닉네임: {postDetail.nickname}</span>
                                    <CopyIcon textToCopy={postDetail.nickname} onCopySuccess={() => handleCopy(postDetail.nickname, '닉네임')} />
                                </div>
                                {postDetail.goalAmount && <div>목표 금액: {postDetail.goalAmount}</div>}
                                {postDetail.minInvestment && <div>최저 투자금액: {postDetail.minInvestment}</div>}
                                {postDetail.adminId && <div>관리자 ID: {postDetail.adminId}</div>}
                                {postDetail.updateStopReason && <div>정지/수정 사유: {postDetail.updateStopReason}</div>}
                                {postDetail.rejectReason && <div>거절 사유: {postDetail.rejectReason}</div>}
                                {postDetail.files && postDetail.files.length > 0 && (
                                    <div>첨부 파일 ({postDetail.files.length}개): 
                                        {postDetail.files.map((file, index) => (
                                            <div key={index} className="ml-2">
                                                {file.url && file.url.trim() !== '' ? (
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        {file.name || 'Unknown File'}
                                                    </a>
                                                ) : (
                                                    <span className="text-red-500 block">{file.name || 'Invalid File'} (URL 없음)</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {postDetail.images && postDetail.images.length > 0 && (
                                    <div>첨부 이미지 ({postDetail.images.length}개): 
                                        {postDetail.images.map((image, index) => (
                                            <div key={index} className="ml-2">
                                                {image.url && image.url.trim() !== '' ? (
                                                    <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        {image.name || 'Unknown Image'}
                                                    </a>
                                                ) : (
                                                    <span className="text-red-500 block">{image.name || 'Invalid Image'} (URL 없음)</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {postDetail.imageUrl && (
                                    <div>대표 이미지: 
                                        <div className="ml-2">
                                            <a href={postDetail.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                {postDetail.imageUrl.split('/').pop() || 'Image'}
                                            </a>
                                        </div>
                                    </div>
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
                            <div className="relative">
                                <ActionButton
                                    kind="approve"
                                    onClick={() => handleAction('approve')}
                                    disabled={isApprovalDisabled || isUpdating}
                                    loading={isUpdating}
                                >
                                    승인
                                </ActionButton>
                                {isApprovalDisabled && hasInvalidFiles && postDetail.type === 'STOP' && (
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">
                                        파일 문제로 승인 불가
                                    </div>
                                )}
                            </div>

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
            {/*{isHoldModalOpen && (
                <PostHoldModal
                    open={isHoldModalOpen}
                    onClose={handleCloseHoldModal}
                    projectId={postDetail.projectId}
                    adminId={authUser}
                    onUpdate={onStatusChange}
                />
            )}*/}
        </div>
    );
}