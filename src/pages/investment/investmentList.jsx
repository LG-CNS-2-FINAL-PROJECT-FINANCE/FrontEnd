import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../../component/SearchBar';
import InvestmentCard from '../../component/InvestmentCard';
import { useTheme } from '../../context/ThemeContext';

// 정렬 기준을 위한 상수 정의
const SORT_OPTIONS = {
    LATEST: 'latest',     // 최신등록순
    VIEWS: 'views',       // 조회수순
    DEADLINE: 'deadline'  // 마감순
};

function InvestmentListPage() {
    const [investments, setInvestments] = useState([]); // 모든 투자 상품 데이터
    const [searchTerm, setSearchTerm] = useState(''); // 검색창에 입력된 검색어
    const [currentSort, setCurrentSort] = useState(SORT_OPTIONS.LATEST); // 현재 선택된 정렬 기준, 기본은 최신등록순
    const { themeColors, role } = useTheme();

    //임시 더미 데이터.
    useEffect(() => {
        const dummyData = [
            { id: 1, name: "부동산 조각투자 A", amount: "100,010,200원", dday: "3", progress: 60, imageUrl: "image_a.jpg", views: 1500 },
            { id: 2, name: "미술품 조각투자 B", amount: "200,500,000원", dday: "2", progress: 85, imageUrl: "image_b.jpg", views: 3000 },
            { id: 3, name: "명품시계 조각투자 C", amount: "50,000,000원", dday: "1", progress: 95, imageUrl: "image_c.jpg", views: 5000 }, // 마감 임박
            { id: 4, name: "음악 저작권 투자 D",  amount: "300,123,456원", dday: "10", progress: 95, imageUrl: "image_d.jpg", views: 800 },
            { id: 5, name: "와인 컬렉션 투자 E",  amount: "80,000,000원", dday: "7", progress: 50, imageUrl: "image_e.jpg", views: 2000 },
            { id: 6, name: "태양광 발전 투자 F",  amount: "150,000,000원", dday: "5", progress: 70, imageUrl: "image_f.jpg", views: 1200 },
            { id: 7, name: "선박 펀드 투자 G",  amount: "90,000,000원", dday: "4", progress: 40, imageUrl: "image_g.jpg", views: 2500 },
            { id: 8, name: "게임 개발 펀딩 H",  amount: "120,000,000원", dday: "8", progress: 30, imageUrl: "image_h.jpg", views: 900 },
        ];
        setInvestments(dummyData);
    }, []);

    // 필터링 및 정렬된 투자 상품 목록을 계산
    const displayedInvestments = useMemo(() => {
        let filtered = investments.filter(investment =>
            investment.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 선택된 정렬 기준에 따라 정렬
        filtered.sort((a, b) => {
            if (currentSort === SORT_OPTIONS.LATEST) {
                return b.id - a.id; // ID가 높을수록 최신
            } else if (currentSort === SORT_OPTIONS.VIEWS) {
                return b.views - a.views; // 조회수 높은 순
            } else if (currentSort === SORT_OPTIONS.DEADLINE) {
                return Number(a.dday) - Number(b.dday); // dday 적은 순
            }
            return 0; // 기본 정렬
        });

        return filtered;
    }, [investments, searchTerm, currentSort]);

    const deadlineApproachingInvestments = useMemo(() => {
        const sortedByDday = [...investments].sort((a, b) => Number(a.dday) - Number(b.dday));
        return sortedByDday.slice(0, 4);
    }, [investments]);


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
                                <InvestmentCard key={investment.id} project={investment} />
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
                                    ? `${themeColors.primaryBg} text-white` // 선택 시
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // 비선택 시
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
                            <InvestmentCard key={investment.id} project={investment} />
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