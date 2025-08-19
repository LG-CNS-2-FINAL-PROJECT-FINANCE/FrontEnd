import React, { useState } from "react";
import {
  FaShareAlt,
  FaRegStar,
  FaStar,
  FaFlag,
} from "react-icons/fa";
import { RiMoneyCnyBoxFill, RiMoneyCnyBoxLine } from "react-icons/ri";
import InvestmentModal from "./InvestmentModal";
import ReportModal from "./ReportModal";
import { useTheme } from "../../../context/ThemeContext";

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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { themeColors } = useTheme();

  // 공유하기, 즐겨찾기, 신고
  const handleShare = () => {
    alert("공유하기!");
  };
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    alert(`즐겨찾기 ${isFavorite ? "해제" : "추가"}!`);
  };
  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleInvest = () => {
    setIsModalOpen(true);
  };

  const handleCancelInvestment = () => {
    alert("투자를 취소합니다.");

    window.location.reload();
  };

  //투자하기 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
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
            <button
              onClick={handleInvest}
              className={`${themeColors.primaryBg} text-white py-2 px-3 rounded-md hover:${themeColors.primaryHover} transition-colors font-semibold flex items-center`}
            >
              {isInvested ? (
                <RiMoneyCnyBoxFill className="inline-block mr-1" />
              ) : (
                <RiMoneyCnyBoxLine className="inline-block mr-1" />
              )}
              {isInvested ? "투자하기" : "투자하기"}{" "}
              {/*원래 추가투자하기였는데 일단 그냥 하나로 보이게 변경 해둠*/}
            </button>

            <button
              onClick={handleCancelInvestment}
              className={`
                                border border-gray-300 py-2 px-3 rounded-md font-semibold flex items-center
                                ${
                                  isInvested
                                    ? "text-gray-700 hover:bg-gray-100"
                                    : "text-gray-400 cursor-not-allowed bg-gray-100"
                                }
                            `}
              disabled={!isInvested}
            >
              <RiMoneyCnyBoxLine className="inline-block mr-1" /> 투자취소
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

            <button
              onClick={handleFavoriteToggle}
              className="text-yellow-500 hover:text-yellow-700 flex items-center"
            >
              {isFavorite ? (
                <FaStar className="inline-block mr-1" />
              ) : (
                <FaRegStar className="inline-block mr-1" />
              )}{" "}
              즐겨찾기
            </button>

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
        minInvestment={minInvestment}
        imageUrl={imageUrl}
        title={title}
        summary={summary}
        author={author}
        tokenPrice={tokenPrice}
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
