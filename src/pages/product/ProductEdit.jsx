import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { submitUpdateRequest, uploadFileToS3 } from '../../api/project_registration_api';
import { getInvestmentsDetail } from "../../api/project_api";

const validateEditForm = (formData, reason) => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = '제목을 입력해주세요.';
    if (!formData.description?.trim()) errors.description = '상세설명을 입력해주세요.';
    if (!formData.summary?.trim()) errors.summary = '상품요약을 입력해주세요.';
    if (!formData.goalAmount || formData.goalAmount <= 0) errors.goalAmount = '목표 모집금액을 입력해주세요.';
    if (!formData.minInvestment || formData.minInvestment <= 0) errors.minInvestment = '최소 투자금액을 입력해주세요.';
    if (!formData.startDate) errors.startDate = '시작일을 선택해주세요.';
    if (!formData.endDate) errors.endDate = '종료일을 선택해주세요.';
    if (!reason?.trim()) errors.reason = '수정 사유를 입력해주세요.';
    if (reason?.trim().length > 500) errors.reason = '수정 사유는 500자 이내로 입력해주세요.';
    
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end <= start) errors.endDate = '종료일은 시작일보다 늦어야 합니다.';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
};

function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";

    const { data: investment, isLoading } = useQuery({
        queryKey: ["investmentDetail", id],
        queryFn: () => getInvestmentsDetail(id),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // Form and file state
    const [formData, setFormData] = useState({
        title: '', description: '', summary: '', goalAmount: '', 
        minInvestment: '', startDate: '', endDate: ''
    });
    const [documentFiles, setDocumentFiles] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [documentUploadUrls, setDocumentUploadUrls] = useState([]);
    const [imageUploadUrls, setImageUploadUrls] = useState([]);
    const [deletedExistingDocuments, setDeletedExistingDocuments] = useState([]);
    const [deletedExistingImages, setDeletedExistingImages] = useState([]);
    const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Pre-fill form when investment loads
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

    // Cleanup object URLs
    useEffect(() => {
        const allFiles = [...imageFiles, ...documentFiles];
        return () => {
            allFiles.forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
        };
    }, [imageFiles, documentFiles]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e, type) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        const isDocument = type === 'document';
        const setUploading = isDocument ? setIsUploadingDocuments : setIsUploadingImages;
        const setFiles = isDocument ? setDocumentFiles : setImageFiles;
        const setUrls = isDocument ? setDocumentUploadUrls : setImageUploadUrls;
        
        setUploading(true);
        setUploadError('');
        
        try {
            const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
            const successful = uploadResults.filter(result => result.success);
            const failed = uploadResults.filter(result => !result.success);
            
            if (successful.length > 0) {
                const successfulFiles = files.filter((_, index) => uploadResults[index].success);
                const successfulUrls = successful.map(result => result.url);
                setFiles(prev => [...prev, ...successfulFiles]);
                setUrls(prev => [...prev, ...successfulUrls]);
            }
            
            if (failed.length > 0) {
                setUploadError(`${failed.length}개 ${isDocument ? '문서' : '이미지'} 업로드에 실패했습니다.`);
            }
        } catch (error) {
            setUploadError(`${isDocument ? '문서' : '이미지'} 파일 업로드에 실패했습니다: ${error.message}`);
        } finally {
            setUploading(false);
        }
        
        e.target.value = '';
    };

    const removeFile = (index, type, isExisting = false) => {
        if (isExisting) {
            const setDeleted = type === 'document' ? setDeletedExistingDocuments : setDeletedExistingImages;
            setDeleted(prev => [...prev, index]);
        } else {
            const setFiles = type === 'document' ? setDocumentFiles : setImageFiles;
            const setUrls = type === 'document' ? setDocumentUploadUrls : setImageUploadUrls;
            setFiles(prev => prev.filter((_, i) => i !== index));
            setUrls(prev => prev.filter((_, i) => i !== index));
        }
    };

    const clearAllFiles = (type) => {
        if (type === 'document') {
            setDocumentFiles([]);
            setDocumentUploadUrls([]);
        } else {
            setImageFiles([]);
            setImageUploadUrls([]);
            setUploadError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (isUploadingDocuments || isUploadingImages) {
            setSubmitError('파일 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        const validation = validateEditForm(formData, reason);
        if (!validation.isValid) {
            setSubmitError(Object.values(validation.errors)[0]);
            return;
        }

        setIsSubmitting(true);
        try {
            // Combine new uploads with remaining existing files
            let documentUrls = [...documentUploadUrls];
            if (investment.files?.length > 0) {
                const remainingDocs = investment.files
                    .map((file, index) => ({ url: file.url || file.name, index }))
                    .filter(({ url, index }) => 
                        !deletedExistingDocuments.includes(index) && 
                        url && typeof url === 'string' && url.trim() !== ''
                    )
                    .map(({ url }) => url);
                documentUrls = [...documentUrls, ...remainingDocs];
            }

            let imageUrls = [...imageUploadUrls];
            if (investment.imageUrl) {
                if (Array.isArray(investment.imageUrl)) {
                    const remainingImages = investment.imageUrl
                        .map((url, index) => ({ url, index }))
                        .filter(({ url, index }) => 
                            !deletedExistingImages.includes(index) && 
                            url && typeof url === 'string' && url.trim() !== ''
                        )
                        .map(({ url }) => url);
                    imageUrls = [...imageUrls, ...remainingImages];
                } else if (typeof investment.imageUrl === 'string' && 
                        investment.imageUrl.trim() !== '' && 
                        !deletedExistingImages.includes(0)) {
                    imageUrls = [...imageUrls, investment.imageUrl];
                }
            }

            const result = await submitUpdateRequest({
                projectId: id,
                formData: formData,
                reason: reason,
                document: documentUrls,
                image: imageUrls
            });

            if (result.success) {
                // Show success toast and navigate to investment list
                toast.success("상품 수정 요청이 완료되었습니다", {
                    position: "bottom-right",
                });
                navigate('/investment');
            }
        } catch (error) {
            setSubmitError(error.message || '수정 요청 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">기존 데이터를 불러오는 중...</p>
            </div>
        );
    }

    const FileList = ({ files, type, isExisting = false, onRemove }) => (
        <div className="space-y-2">
            {files.map((file, index) => (
                (!isExisting || !deletedExistingDocuments.includes(index)) && (
                    <div key={`${file.name || file}-${index}`} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                            isExisting ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50'
                        }`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📄</span>
                            <div>
                                <p className="text-sm font-medium text-gray-900" title={file.name || file}>
                                    {(file.name || file).length > 40 ? 
                                        (file.name || file).substring(0, 40) + '...' : 
                                        (file.name || file)
                                    }
                                </p>
                                {file.size && (
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                )}
                                {isExisting && <p className="text-xs text-indigo-600">기존 파일</p>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                            <span className="text-lg">×</span>
                        </button>
                    </div>
                )
            ))}
        </div>
    );

    const ImageGrid = ({ images, isExisting = false, onRemove }) => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
                (!isExisting || !deletedExistingImages.includes(index)) && (
                    <div key={`${img.name || img}-${index}`} className="relative group">
                        <img 
                            src={isExisting ? img : URL.createObjectURL(img)} 
                            alt={`이미지 ${index + 1}`}
                            className={`w-full h-24 object-cover rounded-lg border ${
                                isExisting ? 'border-indigo-200' : ''
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                        {!img.name && <p className="text-xs text-gray-500 mt-1 truncate">{img.name}</p>}
                        {isExisting && <p className="text-xs text-indigo-600 mt-1">기존 이미지</p>}
                    </div>
                )
            ))}
        </div>
    );

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">상품 수정</h1>
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            수정 요청
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 제목 */}
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
                            <div className="flex justify-between items-center">
                                <label className="block text-lg font-semibold text-gray-700">
                                    문서 파일들 <span className="text-sm font-normal text-gray-500">(선택사항, 여러 개 선택 가능)</span>
                                </label>
                                {documentFiles.length > 0 && (
                                    <button type="button" onClick={() => clearAllFiles('document')} className="text-sm text-red-600 hover:text-red-800 underline">
                                        모든 문서 제거
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.hwp"
                                multiple
                                onChange={(e) => handleFileUpload(e, 'document')}
                                className={inputClass}
                                disabled={isUploadingDocuments}
                            />
                            
                            {isUploadingDocuments && (
                                <p className="text-sm text-blue-600">📤 문서들 업로드 중...</p>
                            )}
                            
                            {documentFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-green-600">선택된 문서: {documentFiles.length}개</p>
                                    <FileList files={documentFiles} type="document" onRemove={(i) => removeFile(i, 'document')} />
                                </div>
                            )}
                            
                            {investment.files?.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-indigo-600 mb-2">현재 서버에 저장된 문서:</p>
                                    <FileList 
                                        files={investment.files} 
                                        type="document" 
                                        isExisting={true}
                                        onRemove={(i) => removeFile(i, 'document', true)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 이미지 업로드 */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-lg font-semibold text-gray-700">
                                    대표 이미지들 <span className="text-sm font-normal text-gray-500">(선택사항, 여러 개 선택 가능)</span>
                                </label>
                                {imageFiles.length > 0 && (
                                    <button type="button" onClick={() => clearAllFiles('image')} className="text-sm text-red-600 hover:text-red-800 underline">
                                        모든 이미지 제거
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFileUpload(e, 'image')}
                                className={inputClass}
                                disabled={isUploadingImages}
                            />
                            
                            {isUploadingImages && (
                                <p className="text-sm text-blue-600">이미지들 업로드 중...</p>
                            )}
                            
                            {imageFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-green-600">선택된 이미지: {imageFiles.length}개</p>
                                    <ImageGrid images={imageFiles} onRemove={(i) => removeFile(i, 'image')} />
                                </div>
                            )}
                            
                            {investment.imageUrl && (
                                <div className="mt-2">
                                    <p className="text-sm text-indigo-600 mb-2">현재 서버에 저장된 이미지:</p>
                                    <ImageGrid 
                                        images={Array.isArray(investment.imageUrl) ? investment.imageUrl : [investment.imageUrl]} 
                                        isExisting={true}
                                        onRemove={(i) => removeFile(i, 'image', true)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 기타 폼 필드들 */}
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-gray-700">상세설명</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="6"
                                placeholder="상품에 대한 상세한 설명을 입력해주세요"
                                className={inputClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-gray-700">상품요약</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="상품의 핵심 내용을 간단히 요약해주세요"
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-700">목표 모집금액 (원)</label>
                                <input
                                    type="number"
                                    name="goalAmount"
                                    value={formData.goalAmount}
                                    onChange={handleInputChange}
                                    placeholder="목표 금액을 입력해주세요"
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-700">최소 투자금액 (원)</label>
                                <input
                                    type="number"
                                    name="minInvestment"
                                    value={formData.minInvestment}
                                    onChange={handleInputChange}
                                    placeholder="최소 투자 금액을 입력해주세요"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-700">시작일</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-700">종료일</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* 수정 사유 */}
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-red-600">
                                수정 사유 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="4"
                                placeholder="상품 정보를 수정하는 이유를 자세히 설명해주세요 (필수)"
                                className={`${inputClass} border-red-300 focus:ring-red-500 focus:border-red-500`}
                            />
                            <p className="text-sm text-gray-500">
                                {reason.length}/500자
                            </p>
                        </div>

                        {/* 에러 메시지 */}
                        {(uploadError || submitError) && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 text-sm">
                                    {uploadError || submitError}
                                </p>
                            </div>
                        )}

                        {/* 제출 버튼 */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/investment')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploadingDocuments || isUploadingImages}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isSubmitting ? '수정 요청 중...' : '수정 요청'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductEdit;
