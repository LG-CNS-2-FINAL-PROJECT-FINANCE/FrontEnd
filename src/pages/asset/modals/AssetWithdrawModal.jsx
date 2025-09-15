import { useMemo, useState } from "react";
import useScrollLock from "../../../component/useScrollLock";
import { CiCircleQuestion } from "react-icons/ci";
import { useQueryClient } from "@tanstack/react-query";

function AssetWithdrawModal({ isOpen, onClose, onConfirm }) {
  useScrollLock(isOpen);
  const queryClient = useQueryClient();
  const account = queryClient.getQueryData(["account"]);
  const maxWithdraw = useMemo(
      () => Number(account?.deposit || 0),
      [account]
    );
  // 콤마 포함 문자열 상태로 관리
  const [priceStr, setPriceStr] = useState("");

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 3자리 콤마 포맷터
  const formatNumber = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 숫자만 유지하면서 콤마 적용
  const handlePriceChange = (e) => {
    let onlyDigits = e.target.value.replace(/[^\d]/g, "");
    if (onlyDigits === "") {
      setPriceStr("");
      return;
    }

    let numeric = Number(onlyDigits);

    // 최대 금액 초과 시 최대값으로 클램프
    if (numeric > maxWithdraw) {
      numeric = maxWithdraw;
      onlyDigits = String(maxWithdraw);
    }
    setPriceStr(formatNumber(onlyDigits));
  };

  const numericAmount = Number(priceStr.replaceAll(",", "") || 0);
  const isMax = numericAmount === maxWithdraw && numericAmount > 0;
  const isZero = !numericAmount || numericAmount <= 0;

  const handleSubmit = () => {
    if (isZero || numericAmount > maxWithdraw) return;
    onConfirm(numericAmount);
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

        <h1 className="text-3xl font-bold mb-1 text-center">출금하기</h1>
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
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 items-center text-gray-600">
              <span>출금 가능</span>
              <CiCircleQuestion />
            </div>
            <span className="text-gray-500">{formatNumber(String(account.deposit))} 원 </span>
          </div>

          <input
            type="text" // 콤마 표기를 위해 text 사용
            inputMode="numeric" // 모바일 숫자 키패드
            pattern="[0-9]*" // 숫자만
            value={priceStr}
            onChange={handlePriceChange}
            className="mt-8 w-full border rounded-lg px-4 py-2"
            placeholder="출금하실 금액을 입력해주세요"
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
            type="button"
            className="bg-red-300 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors font-semibold"
          >
            출금신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetWithdrawModal;
