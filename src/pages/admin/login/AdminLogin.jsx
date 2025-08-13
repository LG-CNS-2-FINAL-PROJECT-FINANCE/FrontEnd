import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import api from "../../../api/axiosInstance";


export default function AdminLogin() {
    const { setAccessToken, setRefreshToken, setUser } = useContext(AuthContext);
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
                // { withCredentials: true } // 서버가 refresh token 쿠키를 사용할 경우 필요
            );

            const { accessToken, refreshToken, user } = res.data || {};

            if (!accessToken) {
                setErr('서버 응답이 올바르지 않습니다.');
                setLoading(false);
                return;
            }

            if (setAccessToken) setAccessToken(accessToken);
            if (setRefreshToken && refreshToken) setRefreshToken(refreshToken);
            if (setUser && user) setUser(user);

            // 로그인 성공 후 관리자 메인으로 이동
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