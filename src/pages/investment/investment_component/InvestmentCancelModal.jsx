import React, { useState, useEffect } from "react";
import useScrollLock from "../../../component/useScrollLock";
import { getMyInvestments, cancelInvestment } from "../../../api/investment_api";

function InvestmentCancelModal({
isOpen,
onClose,
projectId,
title
}) {
const [investments, setInvestments] = useState([]);
const [selectedInvestment, setSelectedInvestment] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [isCancelling, setIsCancelling] = useState(false);

//스크롤 방지
useScrollLock(isOpen);

useEffect(() => {
    if (isOpen && projectId) {
    fetchMyInvestments();
    }
}, [isOpen, projectId]);

const fetchMyInvestments = async () => {
    setIsLoading(true);
    try {
        const data = await getMyInvestments(projectId);
        setInvestments(data || []);
        
    } catch (error) {
        console.error('Failed to fetch investments:', error);
        alert('투자 내역을 불러오는데 실패했습니다.');
    } finally {
        setIsLoading(false);
    }
};

const handleCancelInvestment = async () => {
    if (!selectedInvestment) {
    return;
    }

    const confirmCancel = window.confirm(
    `정말로 이 투자를 취소하시겠습니까?\n투자금액: ${selectedInvestment.investedPrice?.toLocaleString()}원\n토큰수량: ${selectedInvestment.tokenQuantity}개`
    );

    if (!confirmCancel) return;

    setIsCancelling(true);
    
    try {
        await cancelInvestment(selectedInvestment.investmentSeq, {
            investmentSeq: selectedInvestment.investmentSeq,   
            projectId: projectId,                             
        });
    
    alert('투자 취소가 완료되었습니다.');
    onClose();
    window.location.reload();
    
    } catch (error) {
    console.error('Cancel investment error:', error);
    if (error.response?.status === 400) {
        alert('투자 취소에 실패했습니다. 이미 취소된 투자이거나 취소할 수 없는 상태입니다.');
    } else {
        alert('투자 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    } finally {
    setIsCancelling(false);
    }
};

if (!isOpen) return null;

// 모달 외부 클릭 시 닫히도록 설정
const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
    onClose();
    }
};

return (
    <div
    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    onClick={handleOverlayClick}
    >
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative animate-fade-in">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
        &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">투자 취소하기</h2>
        <p className="text-center text-gray-600 mb-6">프로젝트: {title}</p>
        <hr className="mb-6" />

        {isLoading ? (
        <div className="text-center py-8">
            <p>투자 내역을 불러오는 중...</p>
        </div>
        ) : investments.length === 0 ? (
        <div className="text-center py-8">
            <p className="text-gray-500">이 프로젝트에 대한 투자 내역이 없습니다.</p>
        </div>
        ) : (
        <>
            <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">내 투자 내역</h3>
            <div className="space-y-3">
                {investments.map((investment, index) => (
                <div
                    key={investment.investmentSeq || index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedInvestment?.investmentSeq === investment.investmentSeq
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedInvestment(investment)}
                >
                    <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">투자금액: {investment.investedPrice?.toLocaleString()}원</p>
                        <p className="text-sm text-gray-600">토큰수량: {investment.tokenQuantity}개</p>
                        <p className="text-sm text-gray-500">
                        투자일: {new Date(investment.investedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-1 rounded text-sm ${
                        investment.invStatus === 'FUNDING' ? 'bg-green-100 text-green-800' :
                        investment.invStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                        }`}>
                        {investment.invStatus === 'FUNDING' ? '펀딩중' : '대기중'}
                        </span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
                <button
                onClick={onClose}
                disabled={isCancelling}
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors font-semibold flex-1 max-w-[120px] disabled:opacity-50"
                >
                닫기
                </button>
                <button
                onClick={handleCancelInvestment}
                disabled={!selectedInvestment || isCancelling}
                className={`
                    py-2 px-6 rounded-md font-semibold transition-colors flex-1 max-w-[120px]
                    ${selectedInvestment && !isCancelling
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-300 text-gray-100 cursor-not-allowed'
                    }
                `}
            >
            {isCancelling ? '취소중...' : '확인하기'}
            </button>
        </div>
        </>
    )}
    </div>
</div>
);
}

export default InvestmentCancelModal;
