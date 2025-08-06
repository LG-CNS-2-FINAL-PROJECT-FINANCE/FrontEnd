import React from 'react';

function StartingProjectCard({ project }) { // 데이터를 props로 받음
    return (
        <div className="bg-gray-200 rounded-xl h-[200px] flex flex-col justify-between p-3">
            <div className="flex-1 rounded-lg bg-gray-300 mb-2">
                {/* 나중에 project.imageUrl을 사용하기 */}
            </div>
            <div>
                <div className="font-bold text-sm">{project.name}</div>
                <div className="text-xs text-gray-600">{project.amount} 유치중</div>
                <div className="w-full h-2 bg-gray-300 rounded mt-1">
                    <div
                        className="h-2 bg-red-500 rounded"
                        style={{ width: project.progress + "%" }} // 진행률을 project.progress로 받아서 적용
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default StartingProjectCard;