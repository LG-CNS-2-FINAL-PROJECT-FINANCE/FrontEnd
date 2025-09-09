import { useMemo, useState } from "react";
import { toKSTDateTime } from "../../lib/toKSTDateTime";
import { TiDeleteOutline } from "react-icons/ti";
import { deleteTokenTrade } from "../../api/market_api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';


export default function TradeHistory({ projectId, myTradeDoneHistory, myTradeYetHistory }) {

  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [historyTab, setHistoryTab] = useState(0); // 0=체결, 1=미체결
  const [sideTab, setSideTab] = useState(2);   // ALL=2 | BUY=1 | SELL=0

  // 안전 배열화
  const doneList = Array.isArray(myTradeDoneHistory?.data) ? myTradeDoneHistory.data : [];
  const yetList  = Array.isArray(myTradeYetHistory?.data) ? myTradeYetHistory.data : [];

  // 체결 / 미체결 선택
  const baseList = useMemo(
    () => (historyTab === 0 ? doneList : yetList),
    [historyTab, doneList, yetList]
  );

  const mutation = useMutation({
    mutationFn: deleteTokenTrade,
    onSuccess: () => {
      // TODO: 성공 시 처리
      toast.success(t('trade_history_cancel_success_toast'));
      queryClient.refetchQueries({ queryKey: ["myTradeYetHistory", projectId] });
    },
    onError: () => {
      // TODO: 에러 시 처리
      toast.error(t('trade_history_cancel_fail_toast'));
    }
  });


  const filtered = useMemo(() => {
    if (sideTab === 2) return baseList;
    if (sideTab === 1)  return baseList.filter(i => {if(historyTab===0) return i.tradeType === 1; else return i.ordersType === 1;});
    if (sideTab === 0) return baseList.filter(i => {if(historyTab===0) return i.tradeType === 0; else return i.ordersType === 0;});
    return baseList;
  }, [baseList, sideTab]);

  return (
    <div className="w-full">
      {/* 1차 탭: 체결 / 미체결 */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-1 rounded-xl border transition ${
            historyTab === 0
              ? "border-red-400 text-red-500 font-bold"
              : "border-gray-300 text-gray-500"
          }`}
          onClick={() => {setHistoryTab(0);setSideTab(2);}}
        >
          {t('trade_history_tab_executed')}
        </button>
        <button
          className={`px-4 py-1 rounded-xl border transition ${
            historyTab === 1
              ? "border-red-400 text-red-500 font-bold"
              : "border-gray-300 text-gray-500"
          }`}
          onClick={() => {setHistoryTab(1);setSideTab(2);}}
        >
          {t('trade_history_tab_pending')}
        </button>
      </div>

      {/* 총 건수 */}
      <div className="text-gray-400 font-bold mb-2">
        {t('trade_history_total_items_count', { count: filtered.length })}
      </div>
      <hr className="mb-4" />

      {/* 2차 탭: 매수 / 매도 (구분) */}
      <div className="flex gap-3 mb-4 text-sm">
        {[
          { key: 2, label: t('trade_history_side_tab_all') },
          { key: 1, label: t('trade_history_side_tab_buy') },
          { key: 0, label: t('trade_history_side_tab_sell') },
        ].map(t => (
          <button
            key={t.key}
            className={`px-3 py-1 rounded-xl border transition ${
              sideTab === t.key
                ? "border-red-400 text-red-500 font-semibold"
                : "border-gray-300 text-gray-500"
            }`}
            onClick={() => setSideTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* 리스트 */}
      <div className="space-y-4">
        {filtered.map((item,i) => {
          const price = historyTab===0?item.tradePrice:item.purchasePrice;
          const qty   = item.tokenQuantity;
          const type  = historyTab===0?item.tradeType:item.ordersType;
          return (
            <div
              key={i}
              className="rounded-2xl border border-gray-300 px-6 py-5"
            >
              {historyTab === 1 && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400">{t('trade_history_pending_order_label')}</div>
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      mutation.mutate({ orderId: item.orderId });
                    }}
                    title={t('trade_history_cancel_order_title')}
                  >
                    <TiDeleteOutline className="w-6 h-6" />
                  </button>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">
                    {item.tokenName || t('trade_history_token_placeholder')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {toKSTDateTime(item.tradedAt)["date"] + " " + toKSTDateTime(item.tradedAt)["time"]}
                  </div>
                </div>
                <div
                  className={`text-lg font-extrabold ${
                    type === 1 ? "text-red-500" : "text-blue-600"
                  }`}
                >
                  {type === 1 ? t('trade_history_item_type_buy') : t('trade_history_item_type_sell')}
                </div>
              </div>
              <div className="grid grid-cols-2 mt-6 gap-y-2">
                <div className="text-gray-500">{t('trade_history_executed_price_label')}</div>
                <div className="text-right">{price.toLocaleString()}</div>

                <div className="text-gray-500">{t('trade_history_executed_quantity_label')}</div>
                <div className="text-right">{qty.toLocaleString()}</div>

                <div className="text-gray-500">{t('trade_history_executed_amount_label')}</div>
                <div className="text-right">{(price * qty).toLocaleString()}</div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            {t('trade_history_no_items_to_display')}
          </div>
        )}
        </div>
    </div>
  );
}