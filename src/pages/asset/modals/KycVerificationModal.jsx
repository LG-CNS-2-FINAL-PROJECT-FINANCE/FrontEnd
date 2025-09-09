// src/components/KycVerificationModal.jsx (수정)

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userKYC } from '../../../api/user_api';
import { FaIdCard, FaExclamationTriangle } from 'react-icons/fa';
// <<<< useTranslation 훅 임포트
import { useTranslation } from 'react-i18next';


export default function KycVerificationModal({ open, onClose, onKycSuccess }) {
    // <<<< useTranslation 훅 사용
    const { t, i18n } = useTranslation();

    const [name, setName] = useState('');
    const [residentIdFront, setResidentIdFront] = useState('');
    const [residentIdBack, setResidentIdBack] = useState('');
    const [issueDate, setIssueDate] = useState('');

    const [isConsentChecked, setIsConsentChecked] = useState(false);

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

    // <<<< handleSubmitKyc 함수 내부의 에러 메시지 번역 키로 변경
    const handleSubmitKyc = async () => {
        if (!name.trim() || !residentIdFront.trim() || !residentIdBack.trim() || !issueDate.trim()) {
            setError(t('kyc_error_all_fields_required')); // << 번역 키 사용
            return;
        }
        if (residentIdFront.length !== 6 || residentIdBack.length !== 7) {
            setError(t('kyc_error_invalid_resident_id')); // << 번역 키 사용
            return;
        }
        if (!isConsentChecked) {
            setError(t('kyc_error_consent_required')); // << 번역 키 사용
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const kycDataToSend = {
                name: name,
                rrn1: residentIdFront,
                rrn2: residentIdBack,
                date: issueDate
            };

            await userKYC(kycDataToSend);

            toast.success(t('kyc_success_toast')); // << 번역 키 사용
            onKycSuccess();

        } catch (err) {
            const apiErrorMessage = err.message || t('kyc_generic_error'); // << 번역 키 사용
            setError(apiErrorMessage);
            // 에러 토스트 메시지에도 번역된 에러 메시지를 포함
            toast.error(t('kyc_fail_toast', { errorMessage: apiErrorMessage })); // << 번역 키 사용, 인터폴레이션 활용
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
                        <h2 className="text-2xl font-bold">{t('kyc_title')}</h2> {/* <<<< 번역 키 사용 */}
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 text-3xl transition-colors duration-200">×</button>
                </div>

                <div className="p-6 bg-gray-50 overflow-y-auto">
                    {/* <<<< 도입 메시지 번역 키 사용 */}
                    <p className="text-md text-gray-700 mb-6 text-center">{t('kyc_intro')}</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 flex items-center gap-3">
                            <FaExclamationTriangle className="text-xl" />
                            <div>{error}</div>
                        </div>
                    )}

                    <div className="space-y-5 mb-8">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">{t('kyc_name_label')}</label> {/* <<<< 번역 키 사용 */}
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
                            <label htmlFor="residentIdFront" className="block text-sm font-semibold text-gray-700 mb-1">{t('kyc_resident_number_label')}</label> {/* <<<< 번역 키 사용 */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    id="residentIdFront"
                                    value={residentIdFront}
                                    onChange={(e) => { const value = e.target.value.replace(/[^0-9]/g, ''); setResidentIdFront(value); }}
                                    maxLength={6}
                                    className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                                    placeholder={t('kyc_resident_number_front_placeholder') || '생년월일 6자리'} // placeholder도 번역
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
                                    placeholder={t('kyc_resident_number_back_placeholder') || '뒷자리 7자리'} // placeholder도 번역
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="issueDate" className="block text-sm font-semibold text-gray-700 mb-1">{t('kyc_issue_date_label')}</label> {/* <<<< 번역 키 사용 */}
                            <input
                                type="date"
                                id="issueDate"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                                disabled={isLoading}
                            />
                        </div>

                        {/* <<<< 동의 체크박스 문구 번역 키 사용 */}
                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                id="consentCheckbox"
                                checked={isConsentChecked}
                                onChange={(e) => setIsConsentChecked(e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                disabled={isLoading}
                            />
                            <label htmlFor="consentCheckbox" className="ml-2 block text-sm text-gray-900">
                                {t('kyc_consent_required')} {/* << 번역 키 사용 */}
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                            {t('kyc_button_cancel')} {/* << 번역 키 사용 */}
                        </button>
                        <button
                            onClick={handleSubmitKyc}
                            disabled={isLoading || !isConsentChecked}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-200"
                        >
                            {isLoading ? t('kyc_in_progress') : t('kyc_button_request')} {/* << 번역 키 사용 */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}