import React, { useEffect, useState, useRef, useContext } from 'react';
import { getPosts } from '../../../api/project_api';
import dayjs from 'dayjs';
import { AuthContext } from '../../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import PostDetailModal from '../postManagement/PostDetailModal';

// Button component for consistent styling
const Button = ({ variant = 'primary', onClick, children, disabled = false }) => {
    const baseStyles = 'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[80px]';
    const variants = {
        primary: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

export default function PostManagement() {
    const { accessToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // const [posts, setPosts] = useState([]);
    // const [total, setTotal] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');

    const [searchType, setSearchType] = useState('postNo');
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [requestStatus, setRequestStatus] = useState('ALL'); // 승인상태
    const [requestType, setRequestType] = useState('ALL');     // 요청유형
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    const debounceTimeoutRef = useRef(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    // <<<< useQuery 훅으로 데이터 페칭 로직 통합
    const {
        data,
        isLoading: isInitialLoading,
        isFetching,
        isError: hasError,
        error: queryError,
    } = useQuery({
        queryKey: [
            'posts',
            { page, size, searchType, query, startDate, endDate, requestStatus, requestType, title }
        ],
        queryFn: async ({ queryKey, signal }) => {
            const [, filters] = queryKey;
            if (!accessToken) {
                return { posts: [], total: 0 };
            }
            console.log('[PostManagement - useQuery] getPosts 호출 파라미터:', filters);
            return getPosts({ ...filters, signal });
        },
        enabled: !!accessToken,
        keepPreviousData: true,
    });

    // <<<< useQuery에서 받은 데이터와 상태를 컴포넌트에서 사용하기 편리하게 재정의
    const posts = data?.posts || [];
    const total = data?.total || 0;
    const isLoading = isInitialLoading || isFetching;
    const error = hasError ? (queryError?.message || '알 수 없는 오류가 발생했습니다.') : '';

    useEffect(() => {
        if (!accessToken) return;

        const allSearchFieldsEmpty = !query.trim() && !title.trim() && !startDate && !endDate && requestStatus === 'ALL' && requestType === 'ALL';

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const currentQueryKeyFilters = {
                page: 1,
                size,
                searchType,
                query: query.trim(),
                startDate,
                endDate,
                requestStatus,
                requestType,
                title: title.trim(),
            };
            if (allSearchFieldsEmpty) {
                queryClient.invalidateQueries(['posts', { page: 1, size, searchType, query: '', startDate: '', endDate: '', requestStatus: 'ALL', requestType: 'ALL', title: '' }]);
            } else {
                queryClient.invalidateQueries(['posts', currentQueryKeyFilters]);
            }
        }, 400);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query, searchType, startDate, endDate, requestStatus, requestType, title, accessToken, queryClient, page, size]);

    // <<<< 모달 제어를 위한 핸들러
    const handleRowClick = (post) => {
        setSelectedPost(post);
        setIsDetailModalOpen(true);
    };

    const handleModalClose = () => {
        setIsDetailModalOpen(false);
        setSelectedPost(null);
    };

    const handleStatusChange = (postNo, newStatus) => {
        queryClient.invalidateQueries(['posts']);
        handleModalClose();
    };

    // 검색/리셋/페이징 핸들러: 상태만 업데이트하고 useQuery가 변경을 감지하여 API 호출
    const handleSearchClick = () => { setPage(1); };
    const handleReset = () => { setQuery(''); setStartDate(''); setEndDate(''); setRequestStatus('ALL'); setRequestType('ALL'); setTitle(''); setPage(1); };
    const handlePrev = () => { if (page <= 1) return; setPage(page - 1); };
    const handleNext = () => {
        const maxPage = Math.max(1, Math.ceil((total ?? 0) / size));
        if (page >= maxPage) return;
        setPage(page + 1);
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            {/* 상단 검색영역 */}
            <div className="p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-3">
                    {/* Title row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold whitespace-nowrap">게시물관리</h1>
                            <div className="text-sm text-gray-500">전체: {total ?? '-'}건</div>
                        </div>
                    </div>

                    {/* Search filters row - aligned to match table */}
                    <div className="bg-white rounded shadow overflow-hidden">
                        <div className="p-3">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 w-full items-end">
                                {/* Search type */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">검색유형</label>
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="postNo">번호</option>
                                        <option value="userNo">사용자</option>
                                        <option value="title">제목</option>
                                    </select>
                                </div>

                                {/* Search input */}
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">검색어</label>
                                    <input
                                        type="search"
                                        value={searchType === 'title' ? title : query}
                                        onChange={(e) => {
                                            if (searchType === 'title') {
                                                setTitle(e.target.value);
                                                setQuery('');
                                            } else {
                                                setQuery(e.target.value);
                                                setTitle('');
                                            }
                                        }}
                                        placeholder={`${searchType === 'postNo' ? '번호' : searchType === 'userNo' ? '사용자번호' : '제목'} 입력`}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                {/* Request Type */}
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
                                        <option value="DELETE">삭제</option>
                                    </select>
                                </div>

                                {/* Request Status */}
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

                                {/* Start Date */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">시작일</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-1 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">종료일</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-1 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                {/* Action buttons - using remaining columns */}
                                <div className="lg:col-span-3 flex justify-end gap-2">
                                    <Button variant="primary" onClick={handleSearchClick}>
                                        검색
                                    </Button>
                                    <Button variant="secondary" onClick={handleReset}>
                                        초기화
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        {/* 로딩 상태를 isLoading으로 직접 사용 */}
                        <div className="text-sm text-gray-600">
                            {isLoading ? '로딩 중...' : error ? `에러: ${error}` : `검색결과: ${posts.length}건`}
                        </div>
                        {/* 페이징 컨트롤러 */}
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrev} disabled={page <= 1 || isLoading} className="px-2 py-1 border rounded">이전</button>
                            <span className="text-sm"> {page} </span>
                            <button onClick={handleNext} disabled={isLoading || (total !== null && page >= Math.ceil(total / size))} className="px-2 py-1 border rounded">다음</button>
                            <select
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(1);
                                    // 상태만 업데이트하면 useQuery가 감지하여 자동으로 다시 가져옵니다.
                                }}
                                className="ml-2 px-2 py-1 border rounded"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
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
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">게시물상태</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">로딩 중입니다...</td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">표시할 게시물이 없습니다.</td>
                                </tr>
                            ) : (
                                posts.map((p) => (
                                    <tr
                                        key={getPostKey(p)}
                                        onClick={() => handleRowClick(p)}
                                        className={`${p.status === 'APPROVED' || p.status === 'REJECTED' ? 'cursor-default bg-gray-100 text-gray-500' : 'hover:bg-gray-50 cursor-pointer'}`}
                                    >
                                        <td className="px-4 py-3 text-sm border-b">{p.postNo ?? p.id ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{p.userNo ?? p.userId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{p.title ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{formatDate(p.startDate) ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{formatDate(p.endDate) ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{p.status ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{p.type ?? '-'}</td>
                                    </tr>
                                ))
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
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

function getPostKey(p) {
    return p.postNo || p.id || p._id || `temp-${Math.random().toString(36).slice(2,9)}`;
}

function formatDate(d) {
    if (!d) return null;
    try {
        const date = typeof d === 'number' ? new Date(d) : new Date(d);
        if (isNaN(date.getTime())) return d;
        return dayjs(date).format('YYYY-MM-DD');
    } catch (e) {
        return d;
    }
}