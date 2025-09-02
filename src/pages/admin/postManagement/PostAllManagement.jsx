import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { getAdminProductList, searchAdminProduct } from '../../../api/project_api';
import dayjs from 'dayjs';
import { AuthContext } from '../../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostAllDetailModal from './PostAllDetailModal';

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


export default function PostAllManagement() {
    const { accessToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [searchBy, setSearchBy] = useState('TITLE');
    const [keyword, setKeyword] = useState('');
    const [projectVisibility, setProjectVisibility] = useState('ALL');
    const [projectStatus, setProjectStatus] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [submittedFilters, setSubmittedFilters] = useState({});

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const currentUiFilters = useMemo(() => {
        return {
            searchBy,
            keyword: keyword.trim(),
            projectVisibility,
            projectStatus,
            startDate,
            endDate,
        };
    }, [searchBy, keyword, projectVisibility, projectStatus, startDate, endDate]);

    const isSearchActive = useMemo(() => {
        return (
            (currentUiFilters.keyword && currentUiFilters.keyword !== '') ||
            (currentUiFilters.projectVisibility && currentUiFilters.projectVisibility !== 'ALL') ||
            (currentUiFilters.projectStatus && currentUiFilters.projectStatus !== 'ALL') ||
            (currentUiFilters.startDate && currentUiFilters.startDate !== '') ||
            (currentUiFilters.endDate && currentUiFilters.endDate !== '')
        );
    }, [currentUiFilters]);

    const {
        data,
        isLoading: isInitialLoading,
        isFetching,
        isError,
        error: queryError,
    } = useQuery({
        queryKey: ['adminProducts', submittedFilters],
        queryFn: async ({ signal }) => {
            if (!accessToken) return { posts: [], total: 0 };

            const filters = submittedFilters;
            console.log('--- API 호출 ---');
            console.log('실제로 API로 전송될 필터 조건 (queryFn):', filters);

            if (isSearchActive) {
                console.log('[PostAllManagement] Fetching with searchAdminProduct:', submittedFilters);
                return searchAdminProduct({ ...submittedFilters, signal });
            } else {
                console.log('[PostAllManagement] Fetching with getAdminProductList (no search terms):', submittedFilters);
                return getAdminProductList({ signal });
            }
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const posts = data?.posts || [];
    const total = data?.total ?? 0;
    const isLoading = isInitialLoading || isFetching;
    const error = isError ? (queryError?.message || '알 수 없는 오류가 발생했습니다.') : '';

    useEffect(() => {
        if (accessToken) {
            setSubmittedFilters({
                searchBy: 'TITLE',
                keyword: '',
                projectVisibility: 'ALL',
                projectStatus: 'ALL',
                startDate: '',
                endDate: '',
            });
        }
    }, [accessToken]);

    const handleRowClick = (post) => { setSelectedPost(post); setIsDetailModalOpen(true); };
    const handleModalClose = () => { setIsDetailModalOpen(false); setSelectedPost(null); };
    const handleStatusChange = () => {
        queryClient.invalidateQueries(['adminProducts']);
        handleModalClose();
    };

    const handleRefreshClick = () => {
        queryClient.invalidateQueries(['adminProducts']);
    };

    const handleReset = () => {
        setSearchBy('TITLE');
        setKeyword('');
        setProjectVisibility('ALL');
        setProjectStatus('ALL');
        setStartDate('');
        setEndDate('');
        setSubmittedFilters({
            searchBy: 'TITLE',
            keyword: '',
            projectVisibility: 'ALL',
            projectStatus: 'ALL',
            startDate: '',
            endDate: '',
        });
    };

    const handleSearchClick = () => {
        setSubmittedFilters(currentUiFilters);
        console.log('--- 검색 실행 ---');
        console.log('적용된 검색/필터 조건 (handleSearchClick):', currentUiFilters);
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            <div className="p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold whitespace-nowrap">게시물관리</h1>
                            <div className="text-sm text-gray-500">전체: {total ?? '-'}건</div>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow overflow-hidden">
                        <div className="p-3">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 w-full items-end">
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">검색유형</label>
                                    <select
                                        value={searchBy}
                                        onChange={(e) => setSearchBy(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="TITLE">제목</option>
                                        <option value="PROJECT_ID">게시물번호</option>
                                        <option value="USER_SEQ">사용자번호</option>
                                        <option value="NICKNAME">닉네임</option>
                                    </select>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">검색어</label>
                                    <input
                                        type="search"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder={searchBy === 'TITLE' ? '제목 입력' : searchBy === 'PROJECT_ID' ? '게시물번호 입력' : searchBy === 'USER_SEQ' ? '사용자번호 입력' : '닉네임 입력'}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">숨김상태</label>
                                    <select
                                        value={projectVisibility}
                                        onChange={(e) => setProjectVisibility(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="ALL">전체</option>
                                        <option value="PUBLIC">공개</option>
                                        <option value="HOLD">숨김</option>
                                    </select>
                                </div>

                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">게시물상태</label>
                                    <select
                                        value={projectStatus}
                                        onChange={(e) => setProjectStatus(e.target.value)}
                                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="ALL">전체</option>
                                        <option value="OPEN">모집중</option>
                                        <option value="FUNDING_LOCKED">모집 완료</option>
                                        <option value="TRADING">거래중</option>
                                        <option value="DISTRIBUTION_READY">정산 준비</option>
                                        <option value="DISTRIBUTING">정산중</option>
                                        <option value="CLOSED">종료</option>
                                    </select>
                                </div>

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
                                        className="w-full px-1 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                <div className="lg:col-span-3 flex justify-end gap-2">
                                    <Button variant="primary" onClick={handleSearchClick}>검색</Button>
                                    <Button variant="secondary" onClick={handleReset}>초기화</Button>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {isLoading ? '로딩 중...' : error ? `에러: ${error}` : `검색결과: ${posts.length}건`}
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
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">상태</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">유형</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <tr><td colSpan="7" className="p-6 text-center text-gray-500">로딩 중입니다...</td></tr>
                            ) : posts.length === 0 ? (
                                <tr><td colSpan="7" className="p-6 text-center text-gray-500">표시할 게시물이 없습니다.</td></tr>
                            ) : (
                                posts.map((p) => {
                                    const isDisabled = p.status === 'APPROVED' || p.status === 'REJECTED';
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
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(p.status) === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        (p.state) === 'OPEN' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'

                                                        //OPEN / FUNDING_LOCKED / TRADING / DISTRIBUTION_READY / DISTRIBUTING / CLOSED / TEMPORARY_STOP
                                                    }`}>
                                                        {p.state ?? '-'}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b">{p.visiblity ?? '-'}</td>
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
                <PostAllDetailModal
                    open={isDetailModalOpen}
                    onClose={handleModalClose}
                    postId={selectedPost.requestId}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}