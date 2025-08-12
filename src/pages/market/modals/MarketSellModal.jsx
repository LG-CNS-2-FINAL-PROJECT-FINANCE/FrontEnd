import { useMemo, useState } from "react";
import useScrollLock from "../../../component/ScrollLock";
import SalesChart from "../SalesChart";
import { toast } from "react-toastify";

export default function MarketSellModal({ isOpen, onClose, onConfirm }) {
  useScrollLock(isOpen);
  const [priceStr, setPriceStr] = useState("");
  const [qtyStr, setQtyStr] = useState("");
  // Hook들은 조건부 return 위에
  const price = useMemo(
    () => Number((priceStr || "0").replaceAll(",", "")),
    [priceStr]
  );
  const qty = useMemo(
    () => Number((qtyStr || "0").replaceAll(",", "")),
    [qtyStr]
  );
  const total = useMemo(() => price * qty, [price, qty]);
  if (!isOpen) return null;

  const format = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const onlyDigits = (v) => v.replace(/[^\d]/g, "");

  const handlePriceChange = (e) => {
    const d = onlyDigits(e.target.value);
    setPriceStr(d ? format(d) : "");
  };
  const handleQtyChange = (e) => {
    const d = onlyDigits(e.target.value);
    setQtyStr(d ? format(d) : "");
  };

  const submit = () => {
    if (!price || !qty) return;
    onConfirm?.({ price, qty, total });
    toast.success(`판매 요청이 완료되었습니다.`, {
      style: { backgroundColor: "#fff", color: "#111" },
      progressStyle: { backgroundColor: "#ef4444" },
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-lg  w-full max-w-xl p-6 relative">
        <button
          className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">판매하기</h2>
        <p className="text-center text-gray-500 mb-6">(가격 단위: 원)</p>
        <SalesChart />

        <label className="mt-4 block text-sm text-gray-500 mb-1">
          판매 가격
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={priceStr}
          onChange={handlePriceChange}
          className="w-full border rounded-md px-3 py-2 mb-4"
          placeholder="가격을 입력하세요"
        />

        <label className="block text-sm text-gray-500 mb-1">판매 수량</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={qtyStr}
          onChange={handleQtyChange}
          className="w-full border rounded-md px-3 py-2 mb-4"
          placeholder="수량을 입력하세요"
        />

        <label className="block text-sm text-gray-500 mb-1">총 금액</label>
        <input
          value={total ? total.toLocaleString() : ""}
          readOnly
          className="w-full border rounded-md px-3 py-2 bg-gray-100 mb-6"
        />
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={submit}
            className="w-full px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            판매입찰
          </button>
        </div>
      </div>
    </div>
  );
}
