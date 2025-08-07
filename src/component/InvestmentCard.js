import React from 'react';
import { Link } from 'react-router-dom';

function InvestmentCard({ project }) {
    const ddayValue = Number(project.dday);

    return (
        <Link
            to={`/investment/${project.id}`}
            className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
            {/* 프로젝트 이미지 (임시) */}
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                {project.imageUrl ? (
                    <img src={`/assets/${project.imageUrl}`} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                    "이미지 없음"
                )}
            </div>

            <div className="p-4">
                <div className="font-bold text-lg mb-1 truncate">{project.name}</div>
                <div className="text-sm text-gray-700 mb-2">{project.amount} 유치중</div>

                <div className="text-sm font-medium mb-3">
                    {ddayValue > 0 ? (
                        <span className="text-red-500 font-bold">D-{ddayValue}</span>
                    ) : ddayValue === 0 ? (
                        <span className="text-red-500 font-bold">D-Day</span>
                    ) : (
                        <span className="text-gray-500">모집 마감</span>
                    )}
                </div>

                <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
                    <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: project.progress + "%" }}
                    ></div>
                </div>
                <div className="text-right text-xs text-gray-600 mt-1">{project.progress}% 달성</div>
            </div>
        </Link>
    );
}

export default InvestmentCard;