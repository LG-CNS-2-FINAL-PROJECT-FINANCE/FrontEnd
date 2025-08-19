import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/admin_api";
import { AuthContext } from '../../context/AuthContext';

export default function UserManagement() {
    const { accessToken, logout } = useContext(AuthContext); // accessToken 사용, logout 제공되면 에러시 호출
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('email');
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState(null);

    const debounceRef = useRef(null);
    const abortRef = useRef(null); // AbortController 보관

    const parseResponseToList = (payload) => {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (payload.users) return payload.users;
        if (payload.user) return payload.user;
        if (payload.data && Array.isArray(payload.data)) return payload.data;
        return [];
    };

    const fetchUsers = async (q = '') => {
        console.log('fetchUsers called, accessToken=', accessToken);
        const headers = { Authorization: `Bearer ${accessToken}` };
        console.log('request headers will be', headers);
        if (!accessToken) {
            setUsers([]);
            setTotal(0);
            return;
        }

        // 이전 요청 취소
        if (abortRef.current) {
            try { abortRef.current.abort(); } catch (e) { /* ignore */ }
        }
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError('');
        try {
            const params = {};
            if (q) {
                params.type = searchType;
                params.q = q;
            }

            // 안전하게 Authorization 헤더를 요청단에서 붙이는 방식
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const res = await api.get('/user', {
                params,
                signal: controller.signal,
                headers,
            });

            const payload = res.data;
            const list = parseResponseToList(payload);
            setUsers(list);
            setTotal(payload.total ?? list.length);
        } catch (e) {
            // 요청 취소는 무시
            if (e.name === 'CanceledError' || e?.message === 'canceled') {
                // 요청 취소됨
                return;
            }

            console.error('fetchUsers error', e);

            // 인증 관련 에러라면 logout 처리 또는 로그인 페이지로 이동
            const status = e?.response?.status;
            if (status === 401 || status === 403) {
                // 서버가 인증/권한 문제로 차단했을 때: 로그아웃 또는 로그인 페이지로 리다이렉트
                try {
                    logout && await logout();
                } catch (err) { /* ignore */ }
                navigate('/admin/login');
                return;
            }

            setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // accessToken 이 있을 때만 초기 조회
    useEffect(() => {
        if (!accessToken) {
            // 토큰 없으면 초기화
            setUsers([]);
            setTotal(null);
            return;
        }
        // 초기 로드
        fetchUsers();
        // cleanup: 컴포넌트 언마운트 시 요청 취소
        return () => {
            if (abortRef.current) {
                try { abortRef.current.abort(); } catch (e) {}
            }
        };
    }, [accessToken]);

    // 검색 디바운스 처리
    useEffect(() => {
        if (!accessToken) return; // 토큰 없으면 검색 금지
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers(query.trim());
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, searchType, accessToken]);

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            <div className="p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">사용자관리</h1>
                        <div className="text-sm text-gray-500">전체: {total ?? '-' }명</div>
                    </div>

                    <div className="flex items-center gap-3 w-full max-w-lg">
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="px-3 py-2 border rounded">
                            <option value="email">이메일</option>
                            <option value="nickname">닉네임</option>
                        </select>

                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`${searchType === 'email' ? '이메일' : '닉네임'}으로 검색`}
                            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <button onClick={() => fetchUsers(query.trim())} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">검색</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">{loading ? '로딩 중...' : error ? error : `검색결과: ${users.length}건`}</div>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
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
                                    <tr key={u.userNo ?? u.id ?? u._id ?? `${u.email}-${u.nickname}`} className="hover:bg-gray-50">
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