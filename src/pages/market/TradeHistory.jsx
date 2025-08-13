import { useMemo, useState } from "react";

export default function TradeHistory({ data = [] }) {
  // 0=체결, 1=미체결
  const [historyTab, setHistoryTab] = useState(0);

  const filtered = useMemo(() => {
    const status = historyTab === 0 ? "체결" : "미체결";
    return data.filter((d) => d.status === status);
  }, [data, historyTab]);

  return (
    <div className="w-full">
      {/* 상단 탭 */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-1 rounded-xl border transition ${
            historyTab === 0
              ? "border-red-400 text-red-500 font-bold"
              : "border-gray-300 text-gray-500"
          }`}
          onClick={() => setHistoryTab(0)}
        >
          체결
        </button>
        <button
          className={`px-4 py-1 rounded-xl border transition ${
            historyTab === 1
              ? "border-red-400 text-red-500 font-bold"
              : "border-gray-300 text-gray-500"
          }`}
          onClick={() => setHistoryTab(1)}
        >
          미체결
        </button>
      </div>

      {/* 총 건수 */}
      <div className="text-gray-400 font-bold mb-2">총 {filtered.length}건</div>
      <hr className="mb-4" />

      {/* 카드 리스트 */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-300 px-6 py-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold">토큰 이름</div>
                <div className="text-xs text-gray-400 mt-1">{item.time}</div>
              </div>
              <div
                className={`text-lg font-extrabold ${
                  item.side === "매수" ? "text-red-500" : "text-blue-600"
                }`}
              >
                {item.side}
              </div>
            </div>

            <div className="grid grid-cols-2 mt-6 gap-y-2">
              <div className="text-gray-500">체결가격</div>
              <div className="text-right">{item.price.toLocaleString()}</div>

              <div className="text-gray-500">체결수량</div>
              <div className="text-right">{item.qty.toLocaleString()}</div>

              <div className="text-gray-500">체결금액</div>
              <div className="text-right">
                {(item.amount ?? item.price * item.qty).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            표시할 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
