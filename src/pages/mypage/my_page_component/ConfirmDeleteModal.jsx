import React, {useEffect, useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRequest } from '../../../api/myPage_api';
import { useTranslation } from 'react-i18next';

// 모달 내부에서 사용할 작은 Spinner 컴포넌트
const Spinner = ({ className = 'w-4 h-4 text-white' }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
);


export default function ConfirmDeleteModal({ open, onClose, requestId, titleToMatch, onDeleted }) {
    const { t } = useTranslation();
    const [typedTitle, setTypedTitle] = useState('');
    const [localError, setLocalError] = useState('');
    const queryClient = useQueryClient();

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


    const deleteMutation = useMutation({
        mutationFn: (id) => deleteRequest(id), // deleteRequest 함수 호출
        onSuccess: () => {
            onDeleted();
            onClose();
        },
        onError: (error) => {
            setLocalError(error?.response?.data?.message || t('confirm_delete_mutation_error_fallback'));
            console.error('게시물 삭제 요청 실패:', error);
        },
    });

    if (!open) return null;

    const handleSubmit = () => {
        setLocalError('');
        if (typedTitle.trim() !== titleToMatch.trim()) {
            setLocalError(t('confirm_delete_title_mismatch_error'));
            return;
        }
        deleteMutation.mutate(requestId);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-700/60 transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t('confirm_delete_modal_title')}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-lg">
                        ×
                    </button>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                    {t('confirm_delete_modal_message1')} <br/>
                    {t('confirm_delete_modal_message2')}
                </p>
                <p className="font-semibold mb-2">{titleToMatch}</p>

                <input
                    type="text"
                    value={typedTitle}
                    onChange={(e) => setTypedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('confirm_delete_title_placeholder')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={deleteMutation.isLoading}
                />

                {localError && (
                    <p className="text-rose-600 text-sm mt-2">{localError}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
                        disabled={deleteMutation.isLoading}
                    >
                        {t('confirm_delete_cancel_button')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-md ${
                            deleteMutation.isLoading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                        disabled={deleteMutation.isLoading || typedTitle.trim() === ''} // 입력 없으면 비활성화
                    >
                        {deleteMutation.isLoading ? <Spinner /> : t('confirm_delete_confirm_button')}
                    </button>
                </div>
            </div>
        </div>
    );
}