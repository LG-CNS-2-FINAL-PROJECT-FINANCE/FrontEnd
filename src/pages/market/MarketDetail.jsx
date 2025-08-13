import { useNavigate, useParams } from "react-router-dom";
import InvestmentFiles from "../investment/InvestmentComponent/InvestmentFiles";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import SalesChart from "./SalesChart";
import TradeHistory from "./TradeHistory";
import MarketPurchaseModal from "./modals/MarketPurchaseModal";
import MarketSellModal from "./modals/MarketSellModal";

function MarketDetail() {
  const { id } = useParams();

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState(null); // '구매' | '판매'

  const [firstTab, setFirstTab] = useState(0); // 0=거래, 1=거래내역
  const [secondTab, setSecondTab] = useState(0);
  const navigate = useNavigate();

  const product = {
    id: id,
    name: `프로젝트명 ${id}`,
    images: Array(10).fill(null),
    description:
      "This project focuses on developing a sustainable, eco-friendly housing community in a rapidly growing suburban area. The development will feature energy-efficient homes with solar panels, rainwater harvesting systems, and community gardens. Our commitment to sustainability extends to using locally sourced, recycled materials wherever possible, minimizing the environmental impact of construction. The community is designed to appeal to environmentally conscious families and individuals seeking a healthier, more sustainable lifestyle. The location offers convenient access to urban amenities while preserving a tranquil, natural setting. This investment offers a unique opportunity to support sustainable development while potentially benefiting from the increasing demand for eco-friendly housing.",

    mainImage: null,
    files: [
      { name: "파일1.pdf", url: "/path/to/file1.pdf" },
      { name: "파일2.pdf", url: "/path/to/file2.pdf" },
      { name: "파일3.pdf", url: "/path/to/file3.pdf" },
    ],
  };

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

  // 예시 체결 거래 데이터 (API 연동 시 교체)
  const executedTrades = [
    { qty: 1, price: 20324, time: "2024.05.12 12:10" },
    { qty: 2, price: 20400, time: "2024.05.12 12:05" },
    { qty: 1, price: 20210, time: "2024.05.12 11:59" },
  ];
  const buyBids = [
    { qty: 3, price: 20100, time: "2024.05.12 12:12" },
    { qty: 1, price: 20050, time: "2024.05.12 12:08" },
  ];
  const sellBids = [
    { qty: 2, price: 20500, time: "2024.05.12 12:11" },
    { qty: 1, price: 20620, time: "2024.05.12 12:07" },
  ];

  // 예시 거래내역 데이터 (API 연동 시 교체)
  const historyData = [
    {
      id: 1,
      tokenName: "토큰 이름",
      side: "매수",
      price: 300,
      qty: 3,
      amount: 900,
      time: "2024-08-05 16:35",
      status: "체결",
    },
    {
      id: 2,
      tokenName: "토큰 이름",
      side: "매도",
      price: 300,
      qty: 3,
      amount: 900,
      time: "2024-08-05 16:35",
      status: "체결",
    },
    {
      id: 3,
      tokenName: "토큰 이름",
      side: "매수",
      price: 310,
      qty: 2,
      amount: 620,
      time: "2024-08-06 10:10",
      status: "미체결",
    },
    {
      id: 4,
      tokenName: "토큰 이름",
      side: "매수",
      price: 310,
      qty: 2,
      amount: 620,
      time: "2024-08-06 10:10",
      status: "미체결",
    },
  ];

  return (
    <div className="flex w-full h-[calc(100vh+240px)] mb-24">
      {/* 왼쪽: 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto p-4 pr-8 scrollbar-hide">
        {/* ...existing code... 왼쪽 내용 그대로 유지 ... */}
        <div className="flex flex-row items-center">
          <button
            onClick={() => navigate("/market")}
            className="flex items-center text-gray-500 mb-4 mr-4 hover:text-red-500 transition"
          >
            <FaChevronLeft />
          </button>
          <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
        </div>
        <div
          className="rounded-xl bg-gray-300 flex items-center justify-center text-lg text-black mb-6"
          style={{ height: 400 }}
        >
          썸네일 이미지
        </div>
        <div className="grid grid-cols-5 gap-4 mb-8 ">
          {product.images.map((img, idx) => (
            <div
              key={idx}
              className="bg-gray-300 rounded-xl h-24 flex items-center justify-center text-gray-500 text-xs"
            >
              프로젝트 사진
            </div>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-6">프로젝트 상세설명</h1>
        <p>{product.description}</p>
        <InvestmentFiles files={product.files} />
      </div>

      {/* 오른쪽: 고정 영역 */}
      <div className="overflow-y-auto scrollbar-hide mt-8 w-[480px] min-w-[380px] h-full bg-white border-l px-4 pl-8 py-8 flex flex-col">
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
                  <div className="text-gray-700 text-sm">42,000원</div>
                  <div className="text-green-600 text-sm font-bold">
                    ▼3,000 (-6.7%)
                  </div>
                </div>
                <div className="w-full border-l px-4">
                  <div className="text-sm text-gray-400">발매가</div>
                  <div className="text-gray-700 text-sm">74,900원</div>
                </div>
                <div className="w-full border-l px-4">
                  <div className="text-sm text-gray-400">모델번호</div>
                  <div className="text-gray-700 text-sm">205089-1LI</div>
                </div>
                <div className="w-full border-l px-4">
                  <div className="text-sm text-gray-400">출시일</div>
                  <div className="text-gray-700 text-sm">2024.01.04</div>
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
              <SalesChart />
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
                    {executedTrades.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-left">
                          {r.qty.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-left">
                          {r.price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-left whitespace-nowrap">
                          {r.time}
                        </td>
                      </tr>
                    ))}
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
                    {buyBids.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-left">
                          {r.qty.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-left text-red-600 font-semibold">
                          {r.price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-left whitespace-nowrap">
                          {r.time}
                        </td>
                      </tr>
                    ))}
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
                    {sellBids.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-left">
                          {r.qty.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-left text-blue-600 font-semibold">
                          {r.price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-left whitespace-nowrap">
                          {r.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <TradeHistory data={historyData} />
        )}
        {/* 모달 */}
        {isTradeModalOpen && (
          <>
            {tradeType === "구매" && (
              <MarketPurchaseModal
                isOpen={isTradeModalOpen}
                onClose={closeTradeModal}
                onConfirm={handlePurchaseConfirm}
              />
            )}
            {tradeType === "판매" && (
              <MarketSellModal
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
