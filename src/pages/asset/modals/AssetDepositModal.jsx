import { useState } from "react";
import useScrollLock from "../../../component/useScrollLock";
import { CiCircleQuestion } from "react-icons/ci";

function AssetDepositModal({ isOpen, onClose, onConfirm }) {
  useScrollLock(isOpen);

  // 화면에 보이는 값(콤마 포함)
  const [priceStr, setPriceStr] = useState("");
  const MAX_AMOUNT = 11_000_000_000; // 최대 10억
  const MAX_DIGITS = String(MAX_AMOUNT).length;


  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatNumber = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handlePriceChange = (e) => {
    // 숫자만 추출
    let onlyDigits = e.target.value.replace(/[^\d]/g, "");

    // 자리수 제한 (콤마 제외 순수 숫자 기준)
    if (onlyDigits.length > MAX_DIGITS) {
      onlyDigits = onlyDigits.slice(0, MAX_DIGITS);
    }

    // 값 숫자로
    let numeric = Number(onlyDigits);

    // 0 또는 빈 문자열
    if (!onlyDigits) {
      setPriceStr("");
      return;
    }

    // 최대값 초과 시 무시(현재 값 유지) 또는 clamp
    if (numeric > MAX_AMOUNT) {
      // 1) 무시 → 그냥 return (입력 불가)
      return;
      // 2) clamp 원하면 위 return 지우고 numeric = MAX_AMOUNT; onlyDigits = String(MAX_AMOUNT);
    }

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
          type="button"
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
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 items-center text-gray-600">
              <span>최대 입금 가능</span>
              <CiCircleQuestion />
            </div>
            <span className="text-gray-500">9,999,999,999원</span>
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
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            type="button"
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
