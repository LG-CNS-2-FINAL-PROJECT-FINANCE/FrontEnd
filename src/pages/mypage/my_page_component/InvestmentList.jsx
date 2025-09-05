import React, { useState, useEffect, useContext } from 'react';
import InvestmentCard from '../../../component/InvestmentCard';
import { getMyInvestmentList, getMyProductList } from '../../../api/myPage_api';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "../../../lib/useUser";
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {FaTrashAlt} from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const InvestmentList = ({}) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

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

        if (ddayNum < 0) return t('dday_closed');
        if (ddayNum === 0) return t('dday_today');
        return `${ddayNum}`;
    };

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center text-lg">
            {userRole === CREATOR ? t('investment_preview_loading_product_requests') : t('investment_preview_loading_investment_history')}
        </div>;
    }

    if (isError) {
        return (
            <div className="container mx-auto py-8 text-center text-red-500">
                {t('investment_preview_error_message', { errorMessage: error?.message || t('investment_preview_error_fallback')})}
            </div>
        );
    }

    if (!fetchedData || fetchedData.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">
                    {userRole === CREATOR ? t('investment_preview_product_requests_title') : t('investment_preview_investment_history_title')}
                </h2>
                <div className="border border-gray-200 rounded-lg p-6 relative w-full text-center text-gray-500">
                    {userRole === CREATOR ? t('investment_preview_no_product_requests') : t('investment_preview_no_investment_history')}
                </div>
            </div>
        );
    }

    const handleDeleteClick = (requestId, title) => {
        setSelectedProductToDelete({ requestId, title });
        setIsConfirmDeleteModalOpen(true);
    };

    const handleCloseConfirmDeleteModal = () => {
        setIsConfirmDeleteModalOpen(false);
        setSelectedProductToDelete(null);
    };

    const handleProductDeleted = () => {
        // 삭제 성공 후 현재 쿼리 키를 무효화하여 최신 목록을 다시 가져옴
        queryClient.invalidateQueries(queryKeyToUse);
        handleCloseConfirmDeleteModal(); // 모달 닫기
    };

    return (
        <>
        {userRole === "CREATOR" ? (
            <div>
                {/* Investment List Title */}

                <h2 className="text-2xl font-bold mb-4">{t('investment_preview_product_requests_title')}</h2>
                <h3 className="text-right text-xs text-gray-500 px-2">{t('investment_list_creator_request_limit')}</h3>
                <h3 className="text-right text-xs text-red-500 px-2">{t('investment_list_creator_cancel_request_guide')}</h3>

                {/* Full Investment List with Thin Gray Border - full width */}
                <div
                    className="border border-gray-200 rounded-lg p-6 w-full"
                >
                    {/* Investment Grid - shows all items */}
                    <div className="grid grid-cols-4 gap-4">
                        {fetchedData.map((investment) => (
                            <div key={investment.requestId} className="transform scale-90 relative" >
                                <InvestmentCard
                                    disableNavigation={true}
                                    key={investment.requestId}
                                    imageUrl={investment.DefaultImageUrl}
                                    project={{
                                        projectId: investment.requestId,
                                        name: investment.title,
                                        amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline, t),
                                        progress: investment.progress,
                                        views: investment.views,
                                        status: investment.status,
                                        startDate: investment.startDate,
                                        type: investment.type,
                                    }}
                                />
                                <button
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(investment.requestId, investment.title);
                                    }}
                                >
                                        <FaTrashAlt className="w-3 h-3" />
                                    </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        ) : (

            <div>
                {/* Investment List Title */}
                <h2 className="text-2xl font-bold mb-4">{t('investment_preview_investment_history_title')}</h2>

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
                                    imageUrl={investment.DefaultImageUrl}
                                    project={{
                                        projectId: investment.projectId,
                                        name: investment.title,
                                        amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline, t),
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
            {isConfirmDeleteModalOpen && selectedProductToDelete && (
                <ConfirmDeleteModal
                    open={isConfirmDeleteModalOpen}
                    onClose={handleCloseConfirmDeleteModal}
                    requestId={selectedProductToDelete.requestId}
                    titleToMatch={selectedProductToDelete.title}
                    onDeleted={handleProductDeleted}
                />
            )}
        </>


    );
};

export default InvestmentList;
