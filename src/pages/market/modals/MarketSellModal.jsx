import { useMemo, useState } from "react";
import SalesChart from "../SalesChart";
import { toast } from "react-toastify";
import useScrollLock from "../../../component/useScrollLock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tradeSell } from "../../../api/market_api";

export default function MarketSellModal({ tradeHistory, tradeHistoryLoading, projectId, isOpen, onClose, onConfirm }) {
  useScrollLock(isOpen);
  const queryClient = useQueryClient();
  const [priceStr, setPriceStr] = useState("");
  const [qtyStr, setQtyStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const price = useMemo(() => Number((priceStr || "0").replaceAll(",", "")), [priceStr]);
  const qty = useMemo(() => Number((qtyStr || "0").replaceAll(",", "")), [qtyStr]);
  const total = useMemo(() => price * qty, [price, qty]);

  const format = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const onlyDigits = (v) => v.replace(/[^\d]/g, "");
  const handlePriceChange = (e) => setPriceStr((d => d ? format(d) : "")(onlyDigits(e.target.value)));
  const handleQtyChange = (e) => setQtyStr((d => d ? format(d) : "")(onlyDigits(e.target.value)));

  const mutation = useMutation({
    mutationFn: (payload) => tradeSell(payload),
    onSuccess: () => {
      toast.success(`판매 요청이 완료되었습니다.`, { position: "bottom-right" });
      queryClient.refetchQueries({ queryKey: ["purchaseBidHistory", projectId] });
      queryClient.refetchQueries({ queryKey: ["sellBidHistory", projectId] });
      queryClient.refetchQueries({ queryKey: ["tradeHistory", projectId] });
      onClose?.();
    },
    onError: () => {
      toast.error(`판매 요청에 실패하였습니다.`, { position: "bottom-right" });
    },
  });

  // Simple submit function - only calls tradeSell
  const submit = async () => {
    if (!price || !qty) return;

    try {
      setSubmitting(true);

      // Call tradeSell API directly
      await mutation.mutateAsync({
        projectId,
        purchasePrice: price,
        tokenQuantity: qty,
        ordersType: 0,    // 판매
      });

      onConfirm?.({ price, qty, total });
    } catch (e) {
      console.error("Sell error:", e);
      toast.error(e?.message ?? "판매 요청 중 오류", { position: "bottom-right" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose?.(); };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-lg  w-full max-w-xl p-6 relative">
        <button className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>

        <h2 className="text-2xl font-bold text-center mb-1">판매하기</h2>
        <p className="text-center text-gray-500 mb-6">(가격 단위: 원)</p>
        <SalesChart tradeHistory={!tradeHistoryLoading ? tradeHistory : null} />

        <label className="mt-4 block text-sm text-gray-500 mb-1">판매 가격</label>
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
            disabled={submitting || mutation.isPending}
            className={`w-full px-4 py-2 rounded-md text-white ${submitting || mutation.isPending ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
          >
            {submitting || mutation.isPending ? "처리 중..." : "판매입찰"}
          </button>
        </div>
      </div>
    </div>
  );
}
