import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../../component/SearchBar';
import InvestmentCard from '../../component/InvestmentCard';
import { useTheme } from '../../context/ThemeContext';
import { getInvestments } from '../../api/project_api';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

// 정렬 기준을 위한 상수 정의
const SORT_OPTIONS = {
    LATEST: 'latest',     // 최신등록순
    VIEWS: 'views',       // 조회수순
    DEADLINE: 'deadline'  // 마감순
};

// 금액 포멧팅 유틸 함수 -> 설명을 찾아보니 사용자에게 친숙하게 돈을 보여주기 위한 코드라는데 잘 모르겠음
const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '-';
    const numAmount = parseFloat(amount.toString()); // Decimal128 호환을 위해 toString() 후 parseFloat()
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(numAmount);
};

const calculateDday = (ddayNum) => {
    if (ddayNum === undefined || ddayNum === null || ddayNum === '') return '-';
    ddayNum = Number(ddayNum);

    if (ddayNum < 0) return '마감';
    if (ddayNum === 0) return '오늘 마감';
    return `${ddayNum}`;
};


function InvestmentListPage() {
    const [searchTerm, setSearchTerm] = useState(''); // 검색창에 입력된 검색어
    const [currentSort, setCurrentSort] = useState(SORT_OPTIONS.LATEST); // 현재 선택된 정렬 기준, 기본은 최신등록순
    const { themeColors, role } = useTheme();

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
            investment.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (currentSort === SORT_OPTIONS.LATEST) {
                return b.requestId - a.requestId; // requestId가 높을수록 최신
            } else if (currentSort === SORT_OPTIONS.VIEWS) {
                return b.viewCount - a.viewCount; // viewCount 기준으로 조회수 높은 순
            } else if (currentSort === SORT_OPTIONS.DEADLINE) {
                return a.deadline - b.deadline; // deadline (숫자) 기준으로 마감 순
            }
            return 0; // 기본 정렬
        });

        return filtered;
    }, [fetchedInvestments, searchTerm, currentSort]);


    const deadlineApproachingInvestments = useMemo(() => {
        const hasDeadline = displayedInvestments.filter(inv => inv.deadline !== undefined && inv.deadline !== null && Number(inv.deadline) >= 0);
        // deadline 기준으로 오름차순 정렬 (마감이 가까운 순)
        const sortedByDeadline = [...hasDeadline].sort((a, b) => {
            return a.deadline - b.deadline; // deadline (숫자) 기준으로 정렬
        });
        return sortedByDeadline.slice(0, 4); // 상위 4개만
    }, [displayedInvestments]);

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center text-lg">투자 상품 로딩 중...</div>;
    }

    if (isError) {
        return <div className="container mx-auto py-8 text-center text-red-500">에러 발생: {error?.message || '상품을 불러올 수 없습니다.'}</div>;
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
                    <h2 className="text-2xl font-bold mb-6">마감 임박 상품 ✨</h2>
                    {deadlineApproachingInvestments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {deadlineApproachingInvestments.map(investment => (
                                <InvestmentCard
                                    key={investment.requestId}
                                    project={{
                                        id: investment.requestId,
                                        name: investment.title,
                                        amount: formatAmount(investment.amount),
                                        dday: calculateDday(investment.deadline),
                                        progress: investment.percent,
                                        imageUrl: investment.image,
                                        views: investment.viewCount,
                                        status: investment.state,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">마감 임박 상품이 없습니다.</p>
                    )}
                </section>
            )}

            {/* 모든 투자 상품 */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {role === '창작자' ? '내 프로젝트 관리 🎨' : '모든 투자 상품 펀딩 🚀'}
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
                            최신등록순
                        </button>
                        <button
                            onClick={() => setCurrentSort(SORT_OPTIONS.VIEWS)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                currentSort === SORT_OPTIONS.VIEWS
                                    ? `${themeColors.primaryBg} text-white`
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            조회수순
                        </button>
                        <button
                            onClick={() => setCurrentSort(SORT_OPTIONS.DEADLINE)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                currentSort === SORT_OPTIONS.DEADLINE
                                    ? `${themeColors.primaryBg} text-white`
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            마감순
                        </button>
                    </div>
                </div>

                {displayedInvestments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedInvestments.map(investment => (
                            <InvestmentCard
                                key={investment.requestId}
                                project={{
                                    id: investment.requestId,
                                    name: investment.title,
                                    amount: formatAmount(investment.amount),
                                    dday: calculateDday(investment.deadline),
                                    progress: investment.percent,
                                    imageUrl: investment.image,
                                    views: investment.viewCount,
                                    status: investment.state,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">검색 결과가 없습니다.</p>
                )}
            </section>
        </div>
    );
}

export default InvestmentListPage;