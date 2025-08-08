import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelectionPage() {
    const navigate = useNavigate();
    const [currentRole, setCurrentRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decodedToken = JSON.parse(token);
                if (decodedToken.role) {
                    setCurrentRole(decodedToken.role);
                }
            } catch (error) {
                console.error("토큰 디코딩/파싱 오류:", error);
                localStorage.removeItem('jwtToken');
                setCurrentRole('');
            }
        }
    }, []);

    const handleRoleSelect = (selectedRole) => {
        if (selectedRole === currentRole) {
            alert(`이미 ${selectedRole} 역할입니다.`);
            return;
        }

        let token = {};
        try {
            token = JSON.parse(localStorage.getItem('jwtToken')) || {};
        } catch (e) {
            console.error("Failed to parse token from localStorage", e);
        }

        token.role = selectedRole;
        localStorage.setItem('jwtToken', JSON.stringify(token));

        alert(`역할이 ${selectedRole}으로 변경되었습니다.`);
        setCurrentRole(selectedRole);

        if (selectedRole === '투자자') {
            navigate('/investment');
        } else if (selectedRole === '창작자') {
            navigate('/creation');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">역할 변경</h1>
                {currentRole ? (
                    <p className="text-gray-700 text-lg mb-2">
                        현재 역할: <span className="font-extrabold text-red-500">{currentRole}</span>
                    </p>
                ) : (
                    <p className="text-gray-700 text-lg mb-2">
                        역할을 선택해주세요.
                    </p>
                )}
                <p className="py-4">역할 변경은 오른쪽 상단에서 변경 가능합니다.</p>
                <div className="flex space-x-4">
                    {/* 투자자 버튼 */}
                    <button
                        onClick={() => handleRoleSelect('투자자')}
                        className={`w-full py-12 rounded-lg text-lg font-semibold transition-all duration-300 transform
                            ${currentRole === '투자자' ? 'text-gray-800 cursor-not-allowed bg-gray-100 shadow-inner' : 'text-gray-700 hover:scale-105 hover:shadow-lg hover:bg-gray-50'}
                            flex flex-col items-center justify-center space-y-6
                        `}
                        disabled={currentRole === '투자자'}
                    >
                        <img
                            src="/assets/bull.png"
                            alt="투자자 아이콘"
                            className="w-48 h-48 object-contain"
                        />
                        <span className="font-extrabold text-4xl mt-4">투자자</span>
                    </button>

                    {/* 창작자 버튼 */}
                    <button
                        onClick={() => handleRoleSelect('창작자')}
                        className={`w-full py-12 rounded-lg text-lg font-semibold transition-all duration-300 transform
                            ${currentRole === '창작자' ? 'text-gray-800 cursor-not-allowed bg-gray-100 shadow-inner' : 'text-gray-700 hover:scale-105 hover:shadow-lg hover:bg-gray-50'}
                            flex flex-col items-center justify-center space-y-6
                        `}
                        disabled={currentRole === '창작자'}
                    >
                        <img
                            src="/assets/pig.png"
                            alt="창작자 아이콘"
                            className="w-48 h-48 object-contain"
                        />
                        <span className="font-extrabold text-4xl mt-4">창작자</span>
                    </button>
                </div>

                {/*뒤로가기 버튼인데 일단 필요한지 필요 없는지 모르겠어서 일단 비활성화 해둠*/}
                {/*<button
                    onClick={() => navigate(-1)}
                    className="mt-6 text-gray-600 hover:text-gray-800 font-semibold"
                >
                    &larr; 뒤로 가기
                </button>*/}
            </div>
        </div>
    );
}

export default RoleSelectionPage;