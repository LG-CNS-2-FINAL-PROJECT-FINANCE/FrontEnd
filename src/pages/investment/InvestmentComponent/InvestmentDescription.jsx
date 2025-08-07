import React from 'react';

function InvestmentDescription({ imageUrl, summary, description }) {
    return (
        <div className="bg-white p-6 rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">프로젝트 상세</h2>

            {imageUrl && (
                <img src={imageUrl} alt="프로젝트 이미지" className="w-full rounded-lg mb-6 max-h-96 object-contain"/>
            )}

            <h3 className="text-xl font-semibold mb-3">프로젝트 요약</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{summary}</p>

            <h3 className="text-xl font-semibold mb-3">상세 설명</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
        </div>
    );
}

export default InvestmentDescription;