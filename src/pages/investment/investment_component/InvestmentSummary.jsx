import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShareAlt,
  FaRegStar,
  FaStar,
  FaFlag,
} from "react-icons/fa";
import { RiMoneyCnyBoxFill, RiMoneyCnyBoxLine } from "react-icons/ri";
import { toast } from "react-toastify";
import InvestmentModal from "./InvestmentModal";
import InvestmentCancelModal from "./InvestmentCancelModal";
import StopRequestModal from "./StopRequestModal";
import ReportModal from "./ReportModal";
import { useTheme } from "../../../context/ThemeContext";
import { toggleFavorite } from "../../../api/favorites_api";
import useUser from "../../../lib/useUser";

function InvestmentSummary({
  title,
  projectNumber,
  startDate,
  endDate,
  author,
  isFavorite: initialIsFavorite,
  isInvested,
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
  
  //User 확인 - role이 CREATOR인지
  const isCreator = user?.role === 'CREATOR';

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  // 공유하기, 즐겨찾기, 신고
  const handleShare = async () => {
    try {
      // 현재 URL을 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 클립보드에 복사되었습니다!", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('링크 복사 실패:', error);
      toast.error("링크 복사에 실패했습니다.", {position: "bottom-right"});
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
      
      // 사용자에게 피드백 - toast로 변경
      toast.success(`즐겨찾기 ${newFavoriteState ? "추가" : "해제"}되었습니다!`, {
        position: "bottom-right",
      });
      
    } catch (error) {
      console.error('Favorite toggle error:', error);
      
      // 에러 메시지 표시 - alert 유지 (에러는 더 강한 피드백 필요)
      if (error.message) {
        alert(error.message);
      } else {
        alert('즐겨찾기 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleInvest = () => {
    if (isCreator) {
      setIsStopModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCancelInvestment = () => {
    if (isCreator) {
      // 수정 요청 - ProductEdit 페이지로 이동
      navigate(`/product-edit/${projectNumber}`);
    } else {
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
      <p className="text-gray-600 mb-4">프로젝트 번호: {projectNumber}</p>

      <div className="flex justify-between items-start text-sm text-gray-500 mb-4">
        <div>
          <span>
            기간: {startDate} ~ {endDate}
          </span>
          <span className="ml-4">작성자: {author}</span>
        </div>

        <div className="flex flex-col space-y-2">
          {/* 투자하기, 투자 취소 버튼 */}
          <div className="flex justify-end space-x-2">
            {/* 분배요청 버튼 - 창작자만 보임 */}
            {isCreator && (
              <button
                onClick={() => alert("분배 요청을 보냅니다.")}
                className="border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-md font-semibold flex items-center transition-colors"
              >
                <RiMoneyCnyBoxLine className="inline-block mr-1" /> 분배요청
              </button>
            )}

            <button
              onClick={handleInvest}
              className={`${themeColors.primaryBg} text-white py-2 px-3 rounded-md hover:${themeColors.primaryHover} transition-colors font-semibold flex items-center`}
            >
              {isInvested ? (
                <RiMoneyCnyBoxFill className="inline-block mr-1" />
              ) : (
                <RiMoneyCnyBoxLine className="inline-block mr-1" />
              )}
              {isCreator ? "중단요청" : "투자하기"}{" "}
              {/*원래 추가투자하기였는데 일단 그냥 하나로 보이게 변경 해둠*/}
            </button>

            <button
              onClick={handleCancelInvestment}
              className="border border-gray-300 py-2 px-3 rounded-md font-semibold flex items-center text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RiMoneyCnyBoxLine className="inline-block mr-1" /> {isCreator ? "수정요청" : "투자취소"}
            </button>
          </div>

          {/* 공유, 즐겨찾기, 신고 버튼 */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleShare}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <FaShareAlt className="inline-block mr-1" /> 공유
            </button>

            {/* 즐겨찾기 버튼은 일반 사용자(USER)만 볼 수 있음 */}
            {!isCreator && (
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
                {isFavoriteLoading ? "처리중..." : "즐겨찾기"}
              </button>
            )}

            <button
              onClick={handleReport}
              className={`${themeColors.primaryText} hover:${themeColors.primaryText} opacity-75 flex items-center`}
            >
              <FaFlag className="inline-block mr-1" /> 신고
            </button>
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
