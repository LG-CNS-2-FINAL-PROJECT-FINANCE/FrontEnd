import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useScrollLock from '../../../component/useScrollLock';
import { useTheme } from '../../../context/ThemeContext';
import { createReport } from '../../../api/report_api';

function ReportModal({ isOpen, onClose, projectNumber, reporterId, onSubmitReport }) {
    const [selectedType, setSelectedType] = useState(''); // 선택된 신고 유형
    const [reportContent, setReportContent] = useState(''); // 신고 내용
    const [isSubmitting, setIsSubmitting] = useState(false); // API 호출 중 상태
    const { themeColors } = useTheme();

    useScrollLock(isOpen);
    // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    // 신고 유형 목록 (backend에서 Integer로 처리 숫자로 변경)
    const reportTypes = [
        { value: 1, label: '사용자 신고' },
        { value: 2, label: '유익하지 않은 컨텐츠' },
        { value: 3, label: '허위정보제공' },
    ];

    // 모달 외부 클릭 시 닫히도록 하는 함수
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // 신고 유형 선택 핸들러
    const handleTypeSelect = (typeValue) => {
        setSelectedType(typeValue);
    };

    // 신고 내용 변경 핸들러
    const handleContentChange = (e) => {
        setReportContent(e.target.value);
    };

    // 신고하기 버튼 클릭 핸들러
    const handleSubmit = async () => {
        if (!selectedType) {
            toast.error('신고 유형을 선택해주세요.', { position: "bottom-right" });
            return;
        }
        if (reportContent.trim() === '') {
            toast.error('신고 내용을 입력해주세요.', { position: "bottom-right" });
            return;
        }

        setIsSubmitting(true);

        try {
            const reportDto = {
                reportId: null,
                projectId: String(projectNumber),
                reportType: selectedType,
                content: reportContent.trim(),
            };
            
            await createReport(reportDto);
            
            toast.success("신고가 접수되었습니다. 빠른 시일 내에 처리하겠습니다.", {
                position: "bottom-right",
            });
            
            setSelectedType('');
            setReportContent('');
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "신고 접수 중 오류가 발생했습니다.";
            toast.error(errorMessage, {
                position: "bottom-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 제출 버튼 활성화 조건
    const isSubmitEnabled = selectedType && reportContent.trim() !== '' && !isSubmitting;

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">프로젝트 신고하기</h2>

                {/* 신고 정보 요약 */}
                <div className="mb-4 text-gray-700">
                    <p><span className="font-semibold">신고 프로젝트:</span> {projectNumber}</p>
                </div>
                <hr className="my-4" />

                {/* 신고 유형 선택 */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">신고 유형 선택</h3>
                    <div className="flex flex-wrap gap-2">
                        {reportTypes.map((type) => (
                            <button
                                key={type.value}
                                className={`
                                    py-2 px-4 rounded-full border transition-colors
                                    ${selectedType === type.value
                                    ? `${themeColors.primaryBg} text-white ${themeColors.primaryBorder}`
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
                                `}
                                onClick={() => handleTypeSelect(type.value)}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 신고 내용 입력 */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">신고 내용</h3>
                    <textarea
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-${themeColors.primary.replace('-500', '-400')}`}
                        rows="5"
                        placeholder="상세한 신고 내용을 입력해주세요."
                        value={reportContent}
                        onChange={handleContentChange}
                    ></textarea>
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-semibold"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`
                            py-2 px-4 rounded-md font-semibold transition-colors
                            ${isSubmitEnabled
                            ? `${themeColors.primaryBg} text-white hover:${themeColors.primaryHover}`
                            : `${themeColors.primaryBg} opacity-50 text-gray-100 cursor-not-allowed`}
                        `}
                        disabled={!isSubmitEnabled}
                    >
                        {isSubmitting ? "처리중..." : "신고하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;