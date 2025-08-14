import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import api from "../../../api/loginaxiosInstance";


export default function AdminLogin() {
    const { setTokens, setUser } = useContext(AuthContext);
    const [adminId, setAdminId] = useState('');
    const [pw, setPw] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErr('');

        if (!adminId.trim() || !pw) {
            setErr('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post(
                '/user/auth/admin/login',
                { adminId: adminId.trim(), password: pw },
                { withCredentials: true } // 서버가 쿠키를 쓴다면 true로
            );

            console.log('response status:', res.status);
            console.log('response headers:', res.headers);
            console.log('response data:', res.data);

            // 응답 데이터/헤더에서 토큰 추출 (안전하게 여러 케이스 처리)
            const data = res.data;
            let accessToken = null;
            let refreshToken = null;
            let user = null;

            // 바디에 토큰이 있으면 우선 사용
            if (data && typeof data === 'object') {
                accessToken = data.accessToken || data.access_token || data.token || null;
                refreshToken = data.refreshToken || data.refresh_token || null;
                user = data.user || data.data?.user || null;
            }

            // 바디에 없으면 Authorization 헤더에서 추출
            if (!accessToken && res.headers) {
                const authHeader = res.headers['authorization'] || res.headers?.Authorization;
                if (authHeader) {
                    accessToken = authHeader.replace(/^Bearer\s+/i, '');
                }
            }

            console.log('extracted accessToken:', accessToken);

            const finalAccess = accessToken; // 바디나 헤더에서 추출한 값
            const finalRefresh = refreshToken; // 바디에서 추출한 경우

            if (typeof setTokens === 'function') {
                setTokens(finalAccess, finalRefresh);
            } else {
                console.log('직접 저장합니다.')
                if (finalAccess) {
                    localStorage.setItem('ACCESS_TOKEN', finalAccess);
                    api.defaults.headers.common['Authorization'] = `Bearer ${finalAccess}`;
                }
                if (finalRefresh) {
                    localStorage.setItem('REFRESH_TOKEN', finalRefresh);
                }
            }

// 사용자 상태 업데이트
            if (setUser && user) setUser(user);

            // 상태 업데이트
            /*if (accessToken && setAccessToken) setAccessToken(accessToken);
            if (setRefreshToken && refreshToken) setRefreshToken(refreshToken);
            if (setUser && (user || (typeof data === 'string' ? null : data.user))) setUser(user);

            // 전역 axios 기본 헤더에도 넣어두면 이후 요청에 자동 포함
            if (accessToken) {
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            }*/

            // 성공 처리
            navigate('/admin/user');
        } catch (error) {
            console.error(error);
            const msg = error?.response?.data?.message;
            if (msg) setErr(msg);
            else if (error?.response?.status === 401) setErr('아이디 또는 비밀번호가 올바르지 않습니다.');
            else setErr('로그인 중 오류가 발생했습니다. 네트워크 상태를 확인하세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form
                onSubmit={submit}
                className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md"
                aria-label="관리자 로그인 폼"
            >
                <div className="flex flex-col items-center mb-8">
                    {/*<h2 className="text-2xl font-bold">관리자 로그인</h2>*/}
                    <img src="/assets/adminlogo.png" alt="어드민로고" className="w-96 h-52 mb-4" />
                </div>

                {err && <div className="mb-4 text-red-600 text-sm">{err}</div>}

                <label className="block mb-2 text-sm font-medium text-gray-700">아이디</label>
                <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="관리자 아이디"
                    autoComplete="username"
                    required
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">비밀번호</label>
                <div className="relative mb-4">
                    <input
                        type={showPw ? 'text' : 'password'}
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="w-full px-3 py-2 border rounded pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="비밀번호"
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                        aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                    >
                        {showPw ? '숨기기' : '보기'}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-700'}`}
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>

                <div className="mt-4 text-sm text-gray-500 text-center">
                    아이디/비밀번호를 분실하면 관리자에게 문의하세요.
                    <div>
                        010-0000-0000
                    </div>
                </div>
            </form>
        </div>
    );
}