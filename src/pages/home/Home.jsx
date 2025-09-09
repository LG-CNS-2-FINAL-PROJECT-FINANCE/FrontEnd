import { useEffect, useState } from "react";

import TopProjectsSection from "./TopProjectsSection";
import { useQuery } from "@tanstack/react-query";
import { getProjectsRankingByAmount, getProjectsRankingByView } from "../../api/project_api";

import { useTranslation } from 'react-i18next';

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

          <TopProjectsSection projectsByView={projectsByView} projectsByViewLoading={projectsByViewLoading}  projectsByViewError={projectsByViewError} />
        </div>
        <div className="w-[30%] flex flex-col gap-6">
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-xl mb-4">{t('home_realtime_best_title')}</h1>
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
                  {t('home_ranking_data_error')}
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
                          {t('home_no_data_message')}
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
                                {p.title || p.projectName || t('home_project_placeholder')}
                              </div>
                              <div className="text-xs font-semibold text-red-500">
                                {(p.amount ?? 0).toLocaleString()}{t('unit_won')} {t('home_amount_raised_suffix')}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-red-500">
                              {(p.rate ?? p.percent ?? null) !== null
                                ? ((p.percent) > 0 ? "" : "") + t('home_collection_status_prefix') + " " +
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
            {/* 좌/우 반투명 클릭 가이드 (호버 시) */}
            <div
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                onClick={goPrev}
                aria-label={t('home_event_previous_slide_label')}
            />
            <div
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                onClick={goNext}
                aria-label={t('home_event_next_slide_label')}
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
                      aria-label={t('home_event_slide_indicator_label', { index: i + 1 })}
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
