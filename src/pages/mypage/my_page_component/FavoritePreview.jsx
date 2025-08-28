import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';
import useUser from "../../../lib/useUser";
import { useQuery } from "@tanstack/react-query";
import {getMyFavoriteList} from "../../../api/favorite_api";

const FavoritePreview = ({}) => {
    const navigate = useNavigate();

    const [displayedInvestments, setDisplayedInvestments] = useState([]);


    const { user } = useUser();

    const userRole = user?.role || '';
    const CREATOR = "CREATOR";

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

    const queryEnabled = !!user;
    const queryFnToUse = userRole === CREATOR ? null : getMyFavoriteList;
    const queryKeyToUse = userRole === CREATOR ? [null, user?.email] : ['myFavoriteList', user?.email];

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
        if (fetchedData) {
            setDisplayedInvestments(fetchedData.slice(0, 8));
        }
    }, [fetchedData]);

    const handleMoreClick = () => {
        navigate('/my-favorites');
    };

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center text-lg">
            {userRole === CREATOR ? null : "즐겨찾기"} 로딩 중...
        </div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">에러 발생: {error?.message || '상품을 불러올 수 없습니다.'}</div>;
    }

    if (!fetchedData || fetchedData.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">{userRole === CREATOR ? null : "즐겨찾기"}</h2>
                <div className="border border-gray-200 rounded-lg p-6 relative w-full text-center text-gray-500">
                    {userRole === CREATOR ? null : "즐겨찾는 항목이 없습니다."}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Favorites List Title - outside the rectangle */}
            <h2 className="text-2xl font-bold mb-4">즐겨찾기</h2>
            
            {/* Favorites List with Thin Gray Border - full width */}
            <div 
                className="border border-gray-200 rounded-lg p-6 relative w-full"
            >
                {/* Add More Button - positioned at top right */}
                <button
                    className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                    onClick={handleMoreClick}
                >
                    <IoIosAdd className="text-2xl text-gray-600" />
                </button>

                {/* Favorites Grid - shows only preview (8 items) */}
                <div className="grid grid-cols-4 gap-2">
                    {displayedInvestments.map((investment) => (
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
    );
};

export default FavoritePreview;
