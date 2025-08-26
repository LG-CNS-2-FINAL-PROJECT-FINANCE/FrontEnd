import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import {  getPosts, getPostsList } from '../../../api/admin_project_api';
import dayjs from 'dayjs';
import { AuthContext } from '../../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostDetailModal from '../postManagement/PostDetailModal';

// 재사용 버튼
const Button = ({ variant = 'primary', onClick, children, disabled = false }) => {
    const base = 'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[80px]';
    const variants = {
        primary: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
            {children}
        </button>
    );
};

export default function PostManagement() {
    const { accessToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [searchBy, setSearchBy] = useState('TITLE');     //(title/userSeq)
    const [keyword, setKeyword] = useState('');           // (검색어)
    const [requestType, setRequestType] = useState('ALL'); //(CREATE/UPDATE/DELETE)
    const [requestStatus, setRequestStatus] = useState('ALL'); //(APPROVE/PENDING/DECLINE)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const [submittedFilters, setSubmittedFilters] = useState({});

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const currentFilters = useMemo(() => {
        return {
            searchBy,
            keyword: keyword.trim(),
            requestType,
            requestStatus,
            startDate,
            endDate,
            page,
            size,
        };
    }, [searchBy, keyword, requestType, requestStatus, startDate, endDate, page, size]);

    const isSearchActive = useMemo(() => {
        return (
            (currentFilters.keyword && currentFilters.keyword !== '') ||
            (currentFilters.requestType && currentFilters.requestType !== 'ALL') ||
            (currentFilters.requestStatus && currentFilters.requestStatus !== 'ALL') ||
            (currentFilters.startDate && currentFilters.startDate !== '') ||
            (currentFilters.endDate && currentFilters.endDate !== '')
        );
    }, [currentFilters]);

    const {
        data,
        isLoading: isInitialLoading,
        isFetching,
        isError,
        error: queryError,
    } = useQuery({
        queryKey: ['posts', submittedFilters],
        queryFn: async ({ queryKey, signal }) => {
            const [, filters] = queryKey;
            if (!accessToken) return { posts: [], total: 0 };

            const isSearchActive = (
                (filters.keyword && filters.keyword !== '') ||
                (filters.requestType && filters.requestType !== 'ALL') ||
                (filters.requestStatus && filters.requestStatus !== 'ALL') ||
                (filters.startDate && filters.startDate !== '') ||
                (filters.endDate && filters.endDate !== '')
            );

            if (isSearchActive) {
                console.log('[PostManagement] Fetching with getAdminPostsSearch:', filters);
                return getPosts({ ...filters, signal });
            } else {
                console.log('[PostManagement] Fetching with getPostsList (no search terms):', filters.page, filters.size);
                return getPostsList({ page: filters.page, size: filters.size, signal });
            }
        },
        enabled: !!accessToken,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });

    const posts = data?.posts || [];
    const total = data?.total ?? 0;
    // const pages = data?.page ?? 1;
    const isLoading = isInitialLoading || isFetching;
    const error = isError ? (queryError?.message || '알 수 없는 오류가 발생했습니다.') : '';

    useEffect(() => {
        if (accessToken) {
            setSubmittedFilters({ // 초기 상태와 일치하도록 설정
                page: 1,
                size: 10, // size 초기값
                searchBy: 'TITLE',
                keyword: '',
                requestType: 'ALL',
                requestStatus: 'ALL',
                startDate: '',
                endDate: '',
            });
        }
    }, [accessToken]);

    const handleRowClick = (post) => { setSelectedPost(post); setIsDetailModalOpen(true); };
    const handleModalClose = () => { setIsDetailModalOpen(false); setSelectedPost(null); };
    const handleStatusChange = (requestId, newStatus) => { queryClient.invalidateQueries(['posts']); handleModalClose(); };

    // 버튼 액션
    const handleSearchClick = () => {
        setPage(1);
        setSubmittedFilters({
            page: 1, // 새로운 검색 시 페이지는 항상 1
            size: size, // 현재 선택된 size 유지
            searchBy,
            keyword: keyword.trim(),
            requestType,
            requestStatus,
            startDate,
            endDate,
        });
    }
    const handleReset = () => {
        setSearchBy('TITLE');
        setKeyword('');
        setRequestType('ALL');
        setRequestStatus('ALL');
        setStartDate('');
        setEndDate('');
        setPage(1);
        setSize(10);

        setSubmittedFilters({
            page: 1,
            size: 10,
            searchBy: 'TITLE',
            keyword: '',
            requestType: 'ALL',
            requestStatus: 'ALL',
            startDate: '',
            endDate: '',
        });
    };
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSubmittedFilters(prev => ({ ...prev, page: newPage }));
    };
    const handlePrev = () => { if (page > 1) handlePageChange(page - 1); };
    const handleNext = () => {
        const maxPage = Math.max(1, Math.ceil((total ?? 0) / size));
        if (page < maxPage) handlePageChange(page + 1);
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            {/* 상단 검색영역 */}
            <div className="p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-3">
                    {/* 타이틀 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold whitespace-nowrap">게시물관리</h1>
                            <div className="text-sm text-gray-500">전체: {total ?? '-'}건</div>
                        </div>
                    </div>

                    {/* 필터 박스 */}
                    <div className="bg-white rounded shadow overflow-hidden">
                        <div className="p-3">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 w-full items-end">
                                {/* 검색유형 */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">검색유형</label>
                                    <select
                                        value={searchBy}
                                        onChange={(e) => setSearchBy(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        {/*<option value="requestId">게시물번호</option>*/}
                                        <option value="USER_SEQ">사용자번호</option>
                                        <option value="TITLE">제목</option>
                                    </select>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">검색어</label>
                                    <input
                                        type="search"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder={
                                            searchBy === 'requestId' ? '게시물번호 입력'
                                                : searchBy === 'userNo' ? '사용자번호 입력'
                                                    : '제목 입력'
                                        }
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                {/* 요청유형 */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">요청유형</label>
                                    <select
                                        value={requestType}
                                        onChange={(e) => setRequestType(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="ALL">전체</option>
                                        <option value="CREATE">등록</option>
                                        <option value="UPDATE">수정</option>
                                        <option value="STOP">정지</option>
                                    </select>
                                </div>

                                {/* 승인상태 */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">승인상태</label>
                                    <select
                                        value={requestStatus}
                                        onChange={(e) => setRequestStatus(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="ALL">전체</option>
                                        <option value="PENDING">대기</option>
                                        <option value="APPROVED">승인</option>
                                        <option value="REJECTED">거절</option>
                                    </select>
                                </div>

                                {/* 날짜 */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">시작일</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-1 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">종료일</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-1 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                {/* 액션 */}
                                <div className="lg:col-span-3 flex justify-end gap-2">
                                    <Button variant="primary" onClick={handleSearchClick}>검색</Button>
                                    <Button variant="secondary" onClick={handleReset}>초기화</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 테이블 */}
            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {isLoading ? '로딩 중...' : error ? `에러: ${error}` : `검색결과: ${posts.length}건`}
                        </div>
                        <div className="flex items-center gap-2">
                            {/*<button onClick={handlePrev} disabled={page <= 1 || isLoading} className="px-2 py-1 border rounded">이전</button>*/}
                            {/*<span className="text-sm"> {page} </span>*/}
                            {/*<button onClick={handleNext} disabled={isLoading || (total !== null && page >= Math.ceil(total / size))} className="px-2 py-1 border rounded">다음</button>*/}
                            {/*<select
                                value={size}
                                onChange={(e) => { setSize(Number(e.target.value)); handlePageChange(1); }}
                                className="ml-2 px-2 py-1 border rounded"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>*/}
                        </div>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
                        <table className="min-w-full table-fixed border-collapse">
                            <thead className="bg-red-500 sticky top-0 z-10">
                                <tr>
                                    <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">게시물번호</th>
                                    <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">사용자번호</th>
                                    <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">제목</th>
                                    <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b text-white">시작일자</th>
                                    <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b text-white">종료일자</th>
                                    <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">승인상태</th>
                                    <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">요청유형</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7" className="p-6 text-center text-gray-500">로딩 중입니다...</td></tr>
                                ) : posts.length === 0 ? (
                                    <tr><td colSpan="7" className="p-6 text-center text-gray-500">표시할 게시물이 없습니다.</td></tr>
                                ) : (
                                    posts.map((p) => {
                                        const isDisabled = p.requestStatus === 'APPROVED' || p.requestStatus === 'REJECTED' ||
                                            p.status === 'APPROVED' || p.status === 'REJECTED';
                                        return (
                                            <tr
                                                key={getPostKey(p)}
                                                onClick={() => handleRowClick(p)}
                                                className={`${isDisabled
                                                    ? 'bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100'
                                                    : 'hover:bg-gray-50 cursor-pointer'
                                                    } transition-colors`}
                                            >
                                                <td className="px-4 py-3 text-sm border-b">{p.requestId ?? p.id ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm border-b">{p.userNo ?? p.userId ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm border-b">{p.title ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm border-b">{formatDate(p.startDate) ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm border-b">{formatDate(p.endDate) ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm border-b">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(p.requestStatus ?? p.status) === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                            (p.requestStatus ?? p.status) === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {p.requestStatus ?? p.status ?? '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm border-b">{p.requestType ?? p.type ?? '-'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isDetailModalOpen && (
                <PostDetailModal
                    open={isDetailModalOpen}
                    onClose={handleModalClose}
                    post={selectedPost}
                    onStatusChange={handleStatusChange} // (requestId, newStatus) 시그니처 유지
                />
            )}
        </div>
    );
}

function getPostKey(p) {
    return p.requestId || p.id || p._id || `temp-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(d) {
    if (!d) return null;
    try {
        const date = typeof d === 'number' ? new Date(d) : new Date(d);
        if (isNaN(date.getTime())) return d;
        return dayjs(date).format('YYYY-MM-DD');
    } catch {
        return d;
    }
}
