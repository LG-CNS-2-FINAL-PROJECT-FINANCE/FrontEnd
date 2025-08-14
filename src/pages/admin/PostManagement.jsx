import React, { useEffect, useState, useRef, useContext } from 'react';
import { getPosts } from '../../api/project_api';
import dayjs from 'dayjs';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PostManagement() {
    const { accessToken, logout } = useContext(AuthContext);
    console.log('[PostManagement] Component Render - accessToken:', accessToken);

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [searchType, setSearchType] = useState('postNo'); // 'postNo' | 'userNo'
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('ALL'); // ALL, PUBLISHED, DRAFT, DELETED 등

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    const fetchPosts = async (opts = {}) => {

        if (!accessToken) {
            setPosts([]);
            setTotal(0);
            setLoading(false);
            return;
        }

        console.log('[PostManagement] fetchPosts 호출됨. 옵션:', opts);
        console.log('[PostManagement] 현재 상태: query=', query, 'startDate=', startDate, 'endDate=', endDate, 'status=', status, 'page=', page, 'size=', size);

        setLoading(true);
        setError('');
        try {
            // 이전 요청 취소
            if (abortRef.current) {
                try { abortRef.current.abort(); } catch (e) { /* ignore */ }
            }
            const controller = new AbortController();
            abortRef.current = controller;

            const { posts: mapped, total: totalCount } = await getPosts({
                page: opts.page ?? page, // fetchPosts 파라미터 또는 현재 page/size 상태 사용
                size: opts.size ?? size,
                type: opts.type ?? searchType,
                q: opts.q ?? query.trim(),
                startDate: opts.startDate ?? startDate,
                endDate: opts.endDate ?? endDate,
                status: opts.status ?? status,
                signal: controller.signal, // AbortController signal 전달
            });

            setPosts(mapped);
            setTotal(totalCount ?? mapped.length);
        } catch (e) {
            if (e.name === 'CanceledError' || e?.message === 'canceled') {
                return;
            }
            console.error('fetchPosts error', e);
            setError('게시물 목록을 불러오는 중 오류가 발생했습니다.');

            if (e.response?.status === 401 || e.response?.status === 403) {
                if (logout) {
                    await logout();
                }
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // accessToken이 없으면 API 호출을 하지 않습니다.
        if (!accessToken) {
            setPosts([]);
            setTotal(null); // 토큰 없으면 총 개수도 초기화
            setLoading(false);
            return;
        }
        fetchPosts(); // accessToken이 유효할 때만 API 호출을 시작
        return () => {
            if (abortRef.current) {
                try { abortRef.current.abort(); } catch (e) {}
            }
        };
    }, [accessToken]);

    // 검색어 디바운스
    useEffect(() => {
        if (!accessToken) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchPosts({ page: 1, q: query.trim() });
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, searchType, startDate, endDate, status]);

    const handleSearchClick = () => {
        setPage(1);
        fetchPosts({ page: 1, q: query.trim(), startDate, endDate, status, type: searchType });
    };

    const handleReset = () => {
        setQuery('');
        setStartDate('');
        setEndDate('');
        setStatus('ALL');
        setPage(1);
        fetchPosts({ page: 1, q: '', startDate: '', endDate: '', status: 'ALL' });
    };

    // 간단한 페이징 UI 핸들러
    const handlePrev = () => {
        if (page <= 1) return;
        const np = page - 1;
        setPage(np);
        fetchPosts({ page: np });
    };
    const handleNext = () => {
        const maxPage = Math.max(1, Math.ceil((total ?? 0) / size));
        if (page >= maxPage) return;
        const np = page + 1;
        setPage(np);
        fetchPosts({ page: np });
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            <div className="p-4 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">게시물관리</h1>
                        <div className="text-sm text-gray-500">전체: {total ?? '-' }건</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full max-w-4xl">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="w-36 px-3 py-2 border rounded"
                        >
                            <option value="postNo">게시물번호</option>
                            <option value="userNo">사용자번호</option>
                        </select>

                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`${searchType === 'postNo' ? '게시물번호' : '사용자번호'} 검색`}
                            className="flex-1 min-w-0 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border rounded"
                            aria-label="시작일자"
                        />
                        <div className="px-1">~</div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border rounded"
                            aria-label="종료일자"
                        />

                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36 px-3 py-2 border rounded">
                            <option value="ALL">전체상태</option>
                            <option value="PUBLISHED">게시됨</option>
                            <option value="DRAFT">임시저장</option>
                            <option value="DELETED">삭제</option>
                        </select>

                        <button onClick={handleSearchClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">검색</button>
                        <button onClick={handleReset} className="px-3 py-2 border rounded text-sm">초기화</button>
                    </div>
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">{loading ? '로딩 중...' : error ? error : `검색결과: ${posts.length}건`}</div>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrev} disabled={page <= 1} className="px-2 py-1 border rounded">이전</button>
                            <span className="text-sm"> {page} </span>
                            <button onClick={handleNext} disabled={total !== null && page >= Math.ceil(total / size)} className="px-2 py-1 border rounded">다음</button>
                            <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); fetchPosts({ page: 1, size: Number(e.target.value) }); }} className="ml-2 px-2 py-1 border rounded">
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
                        <table className="min-w-full table-fixed border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b">게시물번호</th>
                                <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b">사용자번호</th>
                                <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b">시작일자</th>
                                <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b">종료일자</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b">게시물상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {posts.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">표시할 게시물이 없습니다.</td>
                                </tr>
                            ) : (
                                posts.map((p) => (
                                    <tr key={getPostKey(p)} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm border-b">{p.postNo ?? p.id ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{p.userNo ?? p.userId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{formatDate(p.startDate) ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{formatDate(p.endDate) ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{p.status ?? '-'}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getPostKey(p) {
    return p.postNo ?? p.id ?? p._id ?? `${p.userNo ?? p.userId}-${Math.random().toString(36).slice(2,9)}`;
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