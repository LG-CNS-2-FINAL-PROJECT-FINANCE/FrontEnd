import { privateApi } from './axiosInstance';

// Simple validation function
export const validateProductForm = (formData, documentUrl = "", imageUrl = "") => {
    const errors = {};
    
    // Check required fields
    if (!formData.title?.trim()) errors.title = '제목을 입력해주세요.';
    if (!documentUrl) {errors.document = '문서 파일을 업로드해주세요.';}
    if (!imageUrl) {errors.image = '이미지 파일을 업로드해주세요.';}
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
export const createProductRequest = async (formData, documentUrl = "", imageUrl = "") => {
    try {
        const requestData = {
            title: formData.title.trim(),
            summary: formData.summary.trim(),
            content: formData.description.trim(),
            startDate: formData.startDate,
            endDate: formData.endDate,
            goalAmount: parseInt(formData.goalAmount),
            minInvestment: parseInt(formData.minInvestment),
            document: documentUrl && documentUrl.trim() ? [documentUrl] : [],
            image: imageUrl && imageUrl.trim() ? [imageUrl] : []
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

// Submit stop request for a project
export const submitStopRequest = async ({ projectId, reason, document = [], image = [] }) => {
    try {
        // Filter out empty strings from arrays
        const cleanDocument = document.filter(doc => doc && doc.trim() !== '');
        const cleanImage = image.filter(img => img && img.trim() !== '');
        
        const response = await privateApi.post('/product/request/stop', {
            projectId: projectId,
            document: cleanDocument,
            image: cleanImage,
            reason: reason
        });
        
        return response.data; // Should return requestId
        
    } catch (error) {
        console.error('Stop request API Error:', error);
        
        // Handle specific error cases
        if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || '잘못된 요청입니다.');
        } else if (error.response?.status === 409) {
            throw new Error('이미 대기 중인 요청이 있습니다.');
        } else {
            throw new Error('중단 요청 처리 중 오류가 발생했습니다.');
        }
    }
};


// Upload file to S3
export const uploadFileToS3 = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await privateApi.post('/product/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return {
            success: true,
            url: response.data // The response should be the URL string
        };
        
    } catch (error) {
        console.error('File upload API Error:', error);
        throw new Error(
            error.response?.data?.message || 
            '파일 업로드 중 오류가 발생했습니다.'
        );
    }
};

// Submit update request for a project
export const submitUpdateRequest = async ({ projectId, formData, reason, document = [], image = [] }) => {
    try {
        // Filter out empty strings from arrays
        const cleanDocument = document.filter(doc => doc && doc.trim() !== '');
        const cleanImage = image.filter(img => img && img.trim() !== '');
        
        const response = await privateApi.post('/product/request/update', {
            projectId: projectId,
            title: formData.title.trim(),
            summary: formData.summary.trim(),
            content: formData.description.trim(),
            startDate: formData.startDate,
            endDate: formData.endDate,
            goalAmount: parseInt(formData.goalAmount),
            minInvestment: parseInt(formData.minInvestment),
            document: cleanDocument,
            image: cleanImage,
            reason: reason.trim() // Add reason field
        });
        
        return {
            success: true,
            data: response.data,
            requestId: response.data?.requestId || response.data
        };
        
    } catch (error) {
        console.error('Update request API Error:', error);
        
        // Handle specific error cases
        if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || '잘못된 요청입니다.');
        } else if (error.response?.status === 403) {
            throw new Error('권한이 없습니다. (CREATOR 권한 필요)');
        } else if (error.response?.status === 409) {
            throw new Error('이미 대기 중인 요청이 있습니다.');
        } else {
            throw new Error('수정 요청 처리 중 오류가 발생했습니다.');
        }
    }
};
