import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function ProductRegistration() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        summary: '',
        targetAmount: '',
        minInvestment: ''
    });
    const [documentFile, setDocumentFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const { themeColors } = useTheme();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentUpload = (e) => {
        const file = e.target.files[0];
        setDocumentFile(file);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        console.log('Document:', documentFile);
        console.log('Image:', imageFile);
        alert('상품 등록 신청이 완료되었습니다! 관리자 심사 후 승인됩니다.');
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto bg-white">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">투자 상품 등록</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 제목 - 상품명 입력 */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="상품명 입력"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
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
                            name="targetAmount"
                            value={formData.targetAmount}
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductRegistration;
