import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {AuthContext} from "../../../context/AuthContext";


export default function AdminSidebar() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            if (logout) await logout();
        } catch (e) {
            console.error('로그아웃 중 오류', e);
        } finally {
            navigate('/admin/login');
        }
    };

    const navItems = [
        { to: '/admin/user', label: '사용자관리' },
        { to: '/admin/reports', label: '신고관리' },
        { to: '/admin/systemMonitoring', label: '시스템모니터링' },
        { to: '/admin/posts', label: '게시물요청관리' },
        { to: '/admin/post', label: '게시물관리' },
        { to: '/admin/fraudDetection', label: '이상거래탐지' },
        // { to: '/admin/aml', label: '자금세탁방지' },
        { to: '/admin/settings', label: '설정' },
    ];

    const linkClass = ({ isActive }) =>
        `flex items-center px-4 py-2 rounded-md text-sm ${
            isActive ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <aside className="h-full w-64 bg-white border-r">
            {/*<div className="h-16 flex items-center justify-center border-b">*/}
            {/*    <img src="/assets/adminlogo.png" alt="관리자 로고" className="w-36 h-auto" />*/}
            {/*</div>*/}

            <nav className="p-4 space-y-1 overflow-y-auto">
                {navItems.map(item => (
                    <NavLink key={item.to} to={item.to} className={linkClass}>
                        <span className="ml-2">{item.label}</span>
                    </NavLink>
                ))}

                <div className="mt-6 border-t pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm text-gray-800"
                        aria-label="로그아웃"
                    >
                        로그아웃
                    </button>
                </div>
            </nav>
        </aside>
    );
}