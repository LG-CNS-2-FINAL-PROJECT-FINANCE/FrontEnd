import { useNavigate, useParams } from "react-router-dom";
import InvestmentFiles from "../investment/investment_component/InvestmentFiles";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import SalesChart from "./SalesChart";
import TradeHistory from "./TradeHistory";
import MarketPurchaseModal from "./modals/MarketPurchaseModal";
import MarketSellModal from "./modals/MarketSellModal";
import { useQuery } from "@tanstack/react-query";
import { getInvestmentsDetail } from "../../api/project_api";
import { getMyTradeDoneHistoryByProjectId, getMyTradeYetHistoryByProjectId, getTokenTradeDoneHistoryByProjectId, getTokenTradePurchaseHistory, getTokenTradeSellHistory } from "../../api/market_api";
import { formatKST,toKSTDateTime } from "../../lib/toKSTDateTime";

function MarketDetail() {
  const { id } = useParams();
  const [mainImage, setMainImage] = useState(null); // 메인 표시 이미지
  const { data:product, isLoading:productLoading, isError:productError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getInvestmentsDetail('/product/market/end',id),
    retry: false,
  });
  useEffect(() => {
      if (product) {
        setMainImage(product.DefaultImageUrl || product.imageUrl?.[0] || null);
      }
    }, [product]);

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState(null); // '구매' | '판매'

  const [firstTab, setFirstTab] = useState(0); // 0=거래, 1=거래내역
  const [secondTab, setSecondTab] = useState(0);
  const navigate = useNavigate();

  const { data: tradeHistory, isLoading: tradeHistoryLoading, isError: tradeHistoryError } = useQuery({
    queryKey: ["tradeHistory", id],
    queryFn: () => getTokenTradeDoneHistoryByProjectId(id),
    retry: false,
  });
  const {data:purchaseBidHistory, isLoading: purchaseBidHistoryLoading, isError: purchaseBidHistoryError} = useQuery({
    queryKey: ["purchaseBidHistory", id],
    queryFn: () => getTokenTradePurchaseHistory(id),
    retry: false,
  });
  const {data:sellBidHistory, isLoading: sellBidHistoryLoading, isError: sellBidHistoryError} = useQuery({
    queryKey: ["sellBidHistory", id],
    queryFn: () => getTokenTradeSellHistory(id),
    retry: false,
  });


  const {data:myTradeDoneHistory, isLoading: myTradeDoneHistoryLoading, isError: myTradeDoneHistoryError} = useQuery({
    queryKey: ["myTradeDoneHistory",id],
    queryFn: () => getMyTradeDoneHistoryByProjectId(id),
    retry: false,
  });
    const {data:myTradeYetHistory, isLoading: myTradeYetHistoryLoading, isError: myTradeYetHistoryError} = useQuery({
    queryKey: ["myTradeYetHistory",id],
    queryFn: () => getMyTradeYetHistoryByProjectId(id),
    retry: false,
  });

  const openPurchase = () => {
    setTradeType("구매");
    setIsTradeModalOpen(true);
  };
  const openSell = () => {
    setTradeType("판매");
    setIsTradeModalOpen(true);
  };
  const closeTradeModal = () => setIsTradeModalOpen(false);

  const handlePurchaseConfirm = (payload) => {
    // TODO: API 연동
    console.log("구매 요청:", payload);
    setIsTradeModalOpen(false);
  };
  const handleSellConfirm = (payload) => {
    // TODO: API 연동
    console.log("판매 요청:", payload);
    setIsTradeModalOpen(false);
  };

  if (productLoading) {
    return (
      <div className="flex w-full h-[calc(100vh+240px)] mb-24">
        {/* Left skeleton */}
        <div className="flex-1 overflow-y-auto p-4 pr-8">
          <div className="flex items-center mb-6">
            <div className="h-6 w-6 rounded bg-neutral-200 animate-pulse mr-4" />
            <div className="h-8 w-64 rounded bg-neutral-200 animate-pulse" />
          </div>
            <div className="rounded-xl bg-neutral-200 animate-pulse mb-6 w-full" style={{ height: 400 }} />
            <div className="grid grid-cols-5 gap-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-neutral-200 animate-pulse" />
              ))}
            </div>
            <div className="h-8 w-72 rounded bg-neutral-200 animate-pulse mb-6" />
            <div className="space-y-3 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-full rounded bg-neutral-200 animate-pulse" />
              ))}
            </div>
            <div className="h-6 w-40 rounded bg-neutral-200 animate-pulse mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded-md border bg-neutral-100 animate-pulse" />
              ))}
            </div>
        </div>

        {/* Right skeleton */}
        <div className="overflow-y-auto mt-8 w-[480px] min-w-[380px] h-full bg-white border-l px-4 pl-8 py-8 flex flex-col">
          <div className="flex bg-neutral-100 rounded-md mb-8 px-4 w-full max-w-xl mx-auto h-10 animate-pulse" />
          <div className="mb-6">
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-48 bg-neutral-200 rounded animate-pulse mb-4" />
            <div className="flex gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-6 mb-8">
            <div className="h-12 w-full rounded-lg bg-red-200/50 animate-pulse" />
            <div className="h-12 w-full rounded-lg bg-red-100 animate-pulse" />
          </div>
          <div className="mb-6">
            <div className="h-4 w-12 bg-neutral-200 rounded animate-pulse mb-3" />
            <div className="h-48 w-full bg-neutral-200 rounded-xl animate-pulse" />
          </div>
          <div>
            <div className="h-8 w-full bg-neutral-100 rounded-md mb-3 animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-full bg-neutral-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex w-full h-[calc(100vh+240px)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">상품 정보를 불러오지 못했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  // Loading Done + No Error
  return (
    <div className="flex w-full h-[calc(100vh+240px)] mb-24">
      {/* 왼쪽: 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto p-4 pr-8 scrollbar-hide">
        <div className="flex flex-row items-center">
          <button
            onClick={() => navigate("/market")}
            className="flex items-center text-gray-500 mb-4 mr-4 hover:text-red-500 transition"
          >
            <FaChevronLeft />
          </button>
          <h1 className="text-3xl font-bold mb-6">{product.title}</h1>
        </div>
        <div
          className="relative rounded-xl overflow-hidden bg-gray-200 mb-6 h-[600px]"
        >
          {mainImage ? (
            <img
              className="w-full h-full object-cover transition duration-300"
              src={mainImage}
              alt="product main image"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
              이미지 없음
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
           {!productLoading ? product.imageUrl.map((img, idx) => {
            const isActive = img === mainImage;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => setMainImage(img)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setMainImage(img);
                  }
                }}
                className={`relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 outline-none ring-offset-2 transition
                   ${isActive ? "ring-1 ring-red-500" : "hover:ring-2 hover:ring-red-300"}`}
               >
              <img
                  className="w-full h-full object-cover"
                  src={img}
                  alt={`thumbnail ${idx + 1}`}
                  draggable={false}
                />
                {isActive && (
                  <span className="absolute inset-0 bg-black/20" aria-hidden="true" />
                )}
              </button>
            );
          }):null}
        </div>
        <h1 className="text-3xl font-bold mb-6">프로젝트 상세설명</h1>
        <p>{product.description}</p>
        <InvestmentFiles files={product.files} />
      </div>

      {/* 오른쪽: 고정 영역 */}
      <div className="overflow-y-auto scrollbar-hide mt-8 w-[500px] min-w-[380px] h-full bg-white border-l px-4 pl-8 py-8 flex flex-col">
        {/* 탭 메뉴 */}
        <div className="flex bg-gray-100 rounded-md mb-8 px-4 w-full max-w-xl mx-auto">
          <button
            className={`flex-1 text-center text-md transition ${
              firstTab === 0 ? "text-red-500 font-bold" : "text-gray-400"
            }`}
            onClick={() => setFirstTab(0)}
          >
            거래
          </button>
          <span className="text-gray-400">|</span>
          <button
            className={`flex-1 text-center text-md transition ${
              firstTab === 1 ? "text-red-500 font-bold" : "text-gray-400"
            }`}
            onClick={() => setFirstTab(1)}
          >
            거래내역
          </button>
        </div>

        {/* 탭별 내용 */}
        {firstTab === 0 ? (
          <>
            <div className="mb-4">
              <div className="text-lg text-gray-700 font-bold">즉시 구매가</div>
              <div className="text-3xl font-bold mb-4 mt-1">20,423 원</div>
              <div className="flex gap-6 text-left w-full">
                <div className="w-full">
                  <div className="text-sm text-gray-400">최근 거래가</div>
                  <div className="text-gray-700 text-sm">{product.tokenPrice? product.tokenPrice.toLocaleString():"-"} 원</div>
                </div>
                <div className="w-full border-l px-2">
                  <div className="text-sm text-gray-400">발매가</div>
                  <div className="text-gray-700 text-sm">{product.goalAmount/product.minInvestment} 원</div>
                </div>
                <div className="w-full border-l px-2">
                  <div className="text-sm text-gray-400">프로젝트 번호</div>
                  <div className="text-gray-700 text-sm">{product.projectId}</div>
                </div>
                <div className="w-full border-l px-2">
                  <div className="text-sm text-gray-400">출시일</div>
                  <div className="text-gray-700 text-sm">{product.startDate}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-6 mb-6">
              <button
                onClick={openPurchase}
                className="w-full bg-red-500 text-white font-bold rounded-lg px-8 py-3"
              >
                구매
              </button>
              <button
                onClick={openSell}
                className="w-full bg-red-100 text-red-500 font-bold rounded-lg px-8 py-3"
              >
                판매
              </button>
            </div>

            <div className="mb-6">
              <div className="font-bold mb-2">시세</div>
              <SalesChart tradeHistory={!tradeHistoryLoading ? [...tradeHistory].reverse() : null} />
            </div>

            <div>
              <div className="w-full flex bg-gray-100 p-1 rounded-md justify-around text-sm font-bold mb-2">
                <button
                  className={`px-2 transition ${
                    secondTab === 0 ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={() => setSecondTab(0)}
                >
                  체결 거래
                </button>
                <span className="text-gray-300">|</span>
                <button
                  className={`px-2 transition ${
                    secondTab === 1 ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={() => setSecondTab(1)}
                >
                  구매 입찰
                </button>
                <span className="text-gray-300">|</span>
                <button
                  className={`px-2 transition ${
                    secondTab === 2 ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={() => setSecondTab(2)}
                >
                  판매 입찰
                </button>
              </div>

              {/* secondTab에 따라 다른 테이블 렌더링 */}
              {secondTab === 0 && (
                <table className="w-full table-fixed text-sm border-b border-gray-200">
                  <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                  </colgroup>
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-3 py-2 font-normal">토큰 수량</th>
                      <th className="px-3 py-2 font-normal">체결가</th>
                      <th className="px-3 py-2 font-normal">거래일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 체결 거래 테이블 바디 */}
                    {!tradeHistoryLoading && tradeHistory?.length > 0
                      ? tradeHistory.map((trade, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-3 py-2 text-left">
                              {trade.tokenQuantity}
                            </td>
                            <td className="px-3 py-2 text-left">
                              {trade.tradePrice}
                            </td>
                            <td className="px-3 py-2 text-left whitespace-nowrap">
                              {formatKST(toKSTDateTime(trade.tradedAt))}
                            </td>
                          </tr>
                        ))
                      : null}

                    {/* 데이터 없음 메시지 */}
                    {!tradeHistoryLoading && (!tradeHistory || !tradeHistory || tradeHistory.length === 0) && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-6 text-center text-sm text-neutral-400"
                        >
                          최근 거래가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {secondTab === 1 && (
                <table className="w-full table-fixed text-sm border-b border-gray-200">
                  <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                  </colgroup>
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-3 py-2 font-normal">토큰 수량</th>
                      <th className="px-3 py-2 font-normal">입찰가</th>
                      <th className="px-3 py-2 font-normal">등록시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!purchaseBidHistoryLoading && purchaseBidHistory?.data?.length > 0
                      ? [...purchaseBidHistory.data].reverse().map((r, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-3 py-2 text-left">
                              {r.tokenQuantity.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-left text-red-600 font-semibold">
                              {r.purchasePrice.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-left whitespace-nowrap">
                              {formatKST(toKSTDateTime(r.registedAt))}
                            </td>
                          </tr>
                        ))
                      : null}
                    {!purchaseBidHistoryLoading &&
                      (!purchaseBidHistory ||
                        !purchaseBidHistory.data ||
                        purchaseBidHistory.data.length === 0) && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-sm text-neutral-400"
                          >
                            구매 입찰이 없습니다.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              )}
              {secondTab === 2 && (
                <table className="w-full table-fixed text-sm border-b border-gray-200">
                  <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                  </colgroup>
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-3 py-2 font-normal">토큰 수량</th>
                      <th className="px-3 py-2 font-normal">호가</th>
                      <th className="px-3 py-2 font-normal">등록시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!sellBidHistoryLoading && sellBidHistory?.data?.length > 0
                      ? [...sellBidHistory.data].reverse().map((r, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-3 py-2 text-left">
                              {r.tokenQuantity.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-left text-red-600 font-semibold">
                              {r.purchasePrice.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-left whitespace-nowrap">
                              {formatKST(toKSTDateTime(r.registedAt))}
                            </td>
                          </tr>
                        ))
                      : null}
                    {!sellBidHistoryLoading &&
                      (!sellBidHistory ||
                        !sellBidHistory.data ||
                        sellBidHistory.data.length === 0) && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-sm text-neutral-400"
                          >
                            판매 입찰이 없습니다.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <TradeHistory projectId={id} myTradeDoneHistory={myTradeDoneHistory} myTradeYetHistory={myTradeYetHistory} />
        )}
        {/* 모달 */}
        {isTradeModalOpen && (
          <>
            {tradeType === "구매" && (
              <MarketPurchaseModal
                tradeHistory={[...tradeHistory].reverse()}
                tradeHistoryLoading={tradeHistoryLoading}
                projectId={id}
                isOpen={isTradeModalOpen}
                onClose={closeTradeModal}
                onConfirm={handlePurchaseConfirm}
              />
            )}
            {tradeType === "판매" && (  
              <MarketSellModal
                tradeHistory={[...tradeHistory].reverse()}
                tradeHistoryLoading={tradeHistoryLoading}
                projectId={id}
                isOpen={isTradeModalOpen}
                onClose={closeTradeModal}
                onConfirm={handleSellConfirm}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MarketDetail;
