import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import StartingTopProjectsSection from "../component/StartingTopProjectSection";

const images = [
  "/assets/startingpage_1.jpg",
  "/assets/startingpage_2.jpg",
  "/assets/startingpage_3.jpg",
  "/assets/startingpage_4.jpg",
];

function Home() {
  const [current, setCurrent] = useState(0);
  const cursorRef = useRef(null);
  const cursorRef2 = useRef(null);

  // 자동으로 5초마다 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // 클린업
  }, []);
  // 마우스 이동 이벤트
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cursorSize = 10; // 첫 번째 커서 크기
      const cursor2Size = 30; // 두 번째 커서 크기

      gsap.to(cursorRef.current, {
        duration: 0.15,
        left: e.pageX - cursorSize / 2, // 커서 중심을 마우스 위치에 맞춤
        top: e.pageY - cursorSize / 2,
      });
      gsap.to(cursorRef2.current, {
        duration: 0.5,
        left: e.pageX - cursor2Size / 2, // 커서 중심을 마우스 위치에 맞춤
        top: e.pageY - cursor2Size / 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 클릭 시 다음 이미지로
  const handleClick = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="px-0  transition-all duration-500">
      {/* 커서 효과 */}
      <div
        ref={cursorRef}
        className="mouse__cursor absolute w-2 h-2 bg-red-500 rounded-full pointer-events-none"
      ></div>
      <div
        ref={cursorRef2}
        className="mouse__cursor2 absolute w-8 h-8 bg-red-300 rounded-full pointer-events-none"
      ></div>

      {/* 이미지 */}
      <img
        src={images[current]}
        alt={`Slide ${current}`}
        className="cursor-pointer w-full h-full object-cover transition-opacity duration-1000"
        onClick={handleClick}
        onMouseEnter={() => {
          cursorRef.current.classList.add("active");
          cursorRef2.current.classList.add("active");
        }}
        onMouseLeave={() => {
          cursorRef.current.classList.remove("active");
          cursorRef2.current.classList.remove("active");
        }}
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
