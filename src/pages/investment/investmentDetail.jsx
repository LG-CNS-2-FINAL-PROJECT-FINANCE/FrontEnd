import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";

import InvestmentSummary from './investment_component/InvestmentSummary';
import InvestmentProgress from './investment_component/InvestmentProgress';
import InvestmentDescription from './investment_component/InvestmentDescription';
import InvestmentFiles from './investment_component/InvestmentFiles';

import {getInvestmentsDetail} from "../../api/project_api";

function InvestmentDetail() {
    const { id } = useParams();

    const dummyReporterId = '나는1번사용잔데용'; //나중에 로그인 정보 받아와야함

    const {
        data: investment,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['investmentDetail', id],
        queryFn: async ({ signal }) => {

            return getInvestmentsDetail('/product',id, { signal });
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5분 동안은 fresh 상태 유지
        cacheTime: 10 * 60 * 1000, // 캐시에 10분간 보관
    });

    if (isLoading) {
        return <div className="text-center py-20 text-gray-600">데이터를 불러오는 중입니다...</div>;
    }

    if (isError) {
        console.error("InvestmentDetail fetch error:", error);
        return <div className="text-center py-20 text-red-500">에러 발생: {error?.message || '상세 정보를 불러올 수 없습니다.'}</div>;
    }

    if (!investment) { // 데이터가 존재하지 않는 경우 (예: ID는 유효했으나 서버에서 404 응답)
        return <div className="text-center py-20 text-red-500">해당 프로젝트를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            {/* 상단부 */}
            <InvestmentSummary
                title={investment.title}
                projectNumber={investment.projectNumber}
                startDate={investment.startDate}
                endDate={investment.endDate}
                author={investment.author}
                isFavorite={investment.isFavorite}
                isInvested={investment.isInvested}
                minInvestment={investment.minInvestment}
                imageUrl={investment.imageUrl}
                summary={investment.summary}
                tokenPrice={investment.tokenPrice}
                reporterId={dummyReporterId}
            />

            {/* 2. 투자 목표 및 진행 */}
            <InvestmentProgress
                currentAmount={investment.currentAmount}
                minInvestment={investment.minInvestment}
                targetAmount={investment.targetAmount}
                progress={investment.progress}
            />

            {/* 프로젝트 상세 설명 */}
            <InvestmentDescription
                imageUrl={investment.imageUrl}
                summary={investment.summary}
                description={investment.description}
            />

            {/* 첨부 파일 */}
            <InvestmentFiles files={investment.files} />
        </div>
    );
}

export default InvestmentDetail;