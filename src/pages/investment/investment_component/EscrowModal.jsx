import { useState } from "react";
import { postProfit } from "../../../api/project_api";
import {toast} from "react-toastify";

export default function EscrowModal({ projectId, isOpen, onClose }) {
    const [buyPrice, setBuyPrice] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null; // 안 열렸으면 렌더링 안 함

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await postProfit({ buyPrice, projectId });
            toast.success("수익금 예치 완료!");
            onClose();
            window.location.reload();
        } catch (err) {
            toast.error("예치 실패. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">수익금 예치</h2>
                <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="매수가 입력"
                    className="border w-full px-3 py-2 rounded-md mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        닫기
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "처리중..." : "확인"}
                    </button>
                </div>
            </div>
        </div>
    );
}
