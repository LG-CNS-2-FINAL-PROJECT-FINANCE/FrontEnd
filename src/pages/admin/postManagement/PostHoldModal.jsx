import React, { useState } from 'react';
import { togglePostHoldStatus } from '../../../api/admin_project_api';
import { useMutation } from '@tanstack/react-query';
import {toast} from "react-toastify";

export default function PostHoldModal({ open, onClose, projectId, adminId, onUpdate }) {
    const [holdReason, setHoldReason] = useState('');

    console.log("현재 넘어온 값 확인", projectId, adminId)

    const toggleHoldMutation = useMutation({
        mutationFn: ({ projectId, adminId, holdReason }) =>
            togglePostHoldStatus(projectId, adminId, holdReason),

        onSuccess: (data) => {
            console.log('게시물 숨김 처리 성공:', data);
            onUpdate && onUpdate(projectId, 'HOLD_TOGGLED');
            onClose();
            toast.success('게시물 숨김 처리가 완료되었습니다.');
        },
        onError: (error) => {
            console.error('게시물 숨김 처리 실패:', error);
            toast.error(`숨김 처리 실패: ${error?.response?.data?.message || '알 수 없는 오류'}`);
        }
    });

    if (!open) return null;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!holdReason.trim()) {
            toast.warn('숨김 사유를 입력해주세요.');
            return;
        }
        console.log("전송될 projectId:", projectId);
        console.log("전송될 Admin ID:", adminId);
        console.log("전송될 Hold Reason:", holdReason);

        toggleHoldMutation.mutate({ projectId, adminId, holdReason });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-700/60 transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">게시물 숨김 처리</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-lg">
                        ×
                    </button>
                </div>

                <div className="mb-4 text-sm text-gray-700">
                    <p className="mb-2"><strong>게시물 ID:</strong> {projectId}</p>
                    <p className="mb-2"><strong>관리자 ID:</strong> {adminId}</p>
                    <label htmlFor="holdReason" className="block font-medium mb-1">
                        숨김 사유:
                    </label>
                    <textarea
                        id="holdReason"
                        value={holdReason}
                        onChange={(e) => setHoldReason(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows="4"
                        placeholder="숨김 처리 사유를 입력해주세요."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={toggleHoldMutation.isLoading}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
                        disabled={toggleHoldMutation.isLoading}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-md ${
                            toggleHoldMutation.isLoading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                        disabled={toggleHoldMutation.isLoading}
                    >
                        {toggleHoldMutation.isLoading ? '처리 중...' : '확인'}
                    </button>
                </div>
            </div>
        </div>
    );
}