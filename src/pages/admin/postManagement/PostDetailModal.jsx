import React, { useState, useEffect, useRef, useCallback } from 'react';
import { privateApi as api } from '../../../api/axiosInstance';
import dayjs from 'dayjs';

// Small UI helpers
const Spinner = ({ className = 'w-4 h-4 text-white' }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
);

const XIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const StatusBadge = ({ status = 'PENDING' }) => {
    const map = {
        APPROVED: 'bg-green-100 text-green-700 ring-green-600/20',
        REJECTED: 'bg-red-100 text-red-700 ring-red-600/20',
        PENDING: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    };
    const label = status;
    const cls = map[status] || 'bg-gray-100 text-gray-700 ring-gray-600/20';
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
            {label}
        </span>
    );
};

const ActionButton = ({ kind = 'secondary', loading, disabled, onClick, children }) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
    const styles = {
        approve: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600',
        reject: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600',
        secondary: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400',
    }[kind];
    return (
        <button onClick={onClick} disabled={disabled || loading} className={`${base} ${styles}`}>
            {loading && <Spinner />}
            {children}
        </button>
    );
};

export default function PostDetailModal({ open, onClose, post, onStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [visible, setVisible] = useState(false); // for enter/exit animation
    const modalRef = useRef(null);

    // Open animations and focus management
    useEffect(() => {
        if (open) {
            setVisible(true);
            // focus first focusable element after mount
            setTimeout(() => {
                const focusables = getFocusable(modalRef.current);
                focusables[0]?.focus();
            }, 0);
        } else {
            setVisible(false);
        }
    }, [open]);

    // Keyboard handling: ESC close and focus trap
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
            return;
        }
        if (e.key === 'Tab' && modalRef.current) {
            const focusables = getFocusable(modalRef.current);
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (!open) return;
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, handleKeyDown]);

    if (!open || !post) return null;

    const isActionDisabled = post.status === 'APPROVED' || post.status === 'REJECTED';

    const handleAction = async (actionType) => {
        setIsUpdating(true);
        setUpdateError('');
        try {
            const endpoint = actionType === 'approve' ? '/product/request/approve' : '/product/request/reject';
            const payload = { postNo: post.postNo };
            await api.post(endpoint, payload);
            onStatusChange(post.postNo, actionType === 'approve' ? 'APPROVED' : 'REJECTED');
            onClose();
        } catch (e) {
            console.error('게시물 상태 업데이트 실패:', e);
            setUpdateError(e?.response?.data?.message || '상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsUpdating(false);
        }
    };

    const closeOnBackdrop = (e) => {
        // close only when clicking the backdrop, not the panel
        if (e.target === e.currentTarget) onClose();
    };

    const titleId = 'post-detail-title';
    const descId = 'post-detail-desc';

    return (
        <div className="fixed inset-0 z-50" aria-labelledby={titleId} aria-describedby={descId} role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={closeOnBackdrop}
            />

            {/* Panel container to center */}
            <div className="absolute inset-0 flex items-center justify-center p-4" onMouseDown={closeOnBackdrop}>
                {/* Panel */}
                <div
                    ref={modalRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-5">
                        <div className="min-w-0">
                            <h2 id={titleId} className="truncate text-lg font-semibold text-gray-900">
                                게시물 상세: {post.title || '제목 없음'}
                            </h2>
                            <p id={descId} className="mt-1 text-sm text-gray-500">
                                게시물 번호 {post.postNo} • 사용자 {post.userNo}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={post.status} />
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                aria-label="닫기"
                            >
                                <XIcon />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                        {updateError && (
                            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                                {updateError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2">
                            <Field label="제목" value={post.title} className="sm:col-span-2" />
                            <Field label="시작일자" value={formatDate(post.startDate)} />
                            <Field label="종료일자" value={formatDate(post.endDate)} />
                            <Field label="게시물상태" value={post.status} />
                            <Field label="요약" value={post.summary || '요약 없음'} className="sm:col-span-2" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
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
                        <ActionButton kind="secondary" onClick={onClose} disabled={isUpdating}>닫기</ActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, className = '' }) {
    return (
        <div className={className}>
            <div className="text-xs font-medium text-gray-500 mb-2">{label}</div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="text-gray-900 font-medium">{value || '-'}</div>
            </div>
        </div>
    );
}

function getFocusable(root) {
    if (!root) return [];
    const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ];
    return Array.from(root.querySelectorAll(selectors.join(','))).filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    );
}

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