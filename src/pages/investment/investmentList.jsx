import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../../component/SearchBar';
import InvestmentCard from '../../component/InvestmentCard';
import { useTheme } from '../../context/ThemeContext';
import { getInvestments } from '../../api/project_api';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';


// 정렬 기준을 위한 상수 정의
const SORT_OPTIONS = {
    LATEST: 'latest',     // 최신등록순
    VIEWS: 'views',       // 조회수순
    DEADLINE: 'deadline'  // 마감순
};

// 금액 포멧팅 유틸 함수 (Intl.NumberFormat 자체가 다국어 지원)
const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '-';
    const numAmount = parseFloat(amount.toString());
    // ko-KR 로케일을 명시하여 한화 포맷 유지
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(numAmount);
};

// calculateDday 유틸 함수 수정: t 함수를 인자로 받아 번역 적용
const calculateDday = (ddayNum, t) => {
    if (ddayNum === undefined || ddayNum === null || ddayNum === '') return '-';
    ddayNum = Number(ddayNum);

    if (ddayNum < 0) return t('dday_closed'); // "마감"
    if (ddayNum === 0) return t('dday_today'); // "Day"
    return `${ddayNum}`;
};


function InvestmentListPage() {
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentSort, setCurrentSort] = useState(SORT_OPTIONS.LATEST);
    const { themeColors, role } = useTheme(); // role은 'USER' 또는 'CREATOR'로 가정

    const {
        data: fetchedInvestments,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['investmentsList'],
        queryFn: async ({ signal }) => {
            return getInvestments({ signal });
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // 필터링 및 정렬된 투자 상품 목록을 계산
    const displayedInvestments = useMemo(() => {
        if (!fetchedInvestments) return [];

        let filtered = fetchedInvestments.filter(investment =>
            // 검색어는 t() 사용하지 않음 (사용자 입력/백엔드 데이터)
            investment.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (currentSort === SORT_OPTIONS.LATEST) {
                return b.projectId - a.projectId;
            } else if (currentSort === SORT_OPTIONS.VIEWS) {
                return b.viewCount - a.viewCount;
            } else if (currentSort === SORT_OPTIONS.DEADLINE) {
                return a.deadline - b.deadline;
            }
            return 0;
        });

        return filtered;
    }, [fetchedInvestments, searchTerm, currentSort]);


    const deadlineApproachingInvestments = useMemo(() => {
        if (!fetchedInvestments) return [];

        const hasDeadline = fetchedInvestments.filter(inv =>
            inv.deadline !== undefined && inv.deadline !== null && Number(inv.deadline) >= 0
        );

        const sortedByDeadline = [...hasDeadline].sort((a, b) => {
            return a.deadline - b.deadline;
        });

        return sortedByDeadline.slice(0, 4);
    }, [fetchedInvestments]);

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center text-lg">{t('investment_loading_message')}</div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">{t('investment_error_message', { errorMessage: error?.message || t('investment_error_message_fallback')})}</div>;
    }


    return (
        <div className="container mx-auto py-8">
            {/* 검색창 */}
            <section className="mb-10">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </section>

            {/* 마감 임박 카드 4개 */}
            {searchTerm === '' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="animate-bounce">⏰</span>
                        {t('investment_deadline_approaching_title')}
                    </h2>
                    {deadlineApproachingInvestments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {deadlineApproachingInvestments.map(investment => (
                                <InvestmentCard
                                    key={investment.projectId}
                                    imageUrl={investment.DefaultImageUrl}
                                    project={{
                                        projectId: investment.projectId,
                                        name: investment.title, // 투자 상품 이름은 백엔드 데이터이므로 번역X
                                        amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline, t),
                                        progress: investment.percent,
                                        views: investment.viewCount,
                                        status: investment.state,
                                        startDate : investment.startDate,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">{t('investment_no_deadline_approaching')}</p>
                    )}
                </section>
            )}

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {role === 'CREATOR' ? t('investment_my_projects_title') : t('investment_all_products_funding_title')}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentSort(SORT_OPTIONS.LATEST)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                currentSort === SORT_OPTIONS.LATEST
                                    ? `${themeColors.primaryBg} text-white`
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {t('sort_option_latest')}
                        </button>
                        <button
                            onClick={() => setCurrentSort(SORT_OPTIONS.VIEWS)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                currentSort === SORT_OPTIONS.VIEWS
                                    ? `${themeColors.primaryBg} text-white`
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {t('sort_option_views')}
                        </button>
                        <button
                            onClick={() => setCurrentSort(SORT_OPTIONS.DEADLINE)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                currentSort === SORT_OPTIONS.DEADLINE
                                    ? `${themeColors.primaryBg} text-white`
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {t('sort_option_deadline')}
                        </button>
                    </div>
                </div>

                {displayedInvestments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedInvestments.map(investment => (
                            <InvestmentCard
                                key={investment.projectId}
                                imageUrl={investment.DefaultImageUrl}
                                project={{
                                    projectId: investment.projectId,
                                    name: investment.title,
                                    amount: formatAmount(investment.amount),
                                    dday: calculateDday(investment.deadline, t),
                                    progress: investment.percent,
                                    views: investment.viewCount,
                                    status: investment.state,
                                    startDate : investment.startDate,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">{t('investment_no_search_results')}</p>
                )}
            </section>
        </div>
    );
}

export default InvestmentListPage;