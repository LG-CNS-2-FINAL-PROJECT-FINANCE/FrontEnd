import { useEffect, useState } from "react";
import TopProjectsSection from "./TopProjectsSection";
import { useQuery } from "@tanstack/react-query";
import { getProjectsRankingByAmount, getProjectsRankingByView } from "../../api/project_api";
import { FaCrown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const eventImages = [
  "/assets/event_1.png",
  "/assets/event_2.png",
  "/assets/event_3.png",
  "/assets/event_4.png",
];

function Home() {
  const { t } = useTranslation();
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

  // 슬라이더 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setEventCurrent((prev) => (prev + 1) % eventImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSliderClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) setEventCurrent((prev) => (prev - 1 + eventImages.length) % eventImages.length);
    else setEventCurrent((prev) => (prev + 1) % eventImages.length);
  };

  const goPrev = () => setEventCurrent((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  const goNext = () => setEventCurrent((prev) => (prev + 1) % eventImages.length);

  return (
      <div className="px-0 transition-all duration-500">
        <div className="flex flex-row py-8">
          {/* 좌측: 슬라이더 + 인기 프로젝트 */}
          <div className="w-[70%] pr-4 flex-1 flex flex-col justify-center items-center">
            <div className="w-full mb-6 rounded-xl overflow-hidden shadow">
              <video
                  src="https://ddiring-cloud-bucket.s3.ap-northeast-2.amazonaws.com/zzogaemallIntro2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-xl"
              />
            </div>
            <TopProjectsSection
                projectsByView={projectsByView}
                projectsByViewLoading={projectsByViewLoading}
                projectsByViewError={projectsByViewError}
            />
          </div>

          {/* 우측: 실시간 베스트 */}
          <div className="w-[30%] flex flex-col gap-6">
            <div className="flex flex-col items-start">
              <div className="w-full rounded-2xl bg-white shadow-sm border border-gray-100 px-6 relative">
                {/* 배지형 타이틀 */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-xl text-2xl font-extrabold whitespace-nowrap">
                  {t('home_realtime_best_title')}
                </div>

                {/* 로딩 */}
                {projectsByAmountLoading && (
                    <div className="animate-pulse space-y-3 mt-4">
                      {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-8 bg-gray-200 rounded" />
                      ))}
                    </div>
                )}

                {/* 에러 */}
                {projectsByAmountError && (
                    <div className="text-sm text-red-500 text-center py-4">{t('home_ranking_data_error')}</div>
                )}

                {/* 프로젝트 리스트 */}
                {!projectsByAmountLoading && !projectsByAmountError && (() => {
                  const list = Array.isArray(projectsByAmount?.data)
                      ? projectsByAmount.data
                      : Array.isArray(projectsByAmount)
                          ? projectsByAmount
                          : [];

                  if (list.length === 0)
                    return (
                        <div className="text-sm text-gray-400 py-10 text-center">
                          {t('home_no_data_message')}
                        </div>
                    );

                  return (
                      <ul className="divide-y divide-gray-100 mt-4">
                        {list.slice(0, 10).map((p, i) => (
                            <li
                                key={p.projectId || p.id || i}
                                className="py-4 flex items-center gap-4 hover:bg-gray-50 transition rounded-lg px-2"
                            >
                              {/* 순위 + 왕관 */}
                              <div className="flex flex-col items-center relative">
                                {i < 3 && (
                                    <FaCrown
                                        className={`text-lg mb-[-4px] relative z-10 ${
                                            i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : "text-orange-500"
                                        }`}
                                    />
                                )}
                                <span
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${
                                        i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-400" : i === 2 ? "bg-yellow-400" : "bg-gray-300 text-gray-800"
                                    }`}
                                >
                            {i + 1}
                          </span>
                              </div>

                              {/* 프로젝트 정보 */}
                              <div className="flex-1 min-w-0">
                                <div className="text-md font-semibold text-gray-900 truncate">
                                  {p.title || p.projectName || t('home_project_placeholder')}
                                </div>
                                <div className="text-xs font-medium text-gray-500">
                                  {(p.amount ?? 0).toLocaleString()}
                                  {t('unit_won')} {t('home_amount_raised_suffix')}
                                </div>
                              </div>

                              {/* 달성률 */}
                              {p.percent !== undefined && (
                                  <div className="flex flex-col items-end w-28">
                            <span className="text-xs font-medium text-gray-700 mb-1">
                              {p.percent}% {t('home_collection_status_prefix')}
                            </span>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                          className={`h-full rounded-full ${
                                              p.percent >= 100
                                                  ? "bg-green-500"
                                                  : p.percent >= 70
                                                      ? "bg-yellow-500"
                                                      : "bg-red-500"
                                          }`}
                                          style={{ width: `${Math.min(p.percent, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                              )}
                            </li>
                        ))}
                      </ul>
                  );
                })()}
              </div>
            </div>

            {/* 이벤트 슬라이더 */}
            <div className="relative mb-8 rounded-xl overflow-hidden select-none">
              <div
                  className="flex h-full w-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${eventCurrent * 100}%)` }}
                  onClick={handleSliderClick}
              >
                {eventImages.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={t('home_event_slide_alt', { index: i + 1 })}
                        className="w-[400px] h-[400px] object-cover flex-shrink-0 cursor-pointer"
                        draggable={false}
                    />
                ))}
              </div>
              {/* 좌/우 클릭 영역 */}
              <div className="absolute inset-y-0 left-0 w-1/2 cursor-pointer" onClick={goPrev} />
              <div className="absolute inset-y-0 right-0 w-1/2 cursor-pointer" onClick={goNext} />
              {/* 인디케이터 */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {eventImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setEventCurrent(i)}
                        className={`w-2.5 h-2.5 rounded-full transition ${i === eventCurrent ? "bg-white" : "bg-white/40"}`}
                    />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;
