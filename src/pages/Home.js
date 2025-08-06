import { useEffect, useRef, useState } from "react";

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
    <div
      className="px-0 h-screen cursor-pointer transition-all duration-500"
      onClick={handleClick}
    >
      <img
        w-screen
        src={images[current]}
        alt={`Slide ${current}`}
        className=" w-full h-full object-cover transition-opacity duration-1000"
      />

      <div className=" min-h-screen flex flex-row py-8">
        {/* 왼쪽: 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col ">
          {/* 상단: 사이트 설명 슬라이더 */}
          <div
            className="w-[900px] h-[300px] rounded-xl flex items-center justify-center mb-8 cursor-pointer select-none relative"
            onClick={handleClick}
          >
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

          {/* TOP 조회수 */}
          <div className="w-[900px]">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold mr-2">{"<"}</span>
              <span className="text-xl font-bold">TOP 조회수</span>
              <span className="text-2xl font-bold ml-2">{">"}</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-xl h-[200px] flex flex-col justify-between p-3"
                >
                  <div className="flex-1 rounded-lg bg-gray-300 mb-2"></div>
                  <div>
                    <div className="font-bold text-sm">프로젝트명</div>
                    <div className="text-xs text-gray-600">
                      100,010,200원 유치중
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded mt-1">
                      <div
                        className="h-2 bg-red-500 rounded"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
