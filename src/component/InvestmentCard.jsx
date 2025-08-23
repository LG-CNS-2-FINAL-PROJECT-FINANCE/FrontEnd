import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

//dayjs 플러그인인데 시간 비교를 위한 플러그인
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from "dayjs";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function InvestmentCard({ project, imageUrl }) {
    console.log('[InvestmentCard] project prop:', project);
    console.log('[InvestmentCard] image prop:', imageUrl);
    const ddayValue = Number(project.dday);
    const { themeColors } = useTheme();

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const yyyy_mm_dd = `${year}-${month}-${day}`;

    //ISO형식 yyyy_mm_dd 변환
    const projectStartDateFormatted = project.startDate ? String(project.startDate).substring(0, 10) : '';

    let displayStatusText;
    let statusTextColorClass = "text-red-500";
    let isBold = false;

    if (yyyy_mm_dd < projectStartDateFormatted) { // 프로젝트 시작일이 오늘보다 미래인 경우
        displayStatusText = '준비중';
    } else {
        displayStatusText = 'D-'+ project.dday;
    }

    return (
        <Link
            to={`/investment/${project.projectId}`}
            className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
            {/* 프로젝트 이미지 (임시) */}
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                {imageUrl ? (
                    <img src={`${imageUrl}`} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                    "이미지 없음"
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center text-lg mb-1">
                    <div className="font-bold truncate min-w-0">{project.name}</div>
                    {/*<div className="flex-shrink-0 ml-2 text-sm">{project.views}</div>*/} {/*조회수*/}
                </div>
                <div className="text-sm text-gray-700 mb-2">{project.amount} 유치중</div>

                <div className="text-sm font-medium mb-3">
                    <span className={`${statusTextColorClass} ${isBold ? 'font-bold' : ''}`}>
                        {displayStatusText}
                    </span>
                </div>

                <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
                    <div
                        className={`h-full ${themeColors.primaryBg} rounded-full`}
                        style={{ width: project.progress + "%" }}
                    ></div>
                </div>
                <div className="text-right text-xs text-gray-600 mt-1">{project.progress}% 달성</div>
            </div>
        </Link>
    );
}

export default InvestmentCard;