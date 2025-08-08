import { useNavigate, useParams } from "react-router-dom";
import InvestmentFiles from "../investment/InvestmentComponent/InvestmentFiles";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import SalesChart from "./SalesChart";

function MarketDetail() {
  const { id } = useParams();

  // 예시 데이터 (실제 프로젝트에서는 API로 받아오세요)
  const product = {
    id: id,
    name: `프로젝트명 ${id}`,
    images: Array(10).fill(null), // 이미지 10개 (실제 이미지 url로 대체)
    mainImage: null, // 실제 이미지 url로 대체
    files: [
      { name: "파일1.pdf", url: "/path/to/file1.pdf" },
      { name: "파일2.pdf", url: "/path/to/file2.pdf" },
      { name: "파일3.pdf", url: "/path/to/file3.pdf" },
    ],
  };

  const [tab, setTab] = useState(0);
  const [secondTab, setSecondTab] = useState(0);
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
        </div>
        <div
          className="rounded-xl bg-gray-300 flex items-center justify-center text-lg text-black mb-6"
          style={{ height: 400 }}
        >
          썸네일 이미지
        </div>
        {/* 썸네일 그리드 */}
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
        <h3>프로젝트 현황</h3>
        <p>
          The project is currently in the construction phase, with all necessary
          permits secured. The foundation has been laid, and framing is
          underway. We anticipate completing the exterior shell by the end of Q2
          2024.{" "}
        </p>
        <h3>프로젝트 상세설명</h3>
        <p>
          This project focuses on developing a sustainable, eco-friendly housing
          community in a rapidly growing suburban area. The development will
          feature energy-efficient homes with solar panels, rainwater harvesting
          systems, and community gardens. Our commitment to sustainability
          extends to using locally sourced, recycled materials wherever
          possible, minimizing the environmental impact of construction. The
          community is designed to appeal to environmentally conscious families
          and individuals seeking a healthier, more sustainable lifestyle. The
          location offers convenient access to urban amenities while preserving
          a tranquil, natural setting. This investment offers a unique
          opportunity to support sustainable development while potentially
          benefiting from the increasing demand for eco-friendly housing.
        </p>
        <h3>프로젝트 파일</h3>
        <p>
          The project is currently in the construction phase, with all necessary
          permits secured. The foundation has been laid, and framing is
          underway. We anticipate completing the exterior shell by the end of Q2
          2024.{" "}
        </p>
        <InvestmentFiles files={product.files} />
      </div>
      {/* 오른쪽: 고정 영역 */}
      <div className="mt-8 w-[480px] min-w-[380px] h-full bg-white border-l px-4 pl-8 py-8 flex flex-col">
        {/* 거래 정보 */}
        <div>
          {/* 탭 메뉴 */}
          <div className="flex bg-gray-100 rounded-md mb-8 px-4 w-full max-w-xl mx-auto">
            <button
              className={`flex-1 text-center  text-md  transition ${
                tab === 0 ? "text-red-500 font-bold" : "text-gray-400"
              }`}
              onClick={() => setTab(0)}
            >
              거래
            </button>
            <span className="text-gray-400">|</span>
            <button
              className={`flex-1 text-center text-md transition ${
                tab === 1 ? "text-red-500 font-bold" : "text-gray-400"
              }`}
              onClick={() => setTab(1)}
            >
              거래내역
            </button>
          </div>

          <div className="mb-4">
            <div className="text-lg text-gray-700 font-bold">즉시 구매가</div>
            <div className="text-3xl font-bold mb-4 mt-1">20,423 원</div>
            {/* 가격 정보 */}
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
            <button className="w-full bg-red-500 text-white font-bold rounded-lg px-8 py-3">
              구매
            </button>
            <button className="w-full bg-red-100 text-red-500 font-bold rounded-lg px-8 py-3">
              판매
            </button>
          </div>
        </div>
        {/* 시세 차트 (임시) */}
        <div className="mb-6">
          <div className="font-bold mb-2">시세</div>
          <SalesChart />
        </div>
        {/* Second Tab */}
        <div>
          <div className="w-full flex bg-gray-100 p-1 rounded-md flex justify-around text-sm font-bold mb-2">
            <button
              className={`px-2 transition ${
                secondTab === 0
                  ? "text-red-500 border-red-500"
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => setSecondTab(0)}
            >
              체결 거래
            </button>
            <span className="text-gray-300">|</span>
            <button
              className={`px-2  transition ${
                secondTab === 1
                  ? "text-red-500 border-red-500"
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => setSecondTab(1)}
            >
              구매 입찰
            </button>
            <span className="text-gray-300">|</span>
            <button
              className={`px-2 transition ${
                secondTab === 2
                  ? "text-red-500 border-red-500"
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => setSecondTab(2)}
            >
              판매 입찰
            </button>
          </div>

          <table className="w-full text-sm border-b border-gray-200">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-2 font-normal">토큰 수량</th>
                <th className="font-normal">가격</th>
                <th className="font-normal">거래일시</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row} className="border-b border-gray-100">
                  <td className="py-2 font-normal text-left">1</td>
                  <td className="font-normal text-left">20,324</td>
                  <td className="font-normal text-left">2024.05.12</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MarketDetail;
