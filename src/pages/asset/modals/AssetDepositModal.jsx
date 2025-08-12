import { useState } from "react";
import useScrollLock from "../../../component/ScrollLock";
import { CiCircleQuestion } from "react-icons/ci";

function AssetDepositModal({ isOpen, onClose, onConfirm }) {
  useScrollLock(isOpen);

  // 화면에 보이는 값(콤마 포함)
  const [priceStr, setPriceStr] = useState("");

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatNumber = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handlePriceChange = (e) => {
    // 숫자만 남기고 나머지 제거
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    // 빈값은 그대로 빈문자열 유지
    if (onlyDigits === "") {
      setPriceStr("");
      return;
    }
    // 콤마 포맷 적용
    setPriceStr(formatNumber(onlyDigits));
  };

  const handleSubmit = () => {
    // 콤마 제거 후 숫자로 변환
    const amount = Number(priceStr.replaceAll(",", ""));
    if (!amount || amount <= 0) return;
    onConfirm(amount); // 부모로 숫자 전달
  };

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

        <h1 className="text-3xl font-bold mb-1 text-center">입금하기</h1>
        <h3 className="text-md text-gray-500 mb-6 text-center">
          (가격단위:원)
        </h3>
        <hr className="mb-6" />

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center text-gray-600">
              <span>실명 계좌</span>
              <CiCircleQuestion />
            </div>
            <span className="text-gray-500">100012641093</span>
          </div>

          <input
            type="text" // number 대신 text로 변경(콤마 표시용)
            inputMode="numeric" // 모바일에서 숫자 키패드
            pattern="[0-9]*" // 숫자만
            value={priceStr}
            onChange={handlePriceChange}
            className="mt-8 w-full border rounded-lg px-4 py-2"
            placeholder="입금하실 금액을 입력해주세요"
          />
        </div>

        <div className="flex justify-center space-x-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-300 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors font-semibold"
          >
            입금신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetDepositModal;
