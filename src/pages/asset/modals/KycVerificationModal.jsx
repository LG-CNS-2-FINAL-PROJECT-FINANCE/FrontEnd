import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userKYC } from '../../../api/user_api';
import { FaIdCard, FaExclamationTriangle } from 'react-icons/fa';

export default function KycVerificationModal({ open, onClose, onKycSuccess }) {
    const [name, setName] = useState('');
    const [residentIdFront, setResidentIdFront] = useState('');
    const [residentIdBack, setResidentIdBack] = useState('');
    const [issueDate, setIssueDate] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmitKyc = async () => {
        if (!name.trim() || !residentIdFront.trim() || !residentIdBack.trim() || !issueDate.trim()) {
            setError('모든 필수 정보를 입력해주세요.');
            return;
        }
        if (residentIdFront.length !== 6 || residentIdBack.length !== 7) {
            setError('주민등록번호 형식이 올바르지 않습니다.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await userKYC({
                name: name,
                rrn1: residentIdFront,
                rrn2: residentIdBack,
                date: issueDate
            });

            toast.success('본인인증(KYC)이 성공적으로 접수되었습니다. 잠시 후 확인됩니다.');
            onKycSuccess();
        } catch (err) {
            const apiErrorMessage = err?.message || '본인인증 처리 중 오류가 발생했습니다.';
            setError(apiErrorMessage);
            toast.error(`본인인증에 실패했습니다: ${apiErrorMessage}`);
            console.error('KYC 제출 오류:', err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-700/60" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">

                <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FaIdCard className="text-3xl" />
                        <h2 className="text-2xl font-bold">본인인증 (KYC)</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 text-3xl transition-colors duration-200">×</button>
                </div>

                <div className="p-6 bg-gray-50 overflow-y-auto">
                    <p className="text-md text-gray-700 mb-6 text-center">
                        서비스 이용을 위해 본인인증이 필요합니다.<br/>정확한 정보를 입력해주세요.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 flex items-center gap-3">
                            <FaExclamationTriangle className="text-xl" />
                            <div>{error}</div>
                        </div>
                    )}

                    <div className="space-y-5 mb-8">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">이름</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="residentIdFront" className="block text-sm font-semibold text-gray-700 mb-1">주민등록번호</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    id="residentIdFront"
                                    value={residentIdFront}
                                    onChange={(e) => { const value = e.target.value.replace(/[^0-9]/g, ''); setResidentIdFront(value); }}
                                    maxLength={6}
                                    className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                                    placeholder="생년월일 6자리"
                                    disabled={isLoading}
                                />
                                <span className="text-xl text-gray-500">-</span>
                                <input
                                    type="password"
                                    id="residentIdBack"
                                    value={residentIdBack}
                                    onChange={(e) => { const value = e.target.value.replace(/[^0-9]/g, ''); setResidentIdBack(value); }}
                                    maxLength={7}
                                    className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                                    placeholder="뒷자리 7자리"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="issueDate" className="block text-sm font-semibold text-gray-700 mb-1">발급일자</label>
                            <input
                                type="date"
                                id="issueDate"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmitKyc}
                            disabled={isLoading}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-200"
                        >
                            {isLoading ? '인증 진행 중...' : '본인인증 요청'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}