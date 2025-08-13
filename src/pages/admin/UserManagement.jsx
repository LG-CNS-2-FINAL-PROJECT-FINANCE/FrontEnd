import React, { useEffect, useState, useRef } from 'react';
import api from "../../api/loginaxiosInstance";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('email');
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState(null);

    const debounceRef = useRef(null);

    const fetchUsers = async (q = '') => {
        setLoading(true);
        setError('');
        try {
            // 예: 서버가 ?type=email&q=foo 형태를 받는다고 가정
            const params = {};
            if (q) {
                params.type = searchType;
                params.q = q;
            }
            const res = await api.get('/user/auth', { params });
            // 서버 응답 형태에 맞게 parsing 필요
            // { data: { users: [...], total: 123 } } 또는 res.data가 배열일 수 있음
            const payload = res.data;
            if (Array.isArray(payload)) {
                setUsers(payload);
                setTotal(payload.length);
            } else if (payload && payload.user) {
                setUsers(payload.user);
                setTotal(payload.total ?? payload.user.length);
            } else {
                // 만약 서버가 단순 리스트가 아닌 다른 구조라면 여기를 조정하세요
                setUsers([]);
                setTotal(0);
            }
        } catch (e) {
            console.error(e);
            setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 초기 조회x`
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색 입력 디바운스 처리
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers(query.trim());
        }, 400); // 400ms 디바운스
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, searchType]);

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            <div className="p-4 bg-white shadow-sm">
                <h1 className="text-xl font-semibold mb-3">사용자관리</h1>

                <div className="flex items-center gap-3">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="px-3 py-2 border rounded"
                        aria-label="검색 타입 선택"
                    >
                        <option value="email">이메일</option>
                        <option value="nickname">닉네임</option>
                    </select>

                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`${searchType === 'email' ? '이메일' : '닉네임'}으로 검색`}
                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label="사용자 검색창"
                    />

                    <button
                        onClick={() => fetchUsers(query.trim())}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        aria-label="검색 실행"
                    >
                        검색
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            전체: {total ?? '-'}명
                        </div>
                        <div className="text-sm text-gray-500">
                            {loading ? '로딩 중...' : error ? error : ''}
                        </div>
                    </div>

                    {/* 스크롤 가능한 테이블 래퍼 */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        <table className="min-w-full table-fixed border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="w-24 px-4 py-2 text-left text-sm font-medium border-b">사용자번호</th>
                                <th className="w-64 px-4 py-2 text-left text-sm font-medium border-b">이메일</th>
                                <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b">닉네임</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b">역할</th>
                                <th className="w-20 px-4 py-2 text-left text-sm font-medium border-b">나이</th>
                                <th className="w-20 px-4 py-2 text-left text-sm font-medium border-b">성별</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b">마지막 접속일자</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b">사용자상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="8" className="p-6 text-center text-gray-500">표시할 사용자가 없습니다.</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id ?? u.userNo ?? `${u.email}-${u.nickname}`} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm border-b">{u.userNo ?? u.id ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b break-words">{u.email ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.nickname ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.role ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.age ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.gender ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.lastLogin ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.status ?? '-'}</td>
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