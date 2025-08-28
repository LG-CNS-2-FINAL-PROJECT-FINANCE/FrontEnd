import { privateApi } from './axiosInstance';

// Simple validation function
export const validateProductForm = (formData, documentFile, imageFile) => {
    const errors = {};
    
    // Check required fields
    if (!formData.title?.trim()) errors.title = '제목을 입력해주세요.';
    if (!documentFile) {errors.document = '문서 파일을 업로드해주세요.';}
    if (!imageFile) {errors.image = '이미지 파일을 업로드해주세요.';}
    if (!formData.description?.trim()) errors.description = '상세설명을 입력해주세요.';
    if (!formData.summary?.trim()) errors.summary = '상품요약을 입력해주세요.';
    if (!formData.goalAmount || formData.goalAmount <= 0) errors.goalAmount = '목표 모집금액을 입력해주세요.';
    if (!formData.minInvestment || formData.minInvestment <= 0) errors.minInvestment = '최소 투자금액을 입력해주세요.';
    if (!formData.startDate) errors.startDate = '시작일을 선택해주세요.';
    if (!formData.endDate) errors.endDate = '종료일을 선택해주세요.';
    
    // Date validation
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to compare dates only
        
        if (start < now) {
            errors.startDate = '시작일은 오늘 이후여야 합니다.';
        }
        
        if (end <= start) {
            errors.endDate = '종료일은 시작일보다 늦어야 합니다.';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Simple API call to create product
export const createProductRequest = async (formData, documentFile, imageFile) => {
    try {
        const requestData = {
            title: formData.title.trim(),
            summary: formData.summary.trim(),
            content: formData.description.trim(),
            startDate: formData.startDate,
            endDate: formData.endDate,
            goalAmount: parseInt(formData.goalAmount),
            minInvestment: parseInt(formData.minInvestment),
            document: [""],
            image: [""]
        };

        const response = await privateApi.post('/product/request/create', requestData);
        
        return {
            success: true,
            data: response.data,
            title: formData.title,
            requestId: response.data?.requestId
        };
        
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(error.response?.status === 400 ? 
            '입력 정보를 확인해주세요.' : 
            '서버 오류가 발생했습니다.'
        );
    }
};
