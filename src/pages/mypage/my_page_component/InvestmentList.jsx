import React, { useState, useEffect, useContext } from 'react';
import InvestmentCard from '../../../component/InvestmentCard';
import { getMyInvestmentList, getMyProductList } from '../../../api/myPage_api';
import { useQuery } from "@tanstack/react-query";
import useUser from "../../../lib/useUser";

const InvestmentList = ({}) => {

    const { user } = useUser();

    const userRole = user?.role || '';
    const CREATOR = "CREATOR";

    const queryEnabled = !!user;

    let queryFnToUse = getMyInvestmentList; // 기본값
    let queryKeyToUse = ['myInvestmentsList', user?.email];
    if (userRole === CREATOR) {
        queryFnToUse = getMyProductList;
        queryKeyToUse = ['myProductList', user?.email]
    }



    const {
        data: fetchedData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: queryKeyToUse,
        queryFn: async ({ signal }) => {
            return queryFnToUse({ signal, userId: user?.email });
        },
        enabled: queryEnabled,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    useEffect(() => {
        /*if (fetchedData) {
        }*/
    }, [fetchedData]);

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return '';
        const numAmount = parseFloat(amount.toString());
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(numAmount);
    };

    const calculateDday = (ddayNum) => {
        if (ddayNum === undefined || ddayNum === null || ddayNum === '') return '';
        ddayNum = Number(ddayNum);

        if (ddayNum < 0) return '마감';
        if (ddayNum === 0) return 'Day';
        return `${ddayNum}`;
    };

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center text-lg">투자 내역 로딩 중...</div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">에러 발생: {error?.message || '투자 내역을 불러올 수 없습니다.'}</div>;
    }

    if (!fetchedData || fetchedData.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">투자 내역</h2>
                <div className="border border-gray-200 rounded-lg p-6 relative w-full text-center text-gray-500">
                    투자 내역이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <>
        {userRole === "CREATOR" ? (
            <div>
                {/* Investment List Title */}

                <h2 className="text-2xl font-bold mb-4">상품 요청 내역</h2>
                <h3 className="text-right text-xs text-gray-500 px-2">요청은 프로젝트당 하나씩 요청할 수 있습니다.</h3>
                <h3 className="text-right text-xs text-red-500 px-2">(요청 신청을 취소하고 싶으시면 길게 눌러서 취소하세요)</h3>

                {/* Full Investment List with Thin Gray Border - full width */}
                <div
                    className="border border-gray-200 rounded-lg p-6 w-full"
                >
                    {/* Investment Grid - shows all items */}
                    <div className="grid grid-cols-4">
                        {fetchedData.map((investment) => (
                            <div key={investment.requestId} className="transform scale-90" >
                                <InvestmentCard
                                    disableNavigation={true}
                                    key={investment.requestId}
                                    imageUrl={investment.imageUrl}
                                    project={{
                                        projectId: investment.requestId,
                                        name: investment.title,
                                        amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline),
                                        progress: investment.progress,
                                        views: investment.views,
                                        status: investment.status,
                                        startDate: investment.startDate,
                                        type: investment.type,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        ) : (

            <div>
                {/* Investment List Title */}
                <h2 className="text-2xl font-bold mb-4">투자 내역</h2>

                {/* Full Investment List with Thin Gray Border - full width */}
                <div
                    className="border border-gray-200 rounded-lg p-6 w-full"
                >
                    {/* Investment Grid - shows all items */}
                    <div className="grid grid-cols-4 gap-2">
                        {fetchedData.map((investment) => (
                            <div key={investment.projectId} className="transform scale-90">
                                <InvestmentCard
                                    key={investment.projectId}
                                    imageUrl={investment.imageUrl}
                                    project={{
                                        projectId: investment.projectId,
                                        name: investment.title,
                                        amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline),
                                        progress: investment.progress,
                                        views: investment.views,
                                        status: investment.status,
                                        startDate: investment.startDate,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        )}
        </>

    );
};

export default InvestmentList;
