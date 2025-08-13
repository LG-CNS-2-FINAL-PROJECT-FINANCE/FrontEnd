import React, { useState } from 'react';
import UserProfile from './MyPageComponent/UserProfile';

const AccountManagement = () => {
    const [formData, setFormData] = useState({
        nickname: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>

            {/* Left side - Sticky Bull image area (same as MyPage) */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>

            {/* Right side - Account Management Form */}
            <div className="flex-1 bg-white p-6 flex justify-center">
                {/* Account Management Rectangle */}
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
                        <div className="w-full space-y-6 mt-8">
                            {/* Email Display (Read-only) */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        이메일
                                    </label>
                                    <span className="text-red-500 text-xs">수정불가</span>
                                </div>
                                <div className="w-full py-2 text-gray-900 border-b border-gray-300">
                                    user@example.com
                                </div>
                            </div>

                            {/* Nickname Input (Only editable field) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    닉네임
                                </label>
                                <input
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 bg-transparent"
                                    placeholder="닉네임을 입력하세요"
                                />
                            </div>

                            {/* Gender Display (Read-only) */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        성별
                                    </label>
                                    <span className="text-red-500 text-xs">수정불가</span>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1 py-2 px-4 border border-gray-300 rounded text-center bg-gray-50 text-gray-700">
                                        남성
                                    </div>
                                    <div className="flex-1 py-2 px-4 border border-gray-300 rounded text-center bg-white text-gray-400">
                                        여성
                                    </div>
                                </div>
                            </div>


                            {/* Birth Date Display (Read-only) */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        생년월일
                                    </label>
                                    <span className="text-red-500 text-xs">수정불가</span>
                                </div>
                                <div className="w-full py-2 text-gray-900 border-b border-gray-300">
                                    1990-01-01
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;
