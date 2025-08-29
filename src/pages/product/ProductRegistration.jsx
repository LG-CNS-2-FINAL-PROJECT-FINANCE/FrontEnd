import React, { useState } from 'react';
import { createProductRequest, validateProductForm } from '../../api/project_registration_api';
import RegisterConfirmation from './RegisterConfirmation';

function ProductRegistration() {
    // Form state
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Modal state
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [productTitle, setProductTitle] = useState('');

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentUpload = (e) => {
        setDocumentFile(e.target.files[0]);
    };

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error messages
        setSubmitError('');

        // Validate form including file uploads
        const validation = validateProductForm(formData, documentFile, imageFile);
        if (!validation.isValid) {
            const firstError = Object.values(validation.errors)[0];
            setSubmitError(firstError);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createProductRequest(formData, documentFile, imageFile);

            if (result.success) {
                setProductTitle(formData.title);
                setShowConfirmation(true);
            } else {
                setSubmitError(result.error);
            }
        } catch (error) {
            setSubmitError('예상치 못한 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto bg-white">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">투자 상품 등록</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Error Message */}
                    {submitError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {submitError}
                        </div>
                    )}
                    {/* 제목 - 상품명 입력 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="상품명 입력"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* 투자 기간 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-gray-700">시작일</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
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
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* 문서 업로드 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">문서 업로드</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                id="documentUpload"
                                onChange={handleDocumentUpload}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                            />
                            <label
                                htmlFor="documentUpload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                파일선택
                            </label>
                            {documentFile && (
                                <p className="mt-2 text-sm text-gray-600">선택된 파일: {documentFile.name}</p>
                            )}
                            {!documentFile && (
                                <p className="mt-2 text-sm text-gray-500">PDF, DOC, DOCX 파일을 선택해주세요</p>
                            )}
                        </div>
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">이미지 업로드</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                id="imageUpload"
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <label
                                htmlFor="imageUpload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                이미지 선택
                            </label>
                            {imageFile && (
                                <p className="mt-2 text-sm text-gray-600">선택된 이미지: {imageFile.name}</p>
                            )}
                            {!imageFile && (
                                <p className="mt-2 text-sm text-gray-500">JPG, PNG, GIF 이미지를 선택해주세요</p>
                            )}
                        </div>
                    </div>

                    {/* 상세설명 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">상세설명</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="상품에 대한 상세한 설명을 입력해주세요"
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-vertical"
                        />
                    </div>

                    {/* 상품요약 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">상품요약</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            placeholder="상품을 간략하게 요약해주세요"
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-vertical"
                        />
                    </div>

                    {/* 모집금액 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">모집금액</label>
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

                    {/* 등록하기 버튼 */}
                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none flex items-center gap-2 ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            {isSubmitting && (
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            )}
                            {isSubmitting ? '등록 중...' : '등록하기'}
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

export default ProductRegistration;
