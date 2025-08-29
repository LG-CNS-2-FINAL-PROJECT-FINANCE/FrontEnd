import { useEffect, useState } from "react";

import TopProjectsSection from "./TopProjectsSection";
import { useQuery } from "@tanstack/react-query";
import { getProjectsRankingByAmount, getProjectsRankingByView } from "../../api/project_api";

const eventImages = [
  "/assets/event_1.png",
  "/assets/event_2.png",
  "/assets/event_3.png",
  "/assets/event_4.png",
];

function Home() {
  const [eventCurrent, setEventCurrent] = useState(0);
  const { data: projectsByAmount, isLoading: projectsByAmountLoading, isError: projectsByAmountError } = useQuery({
      queryKey: ["projects", "ranking", "amount"],
      queryFn: getProjectsRankingByAmount,
      retry: false,
  });

  const { data: projectsByView, isLoading: projectsByViewLoading, isError: projectsByViewError } = useQuery({
      queryKey: ["projects", "ranking", "view"],
      queryFn: getProjectsRankingByView,
      retry: false,
  });


  // 자동으로 5초마다 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setEventCurrent((prev) => (prev + 1) % eventImages.length);
    }, 10000);

    return () => clearInterval(interval); // 클린업
  }, []);

  const handleSliderClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      // left half -> prev
      setEventCurrent(prev => (prev - 1 + eventImages.length) % eventImages.length);
    } else {
      // right half -> next
      setEventCurrent(prev => (prev + 1) % eventImages.length);
    }
  };

  const goPrev = () =>
    setEventCurrent(prev => (prev - 1 + eventImages.length) % eventImages.length);
  const goNext = () =>
    setEventCurrent(prev => (prev + 1) % eventImages.length);


  return (
    <div className="px-0  transition-all duration-500">
      <div className="flex flex-row py-8">
        <div className="w-[70%] pr-4 flex-1 flex flex-col justify-center items-center">
          {/* 슬라이더 */}
          <div className="relative w-[400px] h-[400px] mb-8 rounded-xl overflow-hidden select-none">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${eventCurrent * 100}%)` }}
              onClick={handleSliderClick}
            >
              {eventImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Slide ${i}`}
                  className="w-[400px] h-[400px] object-cover flex-shrink-0 cursor-pointer"
                  draggable={false}
                />
              ))}
            </div>
            {/* 좌/우 반투명 클릭 가이드 (호버 시) */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
              onClick={goPrev}
              aria-label="previous"
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
              onClick={goNext}
              aria-label="next"
            />
            {/* 인디케이터 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {eventImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setEventCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === eventCurrent ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <TopProjectsSection projectsByView={projectsByView} projectsByViewLoading={projectsByViewLoading}  projectsByViewError={projectsByViewError} />
        </div>
        <div className="pl-4 w-[30%] flex flex-col items-start">
          <h1 className="font-bold text-xl mb-4">실시간 베스트</h1>
          <div className="w-full rounded-xl bg-white border p-4">
            {projectsByAmountLoading && (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            )}

            {projectsByAmountError && (
              <div className="text-sm text-red-500">
                랭킹 데이터를 불러오지 못했습니다.
              </div>
            )}

            {!projectsByAmountLoading && !projectsByAmountError && (
              <>
                {(() => {
                  const list = Array.isArray(projectsByAmount?.data)
                    ? projectsByAmount.data
                    : Array.isArray(projectsByAmount)
                    ? projectsByAmount
                    : [];
                  if (list.length === 0)
                    return (
                      <div className="text-sm text-gray-400 py-6 text-center">
                        데이터가 없습니다.
                      </div>
                    );
                  return (
                    <ul className="divide-y">
                      {list.slice(0, 10).map((p, i) => (
                        <li
                          key={p.projectId || p.id || i}
                          className="py-3 flex items-center gap-4"
                        >
                          <span className="w-6 mr-4 text-center text-xl font-bold text-black">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-md mb-2 truncate">
                              {p.title || p.projectName || "프로젝트"}
                            </div>
                            <div className="text-xs font-semibold text-red-500">
                              {(p.amount ?? 0).toLocaleString()}원 모금 !
                            </div>
                          </div>
                          <div className="text-md font-semibold text-red-500">
                            {(p.rate ?? p.percent ?? null) !== null
                              ? ((p.percent) > 0 ? "+" : "") +
                                (p.percent) +
                                "%"
                              : ""}
                          </div>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
