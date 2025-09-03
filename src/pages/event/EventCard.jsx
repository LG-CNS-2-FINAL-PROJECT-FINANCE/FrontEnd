// src/components/EventCard.jsx (수정)

import React from 'react';

function EventCard({ event }) {
    const getStatusClasses = (status) => {
        switch (status) {
            case '진행중': return 'bg-blue-100 text-blue-800';
            case '예정': return 'bg-green-100 text-green-800';
            case '종료': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden
                    transition-all duration-300 transform group hover:scale-[1.02] hover:shadow-xl
                    flex min-h-[180px] w-full"> {/* <<<< 카드 전체를 가로 flex로, 최소 높이 설정 */}

            {/* <<<< 이미지 영역 - 왼쪽으로 고정 폭 설정 */}
            {event.imageUrl && (
                <div className="w-48 flex-shrink-0 relative overflow-hidden h-[180px]"> {/* 이미지 컨테이너, 고정 폭 48 (192px) */}
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" /* hover 효과 */
                    />
                </div>
            )}

            {/* <<<< 콘텐츠 영역 - 남은 공간을 모두 차지하도록 설정 */}
            <div className="p-4 flex-1 flex flex-col justify-between"> {/* p-4 내부 패딩, flex-1로 남은 공간 차지, 세로 flex */}
                <div> {/* 제목, 날짜, 장소, 설명 그룹 */}
                    {/* <<<< 제목 및 상태 - 세로 정렬 및 간격 조정 */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{event.title}</h3> {/* 긴 제목 자르기, 상태와 간격 */}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusClasses(event.status)}`}>
              {event.status}
            </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{event.date}</p>
                    <p className="text-gray-500 text-xs mb-3">{event.location}</p>
                    <p className="text-gray-700 text-base line-clamp-2"> {/* 설명은 최대 두 줄 */}
                        {event.description}
                    </p>
                </div>

                {/* <<<< '자세히 보기' 링크 - 아래로 정렬 */}
                {event.link && (
                    <div className="mt-auto pt-3 border-t border-gray-100"> {/* mt-auto로 아래로 밀고, 상단에 구분선 */}
                        <a
                            href={event.link}
                            className="inline-block text-red-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            자세히 보기
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventCard;