import UserProfile from './MyPageComponent/UserProfile';
import { useNavigate } from 'react-router-dom';
import { MdReportGmailerrorred } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuUserPen } from "react-icons/lu";

const EditInfo = () => {
    const navigate = useNavigate();

    const handleEditInfo = () => {
        navigate('/edit-info');
    };

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>

            {/* Left side - Sticky Bull image area (same as MyPage) */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>

            {/* Right side - Edit Info Form */}
            <div className="flex-1 bg-white p-6 flex justify-center">
                {/* Edit Info Rectangle */}
                <div className="border border-gray-300 rounded-lg p-8 w-full max-w-md">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Bull Image */}
                        <img
                            src="/assets/bull.png"
                            alt="Bull"
                            className="object-cover rounded-full shadow-lg"
                            style={{ width: '120px', height: '120px' }}
                        />

                        {/* Nickname Display */}
                        <div className="text-xl font-bold text-gray-800">
                            Nickname
                        </div>

                        {/* Form Fields */}
                        <div className="w-full space-y-4 mt-8">
                            <div className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={handleEditInfo}>
                                회원 정보 수정 
                                <LuUserPen className="text-gray-600" size={20} />
                            </div>
                            <div className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center">
                                신고내역
                                <MdReportGmailerrorred className="text-gray-600" size={20} />
                            </div>
                            <div className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center">
                                로그아웃
                                <MdOutlineLogout className="text-gray-600" size={20} />
                            </div>
                            <div className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center">
                                회원탈퇴
                                <MdOutlineManageAccounts className="text-gray-600" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInfo;
