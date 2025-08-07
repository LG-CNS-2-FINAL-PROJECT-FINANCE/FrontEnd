import React, {useEffect, useState} from 'react';
import useScrollLock from "../../../component/ScrollLock";

function InvestmentModal({ isOpen, onClose, minInvestment, imageUrl, title, summary, author, tokenPrice }) {

    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState(minInvestment || 0);

    //스크롤 방지
    useScrollLock(isOpen);

    if (!isOpen) return null;

    // 모달 외부 클릭 시 닫히도록 설정
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirmChange = (e) => {
        setHasConfirmed(e.target.checked);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setInvestmentAmount('');
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setInvestmentAmount(numValue);
            }
        }
    };

    // 실제 투자 신청 버튼 클릭
    const handleApplyInvestment = () => {
        if (!hasConfirmed) {
            alert('투자에 대한 정보를 확인했음을 체크해 주세요.');
            return;
        }
        if (investmentAmount < minInvestment) {
            alert(`최소 투자 금액은 ${minInvestment.toLocaleString()}원입니다.`);
            return;
        }

        const expectedTokens = tokenPrice > 0 ? (investmentAmount / tokenPrice) : 0;

        alert(`
            투자 신청 완료!
            프로젝트: ${title}
            금액: ${investmentAmount.toLocaleString()}원
            예상 토큰 수량: ${expectedTokens.toFixed(2)}개
        `);
        onClose();
    };

    const expectedTokens = tokenPrice > 0 ? (investmentAmount / tokenPrice) : 0; // 예상 토큰 수량 계산

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

                <h2 className="text-2xl font-bold mb-4 text-center">투자 신청하기</h2>
                <hr className="mb-6"/>

                <div className="flex items-start gap-4 mb-6">
                    {imageUrl && (
                        <div className="flex-shrink-0 w-28 h-28">
                            <img
                                src={imageUrl}
                                alt="프로젝트 이미지"
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>
                    )}
                    <div className="flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-1">{title}</h3>
                        <p className="text-gray-600 text-sm mb-2">작성자: {author}</p>
                        <p className="text-gray-700 text-sm overflow-hidden text-ellipsis line-clamp-3">{summary}</p>
                    </div>
                </div>
                <hr className="mb-6"/>

                <div className="mb-6">
                    <div className="flex justify-between items-center text-lg font-bold mb-2">
                        <span className="text-gray-800">토큰 하나 가격:</span>
                        <span className="text-red-600">{tokenPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center text-base mb-4">
                        <span className="text-gray-700">최소 투자 금액:</span>
                        <span className="text-blue-600 font-semibold">{minInvestment.toLocaleString()}원</span>
                    </div>

                    <div className="flex items-center mt-4 p-3 bg-gray-100 rounded-md">
                        <input
                            type="checkbox"
                            id="hasConfirmed"
                            checked={hasConfirmed}
                            onChange={handleConfirmChange}
                            className="mr-2 h-5 w-5 text-red-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor="hasConfirmed" className="text-gray-800 font-semibold cursor-pointer">
                            해당 프로젝트의 정보를 확인했습니다.
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="investmentAmount" className="block text-gray-700 text-base font-bold mb-2">
                        투자 금액:
                    </label>
                    <input
                        type="number"
                        id="investmentAmount"
                        name="investmentAmount"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        placeholder="투자 금액을 입력하세요 (원)"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min={minInvestment}
                    />
                    <p className="text-right text-sm text-gray-500 mt-2">
                        예상 토큰 수량: <span className="font-semibold">{expectedTokens.toFixed(2)}개</span>
                    </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-semibold"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleApplyInvestment}
                        className={`
                            py-2 px-4 rounded-md font-semibold transition-colors
                            ${hasConfirmed && investmentAmount >= minInvestment
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-red-300 text-gray-100 cursor-not-allowed'}
                        `}
                        disabled={!hasConfirmed || investmentAmount < minInvestment}
                    >
                        신청하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvestmentModal;