import React, { useState } from 'react';
import { createProductRequest, validateProductForm, uploadFileToS3 } from '../../api/project_registration_api';
import RegisterConfirmation from './RegisterConfirmation';
import useUser from '../../lib/useUser';
import { useTranslation } from 'react-i18next';


function ProductRegistration() {
    // Get user data including nickname
    const { user } = useUser();
    const nickname = user?.nickname;
    const { t } = useTranslation();

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
            setUploadError(t('product_registration_upload_error_document_fail', { errorMessage: error.message }));
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
            setUploadError(t('product_registration_upload_error_image_fail', { errorMessage: error.message }));
            setImageFile(null);
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error messages
        setSubmitError('');

        // Check if uploads are still in progress
        if (isUploadingDocument || isUploadingImage) {
            setSubmitError(t('product_registration_submit_error_file_upload_in_progress'));
            return;
        }

        // Check if nickname is available from user data
        if (!nickname) {
            setSubmitError(t('product_registration_submit_error_user_info_missing'));
            return;
        }

        // Validate form including file uploads
        const validation = validateProductForm(formData, documentUploadUrl, imageUploadUrl);
        if (!validation.isValid) {
            const firstError = Object.values(validation.errors)[0];
            setSubmitError(firstError);
            return;
        }

        setIsSubmitting(true);

        try {
            // 닉네임 추가 
            const formDataWithNickname = {
                ...formData,
                nickname: nickname
            };

            console.log('ProductRegistration - submitting with nickname:', nickname);
            console.log('ProductRegistration - final formData:', formDataWithNickname);

            const result = await createProductRequest(formDataWithNickname, documentUploadUrl, imageUploadUrl);

            if (result.success) {
                setProductTitle(formData.title);
                setShowConfirmation(true);
            } else {
                setSubmitError(result.error);
            }
        } catch (error) {
            setSubmitError(t('product_registration_submit_error_unexpected'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto bg-white">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">{t('product_registration_page_title')}</h1>
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
                            <span className="text-lg">UPLOAD ERROR</span>
                            {uploadError}
                        </div>
                    )}
                    {/* 제목 - 상품명 입력 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_title_label')}</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder={t('product_registration_title_placeholder')}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* 투자 기간 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold text-gray-700">{t('product_registration_start_date_label')}</label>
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
                            <label className="block text-lg font-semibold text-gray-700">{t('product_registration_end_date_label')}</label>
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
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_document_upload_label')}</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                id="documentUpload"
                                onChange={handleDocumentUpload}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                disabled={isUploadingDocument}
                            />
                            <label
                                htmlFor="documentUpload"
                                className={`cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                                    isUploadingDocument 
                                        ? 'text-gray-500 cursor-not-allowed' 
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {isUploadingDocument ? t('product_registration_uploading_text') : t('product_registration_select_file_button')}
                            </label>

                            {isUploadingDocument && (
                                <p className="mt-2 text-sm text-blue-600">
                                    {t('product_registration_uploading_document_message')}
                                </p>
                            )}

                            {documentFile && documentUploadUrl && (
                                <p className="mt-2 text-sm text-green-600">
                                    {t('product_registration_upload_complete_prefix')}{documentFile.name}
                                </p>
                            )}

                            {!documentFile && !isUploadingDocument && (
                                <p className="mt-2 text-sm text-gray-500">{t('product_registration_document_file_info')}</p>
                            )}
                        </div>
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_image_upload_label')}</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                id="imageUpload"
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                                disabled={isUploadingImage}
                            />
                            <label
                                htmlFor="imageUpload"
                                className={`cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                                    isUploadingImage 
                                        ? 'text-gray-500 cursor-not-allowed' 
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {isUploadingImage ? t('product_registration_uploading_text') : t('product_registration_select_image_button')}
                            </label>
                            
                            {isUploadingImage && (
                                <p className="mt-2 text-sm text-blue-600">
                                    {t('product_registration_uploading_image_message')}
                                </p>
                            )}
                            
                            {imageFile && imageUploadUrl && (
                                <p className="mt-2 text-sm text-green-600">
                                    {t('product_registration_upload_complete_prefix')}{imageFile.name}
                                </p>
                            )}
                            
                            {!imageFile && !isUploadingImage && (
                                <p className="mt-2 text-sm text-gray-500">
                                    {t('product_registration_image_file_info')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 상세설명 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_description_label')}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={t('product_registration_description_placeholder')}
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-vertical"
                        />
                    </div>

                    {/* 상품요약 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_summary_label')}</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            placeholder={t('product_registration_summary_placeholder')}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-vertical"
                        />
                    </div>

                    {/* 모집금액 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_goal_amount_label')}</label>
                        <input
                            type="number"
                            name="goalAmount"
                            value={formData.goalAmount}
                            onChange={handleInputChange}
                            placeholder={t('product_registration_goal_amount_placeholder', { unit_won: t('unit_won') })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* 최소투자금액 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">{t('product_registration_min_investment_label')}</label>
                        <input
                            type="number"
                            name="minInvestment"
                            value={formData.minInvestment}
                            onChange={handleInputChange}
                            placeholder={t('product_registration_min_investment_placeholder', { unit_won: t('unit_won') })}
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
                            {isSubmitting ? t('product_registration_submitting_text') : t('product_registration_register_button')}
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
