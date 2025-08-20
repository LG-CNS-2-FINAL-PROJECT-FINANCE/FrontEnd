import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { getPosts } from '../../../api/project_api';
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

  // 검색 상태
  const [searchType, setSearchType] = useState('requestId'); 
  const [query, setQuery] = useState('');   
  const [title, setTitle] = useState('');   
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requestStatus, setRequestStatus] = useState('ALL'); // PENDING/APPROVED/REJECTED/ALL
  const [requestType, setRequestType] = useState('ALL');     // CREATE/UPDATE/DELETE/ALL
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const debounceRef = useRef(null);

  // 화면에서 사용하는 "현재 필터 객체" (queryKey에 그대로 활용)
  const currentFilters = useMemo(() => ({
    page,
    size,
    searchType,                       // 'requestId' | 'userNo' | 'title' 그대로 전달
    query: searchType === 'title' ? '' : query.trim(), // title 검색이 아닐 때만 query 사용
    title: searchType === 'title' ? title.trim() : '', // title 검색일 때만 title 사용
    startDate,
    endDate,
    requestStatus,
    requestType,
  }), [page, size, searchType, query, title, startDate, endDate, requestStatus, requestType]);

  const {
    data,
    isLoading: isInitialLoading,
    isFetching,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['posts', currentFilters],
    queryFn: async ({ queryKey, signal }) => {
      const [, filters] = queryKey;
      if (!accessToken) return { posts: [], total: 0 };

      // 서버는 requestId라는 정확한 키를 계속 사용
      // - searchType이 'requestId'면 query에 담긴 값으로 requestId 검색
      // - searchType이 'userNo'면 query를 userNo 검색값으로 사용
      // - searchType이 'title'이면 title 필드로 검색
      return getPosts({ ...filters, signal });
    },
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const posts = data?.posts || [];
  const total = data?.total ?? 0;
  const isLoading = isInitialLoading || isFetching;
  const error = isError ? (queryError?.message || '알 수 없는 오류가 발생했습니다.') : '';

  // 검색 파라미터 변경 시 디바운스 후 쿼리 무효화
  useEffect(() => {
    if (!accessToken) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      queryClient.invalidateQueries(['posts']); // queryKey가 currentFilters로 구분되므로 이 정도로 충분
    }, 300);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [currentFilters, accessToken, queryClient]);

  // 행 클릭 → 상세 모달
  const handleRowClick = (post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };
  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };
  const handleStatusChange = (requestId, newStatus) => {
    // 상태 변경 후 목록 새로고침
    queryClient.invalidateQueries(['posts']);
    handleModalClose();
  };

  // 버튼 액션
  const handleSearchClick = () => setPage(1);
  const handleReset = () => {
    setSearchType('requestId');
    setQuery('');
    setTitle('');
    setStartDate('');
    setEndDate('');
    setRequestStatus('ALL');
    setRequestType('ALL');
    setPage(1);
    setSize(20);
  };
  const handlePrev = () => { if (page > 1) setPage(page - 1); };
  const handleNext = () => {
    const maxPage = Math.max(1, Math.ceil((total ?? 0) / size));
    if (page < maxPage) setPage(page + 1);
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
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="requestId">게시물번호</option>
                    <option value="userNo">사용자번호</option>
                    <option value="title">제목</option>
                  </select>
                </div>

                {/* 검색어 (하나의 인풋으로 관리: title vs query) */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">검색어</label>
                  <input
                    type="search"
                    value={searchType === 'title' ? title : query}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (searchType === 'title') {
                        setTitle(v);
                        setQuery('');        // 혼동 방지: 다른 쪽은 비움
                      } else {
                        setQuery(v);
                        setTitle('');        // 혼동 방지
                      }
                    }}
                    placeholder={
                      searchType === 'requestId' ? '게시물번호 입력'
                      : searchType === 'userNo' ? '사용자번호 입력'
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
                    <option value="DELETE">삭제</option>
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
            <button onClick={handlePrev} disabled={page <= 1 || isLoading} className="px-2 py-1 border rounded">이전</button>
            <span className="text-sm"> {page} </span>
            <button onClick={handleNext} disabled={isLoading || (total !== null && page >= Math.ceil(total / size))} className="px-2 py-1 border rounded">다음</button>
            <select
                value={size}
                onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
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
                posts.map((p) => (
                    <tr
                    key={getPostKey(p)}
                    onClick={() => handleRowClick(p)}
                    className={`${p.requestStatus === 'APPROVED' || p.requestStatus === 'REJECTED'
                        ? 'cursor-default bg-gray-100 text-gray-500'
                        : 'hover:bg-gray-50 cursor-pointer'}`}
                    >
                    <td className="px-4 py-3 text-sm border-b">{p.requestId ?? p.id ?? '-'}</td>
                    <td className="px-4 py-3 text-sm border-b">{p.userNo ?? p.userId ?? '-'}</td>
                    <td className="px-4 py-3 text-sm border-b">{p.title ?? '-'}</td>
                    <td className="px-4 py-3 text-sm border-b">{formatDate(p.startDate) ?? '-'}</td>
                    <td className="px-4 py-3 text-sm border-b">{formatDate(p.endDate) ?? '-'}</td>
                    <td className="px-4 py-3 text-sm border-b">{p.requestStatus ?? p.status ?? '-'}</td>
                    <td className="px-4 py-3 text-sm border-b">{p.requestType ?? p.type ?? '-'}</td>
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
