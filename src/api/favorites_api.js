import { privateApi } from './axiosInstance';

// Favorites API - 즐겨찾기 토글 (추가/제거)
export const toggleFavorite = async (projectId) => {
    try {
        // POST /toggle/{projectId} - 백엔드 구조에 맞게 수정
        const response = await privateApi.post(`/product/favorite/toggle/${projectId}`);
        return response.data; // { projectId: "project-123", favorited: true/false }
    } catch (error) {
        console.error('[favorites_api] toggleFavorite 오류:', error);
        
        // 403 Forbidden - 권한 없음 (USER가 아닌 경우)
        if (error.response?.status === 403) {
            throw new Error('즐겨찾기 기능은 일반 사용자만 이용할 수 있습니다.');
        }
        
        // 400 Bad Request - 존재하지 않는 프로젝트
        if (error.response?.status === 400) {
            throw new Error('존재하지 않는 프로젝트입니다.');
        }
        
        throw error;
    }
};
