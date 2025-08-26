import { useMutation, useQueryClient } from "@tanstack/react-query";
import { depositAccount, withdrawalAccount } from "../../../api/asset_api";
import useScrollLock from "../../../component/useScrollLock";
import { toast } from "react-toastify";

function AssetCheckModal({
  isOpen,
  onClose,
  onConfirmAll,
  amount,
  type = "입금",
}) {
  useScrollLock(isOpen);
  const queryClient = useQueryClient();
  const depositMutation = useMutation({
    mutationFn: depositAccount,
    onSuccess: async () => {
      toast.success("계좌 입금 성공! 🎉", {
        position: "bottom-right",
      });
      queryClient.refetchQueries({ queryKey: ["account"] });
      queryClient.refetchQueries({ queryKey: ["accountAllHistory"] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        "계좌 입금에 실패했어요. 다시 시도해 주세요.😢";
      toast.error(msg, { position: "bottom-right" });
    },
  });
  const withdrawalMutation = useMutation({
    mutationFn: withdrawalAccount,
    onSuccess: async() => {
      toast.success("계좌 출금 성공! 🎉", {
        position: "bottom-right",
      });
      queryClient.refetchQueries({ queryKey: ["account"] });
      queryClient.refetchQueries({ queryKey: ["accountAllHistory"] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        "계좌 출금에 실패했어요. 다시 시도해 주세요.😢";
      toast.error(msg, { position: "bottom-right" });
    },
  });
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  const handleConfirm = () => {
    // 부모에서 모든 모달을 닫도록 위임
    onConfirmAll?.();
    // 입금 또는 출금 처리
    if (type === "입금") {
      depositMutation.mutate(amount);
    } else {
      withdrawalMutation.mutate(amount);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">{type} 확인</h2>
        <p className="text-center text-gray-700 mb-8">
          {type} 금액:{" "}
          <span className="font-bold text-red-600">
            {amount?.toLocaleString()}원
          </span>
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetCheckModal;
