import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../../api/admin_api";
import { AuthContext } from '../../../context/AuthContext';
import UserSettingModal from './UserSettingModal';

export default function UserManagement() {
    const { accessToken, logout, user: authUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('email');
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState(null);

    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const debounceRef = useRef(null);
    const abortRef = useRef(null);

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
            setLoading(false);
            return;
        }

        console.log('fetchUsers called, accessToken=', accessToken);

        setLoading(true);
        setError('');
        try {
            const params = {};
            if (q) {
                params.type = searchType;
                params.q = q;
            }

            const res = await api.get('/user/list', {
                params,
                signal: abortRef.current?.signal,
            });

            const payload = res.data;
            const list = parseResponseToList(payload);
            setUsers(list);
            setTotal(payload.total ?? list.length);
        } catch (e) {
            if (e.name === 'CanceledError' || e?.message === 'canceled') {
                return;
            }

            console.error('fetchUsers error', e);

            const status = e?.response?.status;
            if (status === 401 || status === 403) {
                if (logout) { await logout(); }
                navigate('/admin/login');
                return;
            }

            setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            setUsers([]);
            setTotal(null);
            setLoading(false);
            return;
        }
        fetchUsers();
        return () => {
            if (abortRef.current) {
                try { abortRef.current.abort(); } catch (e) {}
            }
        };
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers(query.trim());
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, searchType, accessToken]);

    const handleSearchClick = () => {
        fetchUsers(query.trim());
    };

    const handleReset = () => {
        setQuery('');
        setSearchType('email'); // 검색 타입도 초기화
        fetchUsers(''); // 모든 쿼리 파라미터 초기화
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsSettingModalOpen(true);
    };

    const handleModalClose = () => {
        setIsSettingModalOpen(false);
        setSelectedUser(null);
    };

    const handleUserStatusChange = (userId, newStatus) => {
        fetchUsers(query.trim());
        handleModalClose();
    };

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

                        <button onClick={handleSearchClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">검색</button>
                        <button onClick={handleReset} className="px-3 py-2 border rounded text-sm">초기화</button> {/* 초기화 버튼 추가 */}
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
                            <thead className="bg-red-500 sticky top-0 z-10">
                            <tr>
                                <th className="w-24 px-4 py-2 text-left text-sm font-medium border-b text-white">사용자번호</th>
                                <th className="w-64 px-4 py-2 text-left text-sm font-medium border-b text-white">이메일</th>
                                <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b text-white">닉네임</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">역할</th>
                                <th className="w-20 px-4 py-2 text-left text-sm font-medium border-b text-white">나이</th>
                                <th className="w-20 px-4 py-2 text-left text-sm font-medium border-b text-white">성별</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b text-white">마지막 접속일자</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">사용자상태</th>
                                {/* <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">상태</th> // 이 컬럼은 현재 데이터를 알 수 없어 주석처리 */}
                            </tr>
                            </thead>

                            <tbody>
                            {users.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="8" className="p-6 text-center text-gray-500">표시할 사용자가 없습니다.</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.userSeq ?? u.id} onClick={() => handleRowClick(u)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-4 py-3 text-sm border-b">{u.userSeq ?? u.id ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b break-words">{u.email ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.nickname ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.role ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.age ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.gender ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.latestAt ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{u.status ?? '-'}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isSettingModalOpen && selectedUser && (
                <UserSettingModal
                    open={isSettingModalOpen}
                    onClose={handleModalClose}
                    user={selectedUser}
                    onStatusChange={handleUserStatusChange}
                    adminId={authUser?.id || authUser?.userSeq}
                />
            )}
        </div>
    );
}


function getUserKey(u) {
    return u.userSeq ?? u.id ?? u._id ?? `${u.email}-${u.nickname}`;
}
