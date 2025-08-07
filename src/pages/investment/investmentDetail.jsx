import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import InvestmentSummary from './InvestmentComponent/InvestmentSummary';
import InvestmentProgress from './InvestmentComponent/InvestmentProgress';
import InvestmentDescription from './InvestmentComponent/InvestmentDescription';
import InvestmentFiles from './InvestmentComponent/InvestmentFiles';

function InvestmentDetail() {
    const { id } = useParams();
    const [investment, setInvestment] = useState(null);
    const [loading, setLoading] = useState(true);

    const dummyReporterId = '나는1번사용잔데용';

    useEffect(() => {
        const dummyDetail = {
            id: id,
            title: `LG CNS 금융 3조 프로젝트 ${id}`,
            projectNumber: `${id}번`,
            startDate: '2024.01.15',
            endDate: '2024.07.15',
            author: '운영팀',
            currentAmount: 85000000,
            minInvestment: 100000,
            targetAmount: 100000000,
            progress: 85,
            imageUrl: `/assets/bull.png`,
            summary: `이 프로젝트는 ${id}번째 시도로, 혁신적인 기술을 활용하여 미래 금융 시장을 선도하고자 합니다. 초기 투자자들에게 높은 수익률을 제공할 것으로 기대됩니다.`,
            description: `프로젝트에 대한 자세한 설명이 여기에 들어갑니다.`,
            files: [ { name: '프로젝트 기획서.pdf', url: '/files/project_plan.pdf' } ],
            isFavorite: false,
            isInvested: Math.random() > 0.5,
            tokenPrice: 10000,
        };
        setInvestment(dummyDetail);
        setLoading(false);
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-gray-600">데이터를 불러오는 중입니다...</div>;
    }

    if (!investment) {
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