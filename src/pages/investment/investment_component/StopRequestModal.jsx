import React, { useState } from "react";
import useScrollLock from "../../../component/useScrollLock";
import { submitStopRequest } from "../../../api/project_registration_api";
import { toast } from "react-toastify";

function StopRequestModal({ isOpen, onClose, projectId, title }) {
    const [reason, setReason] = useState("");
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useScrollLock(isOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            toast.error("중단 사유를 입력해주세요.");
            return;
        }

        if (files.length === 0) {
            toast.error("관련 문서를 첨부해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            const fileNames = files.map(file => file.name);
            
            await submitStopRequest({
                projectId,
                reason: reason.trim(),
                document: fileNames,
                image: []
            });

            toast.success("중단 요청이 접수되었습니다.");
            resetForm();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "중단 요청 처리 중 오류가 발생했습니다.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setReason("");
        setFiles([]);
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const isFormValid = reason.trim() && files.length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">프로젝트 중단 요청</h2>
                    <button
                        onClick={() => { resetForm(); onClose(); }}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                {/* Project Info */}
                <div className="mb-6 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600"><strong>{title}</strong></p>
                    <p className="text-xs text-gray-500">ID: {projectId}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            관련 문서 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.hwp,.txt"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        
                        {/* Selected Files */}
                        {files.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                            disabled={isSubmitting}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            중단 사유 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="프로젝트 중단을 요청하는 사유를 입력해주세요..."
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="4"
                            disabled={isSubmitting}
                            maxLength="500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {reason.length}/500자
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                                !isFormValid || isSubmitting
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            {isSubmitting ? "처리중..." : "중단 요청"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { resetForm(); onClose(); }}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-medium"
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                    </div>
                </form>

                {/* Warning */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                        중단 요청 후에는 취소할 수 없으며, 관리자 승인 시 프로젝트가 즉시 중단됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StopRequestModal;
