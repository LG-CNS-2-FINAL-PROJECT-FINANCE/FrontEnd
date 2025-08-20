import React, { useState } from 'react';
import { privateApi as api } from '../../../api/axiosInstance'; // 경로 확인

export default function UserSettingModal({ open, onClose, user, onStatusChange, adminId }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [alertSending, setAlertSending] = useState(false);
    const [error, setError] = useState('');

    if (!open || !user) return null;

    const isUserDeleted = user.status === 'DELETED';
    const isUserActive = user.status === 'ACTIVE';
    const isUserDisabled = user.status === 'DISABLED';

    const handleUserStatusChange = async (actionPath) => {
        setIsUpdating(true);
        setError('');
        try {
            const endpointBase = '/user/auth/';
            const fullEndpoint = endpointBase + actionPath;
            const statusForPayload = actionPath.toUpperCase();

            console.log("handleUserStatusChange 호출됨.");
            console.log("요청 URL:", fullEndpoint);
            console.log("payload에 담을 user_status:", statusForPayload);
            console.log("userSeq:", user.userSeq || user.id);

            await api.post(fullEndpoint, null,{
                params: {
                    userSeq: user.userSeq || user.id, user_status: statusForPayload
                }
            });

            onStatusChange(user.userSeq || user.id, statusForPayload);
            onClose();
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
        try {
            await api.post('/notifications/admin/alert', {
                userSeq: user.userSeq || user.id,
                adminId: adminId
            });
            alert(`'${user.nickname || user.email}'님께 알림을 보냈습니다.`);
        } catch (e) {
            console.error('알림 발송 실패:', e);
            setError(e?.response?.data?.message || '알림 발송 중 오류가 발생했습니다.');
        } finally {
            setAlertSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                {/* 모달 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {user.nickname || user.email}님의 설정 변경
                    </h2>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <p className="text-gray-700 mb-4">
                        "<strong>{user.nickname || user.email}</strong>"님의 설정을 바꾸시겠습니까?
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div><strong>사용자번호:</strong> {user.userSeq || user.id}</div>
                        <div><strong>이메일:</strong> {user.email}</div>
                        <div><strong>닉네임:</strong> {user.nickname}</div>
                        <div><strong>현재 상태:</strong> {user.status}</div>
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => handleUserStatusChange('active')}
                        disabled={isUpdating || alertSending || isUserActive}
                        className={`px-4 py-2 mr-2 rounded text-white ${
                            isUserActive ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {isUpdating ? '처리 중...' : '활성화'}
                    </button>
                    <button
                        onClick={() => handleUserStatusChange('disabled')}
                        disabled={isUpdating || alertSending || isUserDisabled || isUserDeleted}
                        className={`px-4 py-2 mr-2 rounded text-white ${
                            isUserDisabled || isUserDeleted ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {isUpdating ? '처리 중...' : '비활성화'}
                    </button>
                    <button
                        onClick={() => handleUserStatusChange('deleted')}
                        disabled={isUpdating || alertSending || isUserDeleted}
                        className={`px-4 py-2 mr-2 rounded text-white ${
                            isUserDeleted ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {isUpdating ? '처리 중...' : '사용자 정지'}
                    </button>
                    <button
                        onClick={handleSendAlert}
                        disabled={isUpdating || alertSending || isUserDeleted}
                        className={`px-4 py-2 mr-2 rounded text-white ${
                            alertSending ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {isUpdating ? '알림 중...' : '알림'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isUpdating || alertSending}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}