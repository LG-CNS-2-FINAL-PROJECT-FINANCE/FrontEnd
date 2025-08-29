import React, {useEffect} from 'react';
import useUser from "../../../lib/useUser";
import {getMyProductPv} from "../../../api/myPage_api";
import {useQuery} from "@tanstack/react-query";
import InvestmentCard from "../../../component/InvestmentCard";

const MyProductList = () => {

    const { user } = useUser();

    const queryEnabled = !!user;
    const queryFnToUse = getMyProductPv;
    const queryKeyToUse = ['myProductPv', user?.email];

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
        return <div className="container mx-auto py-8 text-center text-lg">즐겨 찾기 로딩 중...</div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">에러 발생: {error?.message || '즐겨찾기를 불러올 수 없습니다.'}</div>;
    }

    if (!fetchedData || fetchedData.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">등록 상품 내역</h2>
                <div className="border border-gray-200 rounded-lg p-6 relative w-full text-center text-gray-500">
                    등록된 상품이 없습니다.
                </div>
            </div>
        );
    }

    return(
        <div>
            {/* Favorites List Title */}
            <h2 className="text-2xl font-bold mb-4">등록 상품 내역</h2>

            {/* Full Favorites List with Thin Gray Border - full width */}
            <div
                className="border border-gray-200 rounded-lg p-6 w-full"
            >
                {/* Favorites Grid */}
                <div className="grid grid-cols-4 gap-2">
                    {fetchedData.map((investment) => (
                        <div key={investment.projectId} className="transform scale-90">
                            <InvestmentCard
                                key={investment.projectId}
                                imageUrl={investment.DefaultImageUrl}
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
    )
}
export default MyProductList;