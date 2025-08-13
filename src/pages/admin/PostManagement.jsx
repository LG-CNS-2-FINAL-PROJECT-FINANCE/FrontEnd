/*
// src/pages/admin/PostManagement.jsx
import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axiosInstance'; // 경로는 프로젝트 구조에 맞춰 조정하세요
import dayjs from 'dayjs';

export default function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [searchType, setSearchType] = useState('postNo'); // 'postNo' | 'userNo'
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('ALL'); // ALL, PUBLISHED, DRAFT, DELETED 등

    const debounceRef = useRef(null);

    const parseResponseToList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.posts) return data.posts;
        if (data.data && Array.isArray(data.data)) return data.data;
        return [];
    };

    const fetchPosts = async (opts = {}) => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            const q = opts.q ?? query.trim();
            const st = opts.startDate ?? startDate;
            const ed = opts.endDate ?? endDate;
            const stt = opts.status ?? status;
            const type = opts.type ?? searchType;

            if (q) {
                params.type = type; // 서버가 type/q 형태를 기대하면 이대로, 아니면 키 맞춤
                params.q = q;
            }
            if (st) params.startDate = st;
            if (ed) params.endDate = ed;
            if (stt && stt !== 'ALL') params.status = stt;

            // 실제 백엔드 엔드포인트가 다르면 '/admin/posts' 등으로 변경하세요
            const res = await api.get('/posts', { params });
            const payload = res.data;
            const list = parseResponseToList(payload);
            setPosts(list);
            setTotal(payload.total ?? list.length);
        } catch (e) {
            console.error('fetchPosts error', e);
            setError('게시물 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 마운트 시 초기 로드
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색어 디바운스
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchPosts({ q: query.trim() });
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, searchType]);

    const handleSearchClick = () => {
        fetchPosts({ q: query.trim(), startDate, endDate, status, type: searchType });
    };

    const handleReset = () => {
        setQuery('');
        setStartDate('');
        setEndDate('');
        setStatus('ALL');
        fetchPosts({ q: '', startDate: '', endDate: '', status: 'ALL' });
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            {/!* 상단 검색영역 *!/}
            <div className="p-4 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">게시물관리</h1>
                        <div className="text-sm text-gray-500">전체: {total ?? '-' }건</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-3xl">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="postNo">게시물번호</option>
                            <option value="userNo">사용자번호</option>
                        </select>

                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`${searchType === 'postNo' ? '게시물번호' : '사용자번호'} 검색`}
                            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border rounded"
                            aria-label="시작일자"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border rounded"
                            aria-label="종료일자"
                        />

                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded">
                            <option value="ALL">전체상태</option>
                            <option value="PUBLISHED">게시됨</option>
                            <option value="DRAFT">임시저장</option>
                            <option value="DELETED">삭제</option>
                            {/!* 서버 상태값에 맞춰 옵션 추가/수정 *!/}
                        </select>

                        <button onClick={handleSearchClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">검색</button>
                        <button onClick={handleReset} className="px-3 py-2 border rounded text-sm">초기화</button>
                    </div>
                </div>
            </div>

            {/!* 테이블 영역 *!/}
            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">{loading ? '로딩 중...' : error ? error : `검색결과: ${posts.length}건`}</div>
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

// ----------------- 유틸 -----------------
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
*/
