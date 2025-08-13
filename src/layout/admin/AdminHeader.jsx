import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../component/Button";

function AdminHeader(){
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleLogoClick = () => {
        if (user) navigate('/admin/user');
        else navigate('/admin/login');
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