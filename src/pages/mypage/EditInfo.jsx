import React, { useState, useEffect } from 'react';
import UserProfile from './my_page_component/UserProfile';
import useUser from "../../lib/useUser";
import { toast } from "react-toastify";
import {editUser} from "../../api/user_api";
import { useTranslation } from 'react-i18next';


const AccountManagement = () => {

    const { t } = useTranslation();


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

    const { user } = useUser();

    const FEMALE = "FEMALE";
    const MALE = "MALE";

    const handleEditNickname = async () => {
        if (!formData.nickname) {
            toast.warn(t('account_management_nickname_input_warning'));
            return;
        }
        try {
            const res = await editUser(user.userSeq, formData.nickname);
            console.log("✅ 닉네임 수정 성공:", res);

            setFormData({nickname: ""});
            toast.success(t('account_management_nickname_success_toast'));

            window.location.reload();
        } catch (err) {
            console.error("❌ 닉네임 수정 실패:", err);
            toast.error(t('account_management_nickname_fail_toast'));
        }
    };

    useEffect(() => {
        if (user?.nickname) {
            setFormData({ nickname: user.nickname });
        }
    }, [user]);

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
                            src={user?.role === "CREATOR" ? "/assets/pig.png" : "/assets/bull.png"}
                            alt={user?.role === "CREATOR" ? t("header_creator_icon_alt") : t("header_investor_icon_alt")}
                            className="object-cover rounded-full shadow-lg"
                            style={{ width: '120px', height: '120px' }}
                        />

                        {/* Nickname Display */}
                        <div className="text-xl font-bold text-gray-800">
                            {user?.nickname}
                        </div>

                        {/* Form Fields */}
                        <div className="w-full space-y-6 mt-8">
                            {/* Email Display (Read-only) */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {t('account_management_email_label')}
                                    </label>
                                    <span className="text-red-500 text-xs">{t('account_management_uneditable_text')}</span>
                                </div>
                                <input
                                    type="text"
                                    value={user?.email ?? ""}
                                    readOnly
                                    className="px-1 w-full py-2 border-b border-gray-300 bg-gray-100 text-gray-900 cursor-not-allowed"
                                />
                            </div>

                            {/* Nickname Input (Only editable field) */}
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('account_management_nickname_label')}
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        name="nickname"
                                        value={formData.nickname ?? ""}
                                        onChange={handleInputChange}
                                        className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 bg-transparent"
                                        placeholder={t('account_management_nickname_placeholder')}
                                    />
                                    <button
                                        onClick={handleEditNickname}
                                        className="bg-red-500 hover:bg-red-600 rounded-xl text-amber-50 text-[10px] h-8 w-16">수정하기</button>
                                </div>
                            </div>

                            {/* Gender Display (Read-only) */}
                            <div>
                                <div className="flex space-x-4">
                                    {/* 남성 */}
                                    <div
                                        className={`flex-1 py-2 px-4 border rounded text-center cursor-not-allowed ${user?.gender === MALE
                                            ? "border-gray-300 bg-gray-50 text-gray-700"
                                            : "border-gray-200 bg-white text-gray-400"
                                        }`}
                                    >
                                        {t('account_management_gender_male')}
                                    </div>

                                    {/* 여성 */}
                                    <div className={`flex-1 py-2 px-4 border rounded text-center cursor-not-allowed ${user?.gender === FEMALE 
                                        ? "border-gray-300 bg-gray-50 text-gray-700"
                                        : "border-gray-200 bg-white text-gray-400"
                                    }`}
                                    >
                                        {t('account_management_gender_female')}
                                    </div>
                                </div>
                            </div>


                            {/* Birth Date Display (Read-only) */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('account_management_birthdate_label')}
                                    </label>
                                    <span className="text-red-500 text-xs">{t('account_management_uneditable_text')}</span>
                                </div>
                                <input
                                    type="text"
                                    value={user?.birthDate ?? ""}
                                    readOnly
                                    className="px-1 w-full py-2 border-b border-gray-300 bg-gray-100 text-gray-900 cursor-not-allowed">

                                </input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;
