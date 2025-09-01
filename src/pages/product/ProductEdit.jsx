import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { submitUpdateRequest, uploadFileToS3 } from '../../api/project_registration_api';
import { getInvestmentsDetail } from "../../api/project_api";
import RegisterConfirmation from './RegisterConfirmation';

// Simple validation function for edit form (outside component for reusability)
const validateEditForm = (formData, reason) => {
    const errors = {};
    
    // Required text fields
    if (!formData.title?.trim()) errors.title = '제목을 입력해주세요.';
    if (!formData.description?.trim()) errors.description = '상세설명을 입력해주세요.';
    if (!formData.summary?.trim()) errors.summary = '상품요약을 입력해주세요.';
    if (!formData.goalAmount || formData.goalAmount <= 0) errors.goalAmount = '목표 모집금액을 입력해주세요.';
    if (!formData.minInvestment || formData.minInvestment <= 0) errors.minInvestment = '최소 투자금액을 입력해주세요.';
    if (!formData.startDate) errors.startDate = '시작일을 선택해주세요.';
    if (!formData.endDate) errors.endDate = '종료일을 선택해주세요.';
    
    // Required reason field
    if (!reason?.trim()) errors.reason = '수정 사유를 입력해주세요.';
    if (reason?.trim().length > 500) errors.reason = '수정 사유는 500자 이내로 입력해주세요.';
    
    // Date logic validation (only check end > start)
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        
        if (end <= start) {
            errors.endDate = '종료일은 시작일보다 늦어야 합니다.';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

function ProductEdit() {
    const { id } = useParams();

    // Common input styling
    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";

    // Fetch existing product data using the same query as investmentDetail
    const {
        data: investment,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['investmentDetail', id], // Same key as investmentDetail for cache sharing
        queryFn: async ({ signal }) => {
            return getInvestmentsDetail('/product', id, { signal });
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5분 동안은 fresh 상태 유지
        cacheTime: 10 * 60 * 1000, // 캐시에 10분간 보관
    });

    // Form state - will be populated when data loads
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        summary: '',
        goalAmount: '',
        minInvestment: '',
        startDate: '',
        endDate: ''
    });

    // UI state
    const [documentFile, setDocumentFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [documentUploadUrl, setDocumentUploadUrl] = useState('');
    const [imageUploadUrl, setImageUploadUrl] = useState('');
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Modal state
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [productTitle, setProductTitle] = useState('');

    // Pre-fill form data when investment data loads
    useEffect(() => {
        if (investment) {
            setFormData({
                title: investment.title || '',
                description: investment.description || '',
                summary: investment.summary || '',
                goalAmount: investment.targetAmount?.toString() || '',
                minInvestment: investment.minInvestment?.toString() || '',
                startDate: investment.startDate || '',
                endDate: investment.endDate || ''
            });
        }
    }, [investment]);

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setDocumentFile(file);
        setIsUploadingDocument(true);
        setUploadError('');
        
        try {
            const uploadResult = await uploadFileToS3(file);
            if (uploadResult.success) {
                setDocumentUploadUrl(uploadResult.url);
            }
        } catch (error) {
            console.error('Document upload error:', error);
            setUploadError('문서 파일 업로드에 실패했습니다: ' + error.message);
            setDocumentFile(null);
        } finally {
            setIsUploadingDocument(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setImageFile(file);
        setIsUploadingImage(true);
        setUploadError('');
        
        try {
            const uploadResult = await uploadFileToS3(file);
            if (uploadResult.success) {
                setImageUploadUrl(uploadResult.url);
            }
        } catch (error) {
            console.error('Image upload error:', error);
            setUploadError('이미지 파일 업로드에 실패했습니다: ' + error.message);
            setImageFile(null);
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        // Check if uploads are still in progress
        if (isUploadingDocument || isUploadingImage) {
            setSubmitError('파일 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        // Validate form
        const validation = validateEditForm(formData, reason);
        if (!validation.isValid) {
            const firstError = Object.values(validation.errors)[0];
            setSubmitError(firstError);
            return;
        }

        setIsSubmitting(true);
        try {
            // Use new uploaded URLs if available, otherwise use existing URLs from investment data
            let documentUrls = [];
            if (documentUploadUrl) {
                // New file was uploaded
                documentUrls = [documentUploadUrl];
            } else if (investment.files && investment.files.length > 0) {
                // Use existing file URL
                const fileUrl = investment.files[0].url || investment.files[0].name;
                if (fileUrl && typeof fileUrl === 'string' && fileUrl.trim() !== '') {
                    documentUrls = [fileUrl];
                }
            }

            let imageUrls = [];
            if (imageUploadUrl) {
                // New image was uploaded
                imageUrls = [imageUploadUrl];
            } else if (investment.imageUrl && typeof investment.imageUrl === 'string') {
                // Use existing image URL
                const imageUrl = investment.imageUrl;
                if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
                    imageUrls = [imageUrl];
                }
            }

            const result = await submitUpdateRequest({
                projectId: id, // Use the project ID from URL params
                formData: formData,
                reason: reason,
                document: documentUrls,
                image: imageUrls
            });

            if (result.success) {
                setProductTitle(formData.title);
                setShowConfirmation(true);
            }
        } catch (error) {
            setSubmitError(error.message || '수정 요청 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">기존 데이터를 불러오는 중...</p>
            </div>
        );
    }

    if (isError || !investment) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    {isError ? '데이터 로드 실패' : '프로젝트를 찾을 수 없습니다'}
                </h2>
                <p className="text-gray-600">
                    {error?.message || '프로젝트 정보를 불러올 수 없습니다.'}
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto bg-white">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">프로젝트 수정 요청</h1>
                    <p className="text-center text-gray-600 mt-2">기존 정보를 수정하여 관리자에게 승인 요청을 보냅니다.</p>
                    <p className="text-center text-sm text-indigo-600 mt-1">프로젝트 ID: {investment.projectNumber}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Error Message */}
                    {submitError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {submitError}
                        </div>
                    )}
                    
                    {/* Upload Error Message */}
                    {uploadError && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 flex items-center gap-2">
                            <span className="text-lg">📤</span>
                            {uploadError}
                        </div>
                    )}
                    {/* 프로젝트명 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="프로젝트명을 입력해주세요"
                            className={inputClass}
                        />
                    </div>

                    {/* 문서 업로드 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">
                            문서 파일 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.hwp"
                            onChange={handleDocumentUpload}
                            className={inputClass}
                            disabled={isUploadingDocument}
                        />
                        
                        {isUploadingDocument && (
                            <p className="text-sm text-blue-600 flex items-center gap-2">
                                📤 문서 업로드 중...
                            </p>
                        )}
                        
                        {documentFile && documentUploadUrl && (
                            <p className="text-sm text-green-600 flex items-center gap-2">
                                ✅ 새 파일 업로드 완료: {documentFile.name}
                            </p>
                        )}
                        
                        {!isUploadingDocument && !documentFile && (
                            <p className="text-sm text-gray-500">새 파일을 선택하지 않으면 기존 파일이 유지됩니다.</p>
                        )}
                        
                        {investment.files && investment.files.length > 0 && (
                            <p className="text-sm text-indigo-600">현재 파일: {investment.files[0]?.name || '첨부파일 있음'}</p>
                        )}
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">
                            대표 이미지 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={inputClass}
                            disabled={isUploadingImage}
                        />
                        
                        {isUploadingImage && (
                            <p className="text-sm text-blue-600 flex items-center gap-2">
                                이미지 업로드 중...
                            </p>
                        )}
                        
                        {imageFile && imageUploadUrl && (
                            <p className="text-sm text-green-600 flex items-center gap-2">
                                새 이미지 업로드 완료: {imageFile.name}
                            </p>
                        )}
                        
                        {!isUploadingImage && !imageFile && (
                            <p className="text-sm text-gray-500">새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.</p>
                        )}
                        
                        {investment.imageUrl && (
                            <div className="mt-2">
                                <p className="text-sm text-indigo-600 mb-2">현재 이미지:</p>
                                <img 
                                    src={investment.imageUrl} 
                                    alt="현재 대표 이미지" 
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>

                    {/* 상세설명 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">상세설명</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="6"
                            placeholder="프로젝트에 대한 상세한 설명을 작성해주세요"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* 상품요약 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">상품요약</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="프로젝트 요약을 간단히 작성해주세요"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* 날짜 입력 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-gray-700">시작일</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-gray-700">종료일</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* 금액 입력 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">목표 모집금액</label>
                        <input
                            type="number"
                            name="goalAmount"
                            value={formData.goalAmount}
                            onChange={handleInputChange}
                            placeholder="목표 모집금액을 입력해주세요 (원)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* 최소투자금액 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">최소투자금액</label>
                        <input
                            type="number"
                            name="minInvestment"
                            value={formData.minInvestment}
                            onChange={handleInputChange}
                            placeholder="최소 투자금액을 입력해주세요 (원)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* 수정 사유 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">
                            수정 사유 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="프로젝트 수정을 요청하는 사유를 상세히 입력해주세요..."
                            className={`${inputClass} resize-none`}
                            rows="4"
                            maxLength="500"
                            required
                        />
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-500">
                                관리자가 검토 후 승인/거절을 결정합니다.
                            </p>
                            <p className="text-sm text-gray-500">
                                {reason.length}/500자
                            </p>
                        </div>
                    </div>

                    {/* 수정 요청 버튼 */}
                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none flex items-center gap-2 ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                        >
                            {isSubmitting && (
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            )}
                            {isSubmitting ? '수정 요청 중...' : '수정 요청'}
                        </button>
                    </div>
                </form>

                {/* Confirmation Modal */}
                <RegisterConfirmation
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    productTitle={productTitle}
                />
            </div>
        </div>
    );
}

export default ProductEdit;
