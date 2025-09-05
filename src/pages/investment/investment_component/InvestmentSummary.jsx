import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShareAlt,
  FaRegStar,
  FaStar,
  FaFlag,
} from "react-icons/fa";
import { toast } from "react-toastify";
import InvestmentModal from "./InvestmentModal";
import InvestmentCancelModal from "./InvestmentCancelModal";
import StopRequestModal from "./StopRequestModal";
import ReportModal from "./ReportModal";
import { useTheme } from "../../../context/ThemeContext";
import { toggleFavorite } from "../../../api/favorites_api";
import useUser from "../../../lib/useUser";
import { useTranslation } from 'react-i18next';

function InvestmentSummary({
  title,
  projectNumber,
  startDate,
  nickname,
  endDate,
  author,
  isFavorite: initialIsFavorite,
  minInvestment,
  imageUrl,
  summary,
  tokenPrice,
  reporterId,
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { themeColors } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

  const { t } = useTranslation();
  
  // User 확인 - role Creator인지, author 작성자인지
  const isProjectOwner = user?.role === 'CREATOR' && user?.userSeq === author;

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  // 공유하기, 즐겨찾기, 신고
  const handleShare = async () => {
    try {
      // 현재 URL을 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('investment_summary_share_success_toast'), {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('링크 복사 실패:', error);
      toast.error(t('investment_summary_share_fail_toast'), {position: "bottom-right"});
    }
  };
  const handleFavoriteToggle = async () => {
    if (isFavoriteLoading) return;
    
    setIsFavoriteLoading(true);
    
    try {
      // API 호출로 즐겨찾기 토글
      const result = await toggleFavorite(projectNumber);
      
      // 서버에서 받은 결과로 상태 업데이트 (백엔드 응답 구조에 맞춤)
      const newFavoriteState = result.favorited;
      setIsFavorite(newFavoriteState);
      
      toast.success(newFavoriteState ? t('investment_summary_favorite_toggle_success_add') : t('investment_summary_favorite_toggle_success_remove'), {
        position: "bottom-right",
      });
      
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error(error.message || t('investment_summary_favorite_toggle_error_fallback'), {
        position: "bottom-right",
      });
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleInvest = () => {
    if (isProjectOwner) {
      //중단요청 버튼
      setIsStopModalOpen(true);
    } else {
      // 투자하기 버튼
      setIsModalOpen(true);
    }
  };

  const handleCancelInvestment = () => {
    if (isProjectOwner) {
      // 수정요청 버튼
      navigate(`/product-edit/${projectNumber}`);
    } else {
      // 투자취소 버튼
      setIsCancelModalOpen(true);
    }
  };

  //투자하기 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  //투자 취소 모달 닫기
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  //중단 요청 모달 닫기
  const closeStopModal = () => {
    setIsStopModalOpen(false);
  };

  //신고하기 모달 닫기
  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportSubmit = (reportData) => {
    console.log("신고 데이터:", reportData);
  };

  return (
    <div className="bg-white py-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">{t('investment_summary_project_number_label')}: {projectNumber}</p>

      <div className="flex justify-between items-start text-sm text-gray-500 mb-4">
        <div>
          <span>
            {t('investment_summary_period_label')}: {startDate} ~ {endDate}
          </span>
          <span className="ml-4">{t('investment_summary_author_label')}: {nickname}</span>
        </div>

        <div className="flex flex-col space-y-2">
          {(isProjectOwner || user?.role !== 'CREATOR') && (
            <div className="flex justify-end space-x-2">
              {/* 분배요청 버튼 - 프로젝트 소유자만 보임 (CREATOR + matching userSeq) */}
              {isProjectOwner && (
                <button
                  onClick={() => alert("분배 요청을 보냅니다.")}
                  className="border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-md font-semibold flex items-center transition-colors"
                >
                  {t('investment_summary_distribute_request_button')}
                </button>
              )}

              <button
                onClick={handleInvest}
                className={`${themeColors.primaryBg} text-white py-2 px-3 rounded-md hover:${themeColors.primaryHover} transition-colors font-semibold flex items-center`}
              >
                {isProjectOwner ? t('investment_summary_stop_request_button') : t('investment_summary_invest_button')}
              </button>

              <button
                onClick={handleCancelInvestment}
                className="border border-gray-300 py-2 px-3 rounded-md font-semibold flex items-center text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isProjectOwner ? t('investment_summary_edit_request_button') : t('investment_summary_cancel_investment_button')}
              </button>
            </div>
          )}

          {/* 공유, 즐겨찾기, 신고 버튼 */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleShare}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <FaShareAlt className="inline-block mr-1" /> {t('investment_summary_share_button')}
            </button>

            {/* 즐겨찾기 버튼은 프로젝트 소유자가 아닌 모든 사용자가 볼 수 있음 */}
            {!isProjectOwner && (
              <button
                onClick={handleFavoriteToggle}
                disabled={isFavoriteLoading}
                className={`text-yellow-500 hover:text-yellow-700 flex items-center transition-colors ${
                  isFavoriteLoading ? 'opacity-50 cursor-wait' : ''
                }`}
              >
                {isFavorite ? (
                  <FaStar className="inline-block mr-1" />
                ) : (
                  <FaRegStar className="inline-block mr-1" />
                )}{" "}
                {isFavoriteLoading ? t('investment_summary_processing_text') : t('investment_summary_favorite_button')}
              </button>
            )}

            {/* 신고 버튼은 프로젝트 소유자가 아닌 모든 사용자가 볼 수 있음 */}
            {!isProjectOwner && (
              <button
                onClick={handleReport}
                className={`${themeColors.primaryText} hover:${themeColors.primaryText} opacity-75 flex items-center`}
              >
                <FaFlag className="inline-block mr-1" /> {t('investment_summary_report_button')}
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="my-4" />

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projectId={projectNumber}
        minInvestment={minInvestment}
        imageUrl={imageUrl}
        title={title}
        summary={summary}
        author={author}
        tokenPrice={tokenPrice}
        nickname={nickname}
      />

      <InvestmentCancelModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        projectId={projectNumber}
        title={title}
      />

      <StopRequestModal
        isOpen={isStopModalOpen}
        onClose={closeStopModal}
        projectId={projectNumber}
        title={title}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        projectNumber={projectNumber} // prop으로 받은 projectNumber 전달
        reporterId={reporterId} // prop으로 받은 reporterId 전달
        onSubmitReport={handleReportSubmit} // 신고 처리 함수 전달
      />
    </div>
  );
}

export default InvestmentSummary;
