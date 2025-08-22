import React, { useState, useEffect } from 'react';
import { privateApi as api } from '../../../api/axiosInstance';

export default function UserSettingModal({ open, onClose, user, onStatusChange, adminId }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [alertSending, setAlertSending] = useState(false);
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(null);
    const [notification, setNotification] = useState('');

    // Animate modal entrance
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

    if (!open || !user) return null;

    const isUserDeleted = user.status === 'DELETED';
    const isUserActive = user.status === 'ACTIVE';
    const isUserDisabled = user.status === 'DISABLED';

    const getStatusBadge = (status) => {
        const badges = {
            'ACTIVE': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30',
            'DISABLED': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/30',
            'DELETED': 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30'
        };
        return badges[status] || 'bg-gray-400 text-white';
    };

    const handleUserStatusChange = async (actionPath, actionName) => {
        setIsUpdating(true);
        setError('');
        setNotification('');
        try {
            const endpointBase = '/user/';
            const fullEndpoint = endpointBase + actionPath;
            const statusForPayload = actionPath.toUpperCase();

            await api.post(fullEndpoint, null, {
                params: {
                    userSeq: user.userSeq || user.id, 
                    user_status: statusForPayload
                }
            });

            onStatusChange(user.userSeq || user.id, statusForPayload);
            setNotification(`사용자가 성공적으로 ${actionName}되었습니다.`);
            setShowConfirm(null);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (e) {
            console.error('사용자 상태 변경 실패:', e);
            setError(e?.response?.data?.message || '상태 변경 중 오류가 발생했습니다.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSendAlert = async () => {
        setAlertSending(true);
        setError('');
        setNotification('');
        try {
            await api.post('/notifications/admin/alert', {
                userSeq: user.userSeq || user.id,
                adminId: adminId
            });
            setNotification(`${user.nickname || user.email}님께 알림이 성공적으로 전송되었습니다.`);
        } catch (e) {
            console.error('알림 발송 실패:', e);
            setError(e?.response?.data?.message || '알림 발송 중 오류가 발생했습니다.');
        } finally {
            setAlertSending(false);
        }
    };

    const ActionButton = ({ onClick, disabled, variant, children, icon }) => {
        const variants = {
            primary: disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-slate-500 text-white hover:bg-slate-600',
            success: disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700',
            warning: disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600',
            danger: disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-rose-600 text-white hover:bg-rose-700',
            secondary: disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
        };

        return (
            <button
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
                className={`
                    px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200
                    flex items-center gap-2 min-w-[100px] justify-center
                    ${variants[variant]}
                `}
            >
                {icon && <span>{icon}</span>}
                {children}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Muted backdrop */}
            <div 
                className="absolute inset-0 bg-slate-700/60 transition-opacity duration-300"
                onClick={onClose}
            />
            
            {/* Main Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100">
                
                {/* Muted header */}
                <div className="bg-red-500 p-6 rounded-t-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-xl font-bold mb-1">
                                    사용자 관리
                                </h2>
                                <p className="text-slate-200 text-sm">
                                    {user.nickname || user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
                        >
                            <span className="text-lg">×</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Notification Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {error}
                        </div>
                    )}
                    
                    {notification && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            {notification}
                        </div>
                    )}

                    {/* User Information Card */}
                    <div className="bg-slate-50 p-5 rounded-xl mb-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">사용자 정보</h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(user.status)}`}>
                                {user.status}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <div className="text-slate-500 font-medium">사용자 번호</div>
                                <div className="text-slate-900 font-mono bg-white px-3 py-2 rounded-lg border border-slate-200">
                                    {user.userSeq || user.id}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-slate-500 font-medium">이메일</div>
                                <div className="text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 break-all">
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <div className="text-slate-500 font-medium">닉네임</div>
                                <div className="text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200">
                                    {user.nickname || '설정되지 않음'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3 justify-center">
                            <ActionButton
                                onClick={() => setShowConfirm('activate')}
                                disabled={isUpdating || alertSending || isUserActive}
                                variant="success"
                            >
                                활성화
                            </ActionButton>
                            
                            <ActionButton
                                onClick={() => setShowConfirm('disable')}
                                disabled={isUpdating || alertSending || isUserDisabled || isUserDeleted}
                                variant="warning"
                            >
                                비활성화
                            </ActionButton>
                            
                            <ActionButton
                                onClick={() => setShowConfirm('delete')}
                                disabled={isUpdating || alertSending || isUserDeleted}
                                variant="danger"
                            >
                                사용자 정지
                            </ActionButton>
                            
                            <ActionButton
                                onClick={handleSendAlert}
                                disabled={isUpdating || alertSending || isUserDeleted}
                                variant="primary"
                            >
                                {alertSending ? '전송 중...' : '알림 보내기'}
                            </ActionButton>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-200 flex justify-end">
                            <ActionButton
                                onClick={onClose}
                                disabled={isUpdating || alertSending}
                                variant="secondary"
                            >
                                닫기
                            </ActionButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-slate-600/40" onClick={() => setShowConfirm(null)} />
                    <div className="relative bg-white rounded-xl shadow-xl p-6 m-4 max-w-md w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
                                <span className="text-xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {showConfirm === 'activate' && '사용자 활성화'}
                                {showConfirm === 'disable' && '사용자 비활성화'}
                                {showConfirm === 'delete' && '사용자 정지'}
                            </h3>
                            <p className="text-slate-600 mb-6">
                                {showConfirm === 'activate' && '이 사용자를 활성화하시겠습니까?'}
                                {showConfirm === 'disable' && '이 사용자를 비활성화하시겠습니까?'}
                                {showConfirm === 'delete' && '이 사용자를 정지시키시겠습니까?'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <ActionButton
                                    onClick={() => setShowConfirm(null)}
                                    variant="secondary"
                                >
                                    취소
                                </ActionButton>
                                <ActionButton
                                    onClick={() => {
                                        if (showConfirm === 'activate') handleUserStatusChange('active', '활성화');
                                        else if (showConfirm === 'disable') handleUserStatusChange('disabled', '비활성화');
                                        else if (showConfirm === 'delete') handleUserStatusChange('deleted', '정지');
                                    }}
                                    disabled={isUpdating}
                                    variant={showConfirm === 'activate' ? 'success' : 'danger'}
                                >
                                    {isUpdating ? '처리 중...' : '확인'}
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}