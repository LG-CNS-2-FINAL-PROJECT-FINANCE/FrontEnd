import React, {useEffect, useState} from 'react';
import {IoIosAdd} from "react-icons/io";
import InvestmentCard from "../../../component/InvestmentCard";
import {useNavigate} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getMyProductPv} from "../../../api/myPage_api";
import useUser from "../../../lib/useUser";
import { useTranslation } from 'react-i18next';

const MyProductPreview = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [displayedInvestments, setDisplayedInvestments] = useState([]);


    const handleMoreClick = () => {
        navigate('/my-product');
    }

    const { user } = useUser();
/*    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return '';
        const numAmount = parseFloat(amount.toString());
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(numAmount);
    };*/

    const calculateDday = (ddayNum) => {
        if (ddayNum === undefined || ddayNum === null || ddayNum === '') return '';
        ddayNum = Number(ddayNum);

        if (ddayNum < 0) return t('dday_closed');
        if (ddayNum === 0) return t('dday_today');
        return `${ddayNum}`;
    };

    const queryEnabled = !!user;
    const queryFnToUse = getMyProductPv;
    const queryKeyToUse =  ['myProductPv', user?.email];

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

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center text-lg">
            {t('my_product_preview_loading_message')}
        </div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">{t('my_product_preview_error_message', { errorMessage: error?.message || t('my_product_preview_error_fallback')})}</div>;
    }

    if (!fetchedData || fetchedData.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">{t('my_product_preview_title')}</h2>
                <div className="border border-gray-200 rounded-lg p-6 relative w-full text-center text-gray-500">
                    {t('my_product_preview_no_products')}
                </div>
            </div>
        );
    }

    return(
        <>
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('my_product_preview_title')}</h2>
                <div
                    className="border border-gray-200 rounded-lg p-6 relative w-full"
                >
                    <button
                        className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                        onClick={handleMoreClick}
                    >
                        <IoIosAdd className="text-2xl text-gray-600" />
                    </button>

                    <div className="grid grid-cols-4 gap-4">
                        {displayedInvestments.map((investment) => (
                            <div key={investment.projectId} className="transform scale-90 relative" >
                                <InvestmentCard
                                    // disableNavigation={true}
                                    key={investment.projectId}
                                    imageUrl={investment.DefaultImageUrl}
                                    project={{
                                        projectId: investment.projectId,
                                        name: investment.title,
                                        // amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline, t),
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
        </>
    );
};

export default MyProductPreview;