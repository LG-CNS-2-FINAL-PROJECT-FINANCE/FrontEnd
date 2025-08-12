import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

function AdminHeader(){
    const navigate = useNavigate();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const TOKEN_KEY = 'JWT_TOKEN';

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setIsAdminLoggedIn(false);
            return;
        }

        try {
            setIsAdminLoggedIn(true);

        } catch (err) {
            console.error('토큰 검사 오류:', err);
            setIsAdminLoggedIn(false);
            localStorage.removeItem(TOKEN_KEY);
        }
    }, []);

    const handleLogoClick = () => {
        if (isAdminLoggedIn) {
            navigate('/admin/user');
        } else {
            navigate('/admin/login');
        }
    };


    return(
        <div className="flex justify-between items-center w-full bg-white py-2 px-[3%] shadow-lg">
            <div className="flex items-center space-x-6">
                <div className="">
                    <img
                        src="/assets/adminlogo.png"
                        alt="로고"
                        className="w-28 h-15 min-h-1 min-w-1 hover:cursor-pointer"
                        onClick={handleLogoClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminHeader;