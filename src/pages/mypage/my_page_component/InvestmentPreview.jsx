import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';
import useUser from "../../../lib/useUser";
import { getMyInvestmentList, getMyProductList } from '../../../api/myPage_api';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {FaTrashAlt} from "react-icons/fa";

const InvestmentPreview = ({}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [displayedInvestments, setDisplayedInvestments] = useState([]);

    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

    const handleMoreClick = () => {
        navigate('/my-investments');
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const yyyy_mm_dd = `${year}-${month}-${day}`;

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
    const queryFnToUse = userRole === CREATOR ? getMyProductList : getMyInvestmentList;
    const queryKeyToUse = userRole === CREATOR ? ['myProductsList', user?.email] : ['myInvestmentsList', user?.email];

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
            {userRole === CREATOR ? "상품 요청 내역" : "투자 내역"} 로딩 중...
        </div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">에러 발생: {error?.message || '상품을 불러올 수 없습니다.'}</div>;
    }

    if (!fetchedData || fetchedData.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">{userRole === CREATOR ? "상품 요청 내역" : "투자 내역"}</h2>
                <div className="border border-gray-200 rounded-lg p-6 relative w-full text-center text-gray-500">
                    {userRole === CREATOR ? "요청된 상품이 없습니다." : "투자 내역이 없습니다."}
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
            {userRole === CREATOR ? (
                // 창작자일경우
                <div>
                    <h2 className="text-2xl font-bold mb-4">상품 요청 내역</h2>
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
                                <div key={investment.requestId} className="transform scale-90 relative" >
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
                // 투자자일경우
                <div>
                    <h2 className="text-2xl font-bold mb-4">투자 내역</h2>
                    <div
                        className="border border-gray-200 rounded-lg p-6 relative w-full"
                    >
                        <button
                            className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                            onClick={handleMoreClick}
                        >
                            <IoIosAdd className="text-2xl text-gray-600" />
                        </button>
                        {/*갯수 제한 둘 때 아래 사용*/}
                        {/*
                        {displayedInvestments.length > 5 && (

                        )}*/}

                        <div className="grid grid-cols-4">
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

export default InvestmentPreview;