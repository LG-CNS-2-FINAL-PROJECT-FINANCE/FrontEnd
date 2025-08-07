import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function Header() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState('투자자'); // 기본 역할을 '투자자'로 초기화

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        //decodedToken에 role 정보가 있을 경우 사용하고, 없으면 기본값으로 '투자자' 설정
        setUserRole(decodedToken.role || '투자자');
        setIsLogin(true); // 토큰이 유효하게 디코딩되면 로그인 상태로 설정
      } catch (error) {
        console.error("JWT 토큰 디코딩 오류:", error);
        setIsLogin(false); // 토큰 디코딩 실패 시 로그인 상태 아님
        localStorage.removeItem('jwtToken');
      }
    } else {
      setIsLogin(false); // 토큰이 없으면 로그인 상태 아님
    }
  }, []);

  //테스트를 위한 임시 함수
  const toggleLoginStatus = () => {
    if (isLogin) {
      localStorage.removeItem('jwtToken');
      setIsLogin(false);
      setUserRole('투자자');
    } else {
      const testToken = JSON.stringify({ role: '투자자' }); // 이 부분은 실제 JWT 토큰 형식이 아님을 명심해주세요.
      localStorage.setItem('jwtToken', testToken);
      setIsLogin(true);
      setUserRole('투자자'); //임시 로그인 시 역할 설정
    }
  };

  const handleRoleToggle = () => {
    setUserRole(prevRole => (prevRole === '투자자' ? '창작자' : '투자자'));
  };

  return (
      <div
          className="flex justify-between items-center w-full bg-white py-2 px-[10%]"
      >
        <div className="flex items-center space-x-6">
          <div>
            <img
                src="/assets/logo.png"
                alt="로고"
                className="w-20 h-10 min-h-1 min-w-1 hover:cursor-pointer"
                onClick={() => navigate("/")}
            />
          </div>
          <div>
          <span
              className="hover:cursor-pointer"
              onClick={() => navigate("/asset")}
          >
            자산 조회
          </span>
          </div>
          <div>
          <span
              className="hover:cursor-pointer"
              onClick={() => navigate("/investment")}
          >
            투자 상품
          </span>
          </div>
          <div>
          <span
              className="hover:cursor-pointer"
              onClick={() => navigate("/market")}
          >
            토큰 거래
          </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* 로그인 상태에 따른 버튼 표시 */}
          {!isLogin ? (
              <button
                  className="bg-red-500 px-5 py-3 rounded-full text-amber-50"
                  onClick={() => navigate("/login/1")}
              >
                로그인
              </button>
          ) : (
              <div>
                <button
                    className={userRole === '투자자' ? "bg-red-500 px-5 py-3 rounded-full text-amber-50" : "bg-blue-600 px-5 py-3 rounded-full text-amber-50"}
                    onClick={handleRoleToggle}
                >
                  {userRole}
                </button>
              </div>
          )}

          {!isLogin ? (
              <div>
                <FaUser className="w-10 h-10 hover:cursor-pointer" onClick={() => navigate("/login/1")} />
              </div>
          ) : (
              <div>
                <img
                    src={userRole === '투자자' ? "/assets/bull.png" : "/assets/pig.png"} // 예시: 역할에 따라 다른 아이콘
                    alt={`${userRole} 아이콘`}
                    className="w-12 h-12 hover:cursor-pointer"
                    onClick={() => navigate("/my-profile")} // 사용자 프로필 페이지로 이동
                />
              </div>
          )}

          {/*테스트용 버튼 나중에 삭제할거임*/}
          <button
              className="bg-gray-400 px-5 py-3 rounded-full text-white"
              onClick={toggleLoginStatus}
          >
            {isLogin ? '로그아웃 (테스트)' : '로그인 (테스트)'}
          </button>
        </div>
      </div>
  );
}

export default Header;