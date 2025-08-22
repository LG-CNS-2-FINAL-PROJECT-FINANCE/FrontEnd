import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import StartingTopProjectsSection from "../component/InvestmentSection";

const images = [
  "/assets/startingpage_1.jpg",
  "/assets/startingpage_2.jpg",
  "/assets/startingpage_3.jpg",
  "/assets/startingpage_4.jpg",
];

function Home() {
  const [current, setCurrent] = useState(0);

  // 자동으로 5초마다 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // 클린업
  }, []);

  // 클릭 시 다음 이미지로
  const handleClick = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="px-0  transition-all duration-500">
      {/* 이미지 */}
      <img
        src={images[current]}
        alt={`Slide ${current}`}
        className="mt-4 rounded-xl cursor-pointer w-full h-[500px] object-cover transition-opacity duration-1000"
        onClick={handleClick}
      />

      <div className="flex flex-row py-8">
        {/* 왼쪽: 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col ">
          {/* 상단: 사이트 설명 슬라이더 */}
          <div className="w-[900px] h-[300px] rounded-xl flex items-center justify-center mb-8 select-none relative">
            <img
              src={images[current]}
              alt={`Slide ${current}`}
              className="absolute w-[900px] h-[300px] object-cover rounded-xl z-0"
              style={{ opacity: 0.3 }}
            />
            <span className="relative z-10 text-black text-xl font-bold text-center">
              사이트 설명
              <br />
              넘기면서 볼 수 있게
            </span>
          </div>

          {/*Top 조회수*/}
          <StartingTopProjectsSection />
        </div>
        {/* 오른쪽: 실시간 상품 순위 */}
        <div className="pl-4 w-[30%] flex flex-col items-center">
          <div className="bg-gray-200 rounded-xl w-full min-h-[800px] flex items-center justify-center text-lg font-bold text-gray-700">
            실시간 상품 순위
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
