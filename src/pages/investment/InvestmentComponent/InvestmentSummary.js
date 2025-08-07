import React, { useState } from 'react';
import { FaShareAlt, FaRegStar, FaStar, FaFlag, FaRegMoneyBillAlt, FaMoneyBillAlt } from 'react-icons/fa';
import { RiMoneyCnyBoxFill, RiMoneyCnyBoxLine } from 'react-icons/ri';


function InvestmentSummary({ title, projectNumber, startDate, endDate, author, isFavorite: initialIsFavorite, isInvested }) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    // 공유하기, 즐겨찾기, 신고 로직
    const handleShare = () => { alert('공유하기!'); };
    const handleFavoriteToggle = () => {setIsFavorite(!isFavorite); alert(`즐겨찾기 ${isFavorite ? '해제' : '추가'}!`); };
    const handleReport = () => {alert('신고하기!'); };

    const handleInvest = () => {
        alert('투자하기 (또는 추가 투자하기)!');

        window.location.reload();
    };
    const handleCancelInvestment = () => {
        alert('투자를 취소합니다.');

        window.location.reload();
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600 mb-4">프로젝트 번호: {projectNumber}</p>

            <div className="flex justify-between items-start text-sm text-gray-500 mb-4">
                <div>
                    <span>기간: {startDate} ~ {endDate}</span>
                    <span className="ml-4">작성자: {author}</span>
                </div>

                <div className="flex flex-col space-y-2">

                    {/* 1. 상단 버튼 그룹: 투자하기, 투자 취소 */}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleInvest}
                            className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition-colors font-semibold flex items-center"
                        >
                            {isInvested ? <RiMoneyCnyBoxFill className="inline-block mr-1" /> : <RiMoneyCnyBoxLine className="inline-block mr-1" />}
                            {isInvested ? '추가 투자하기' : '투자하기'}
                        </button>

                        <button
                            onClick={handleCancelInvestment}
                            className={`
                border border-gray-300 py-2 px-3 rounded-md font-semibold flex items-center
                ${isInvested ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed bg-gray-100'}
              `}
                            disabled={!isInvested}
                        >
                            <RiMoneyCnyBoxLine className="inline-block mr-1" /> 투자취소
                        </button>
                    </div>

                    {/* 2. 하단 버튼 그룹: 공유, 즐겨찾기, 신고 */}
                    <div className="flex justify-end space-x-2">
                        <button onClick={handleShare} className="text-blue-500 hover:text-blue-700 flex items-center">
                            <FaShareAlt className="inline-block mr-1" /> 공유
                        </button>

                        <button onClick={handleFavoriteToggle} className="text-yellow-500 hover:text-yellow-700 flex items-center">
                            {isFavorite ? <FaStar className="inline-block mr-1" /> : <FaRegStar className="inline-block mr-1" />} 즐겨찾기
                        </button>

                        <button onClick={handleReport} className="text-red-500 hover:text-red-700 flex items-center">
                            <FaFlag className="inline-block mr-1" /> 신고
                        </button>
                    </div>

                </div>
            </div>
            <hr className="my-4"/>
        </div>
    );
}

export default InvestmentSummary;