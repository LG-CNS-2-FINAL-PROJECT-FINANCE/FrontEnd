import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaEye } from "react-icons/fa";

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from "dayjs";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function InvestmentCard({ project, imageUrl, disableNavigation }) {
    const ddayValue = project.dday;

    const { themeColors } = useTheme();

    const today = new Date();
    const yyyy_mm_dd = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    const projectStartDateFormatted = project.startDate ? String(project.startDate).substring(0, 10) : '';

    let displayStatusText;
    let statusTextColorClass = "text-red-500";
    let isBold = false;

    if (yyyy_mm_dd < projectStartDateFormatted) {
        displayStatusText = '준비중';
    } else if (ddayValue === '마감') {
        displayStatusText = project.dday;
    } else if (ddayValue === "") {
        displayStatusText = null;
    } else {
        displayStatusText = 'D-' + project.dday;
    }

    // 카드 내용 (공통)
    const cardContent = (
        <div className="block bg-white rounded-[3px] shadow-[0px_9px_16px_rgba(159,162,191,0.08),0px_2px_2px_rgba(159,162,191,0.12)] overflow-hidden hover:shadow-md hover:scale-100 transition-all duration-300">
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                {imageUrl ? (
                    <img src={imageUrl} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                    "이미지 없음"
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center text-lg mb-1">
                    <div className="font-bold truncate min-w-0">{project.name}</div>
                </div>

                {project.amount !== '' && (
                    <div className="text-sm text-gray-700 mb-2">{project.amount} 유치중</div>
                )}

                <div className="text-sm font-medium mb-3">
                    <span className={`${statusTextColorClass} ${isBold ? 'font-bold' : ''}`}>
                        {displayStatusText}
                    </span>
                </div>

                {project.progress !== null && (
                    <>
                        <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
                            <div
                                className={`h-full ${themeColors.primaryBg} rounded-full`}
                                style={{ width: project.progress + "%" }}
                            ></div>
                        </div>
                        <div className="text-right text-xs text-gray-600 mt-1">
                            {project.progress}% 달성
                        </div>
                    </>
                )}

                <div className="flex justify-between text-xs text-gray-600 mt-1">
                    {project.type !== null && (
                        <div>{project.type}</div>
                    )}
                    {project.status !== null && (
                        <div>{project.status}</div>
                    )}
                    {project.views !== null &&(
                        <div className="flex items-center">
                            <FaEye />
                            <div className="pl-1">
                                { project.views }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return disableNavigation ? (
        <div>{cardContent}</div>
    ) : (
        <Link to={`/investment/${project.projectId}`}>{cardContent}</Link>
    );
}

export default InvestmentCard;
