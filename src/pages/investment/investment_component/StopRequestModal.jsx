import React, { useState } from "react";
import useScrollLock from "../../../component/useScrollLock";
import { submitStopRequest } from "../../../api/project_registration_api";
import { toast } from "react-toastify";

function StopRequestModal({
    isOpen,
    onClose,
    projectId,
    title
}) {
    const [reason, setReason] = useState("");
    const [documentFiles, setDocumentFiles] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 스크롤 방지
    useScrollLock(isOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            toast.error("중단 사유를 입력해주세요.", {
                position: "bottom-right",
            });
            return;
        }

        if (documentFiles.length === 0) {
            toast.error("관련 문서를 첨부해주세요.", {
                position: "bottom-right",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert files to base64 or file names for the API
            const documentNames = documentFiles.map(file => file.name);
            const imageNames = imageFiles.map(file => file.name);

            const requestId = await submitStopRequest({
                projectId: projectId,
                reason: reason.trim(),
                document: documentNames.length > 0 ? documentNames : [""],
                image: imageNames.length > 0 ? imageNames : [""]
            });

            toast.success("중단 요청이 성공적으로 접수되었습니다.", {
                position: "bottom-right",
            });

            // 폼 초기화 및 모달 닫기
            setReason("");
            setDocumentFiles([]);
            setImageFiles([]);
            onClose();
        } catch (error) {
            console.error('Stop request error:', error);

            const errorMessage = error.response?.data?.message || "중단 요청 처리 중 오류가 발생했습니다.";
            toast.error(errorMessage, {
                position: "bottom-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setReason("");
        setDocumentFiles([]);
        setImageFiles([]);
        onClose();
    };

    const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setDocumentFiles(files);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
    };

    const removeDocumentFile = (index) => {
        setDocumentFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeImageFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">프로젝트 중단 요청</h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">프로젝트: <span className="font-semibold">{title}</span></p>
                    <p className="text-sm text-gray-600">프로젝트 ID: <span className="font-semibold">{projectId}</span></p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* 문서 파일 업로드 */}
                    <div className="mb-4">
                        <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-2">
                            관련 문서 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="documents"
                            multiple
                            accept=".pdf,.doc,.docx,.hwp,.txt"
                            onChange={handleDocumentChange}
                            disabled={isSubmitting}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX, HWP, TXT 파일만 업로드 가능합니다.
                        </p>
                        
                        {/* 선택된 문서 파일 표시 */}
                        {documentFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {documentFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeDocumentFile(index)}
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

                    {/* 이미지 파일 업로드 (선택사항) */}
                    <div className="mb-4">
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                            관련 이미지 (선택사항)
                        </label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif,.bmp"
                            onChange={handleImageChange}
                            disabled={isSubmitting}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            JPG, JPEG, PNG, GIF, BMP 파일만 업로드 가능합니다.
                        </p>
                        
                        {/* 선택된 이미지 파일 표시 */}
                        {imageFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {imageFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeImageFile(index)}
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

                    {/* 중단 사유 */}
                    <div className="mb-4">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            중단 사유 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="프로젝트 중단을 요청하는 사유를 상세히 입력해주세요..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="4"
                            disabled={isSubmitting}
                            maxLength="500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            최대 500자까지 입력 가능합니다. ({reason.length}/500)
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={isSubmitting || !reason.trim() || documentFiles.length === 0}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isSubmitting || !reason.trim() || documentFiles.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 text-current mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    처리중...
                                </div>
                            ) : (
                                '중단 요청'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                    </div>
                </form>

                {/* 확인 메시지 */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                        <strong>주의:</strong> 중단 요청 후에는 취소할 수 없으며, 관리자 승인 시 프로젝트가 즉시 중단됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StopRequestModal;
