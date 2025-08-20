import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import useUser from "../../lib/useUser";
import { useTheme } from "../../context/ThemeContext";

// import { jwtDecode } from "jwt-decode";

function Header() {
  const navigate = useNavigate();
  const { userLoading, user, isLoggedIn } = useUser();
  const { role: themeRole, themeColors } = useTheme();

  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(token); // 임시 JSON.stringify로 저장된 토큰이므로 JSON.parse 사용
        const roleFromToken = decodedToken.role || "";
        setUserRole(roleFromToken);
        setIsLogin(true);

        // 테스트를 위해 주석 처리
        // if (isLogin && !roleFromToken) {
        //     navigate('/select-role');
        // }
      } catch (error) {
        console.error("토큰 디코딩/파싱 오류:", error);
        setIsLogin(false);
        setUserRole("");
        localStorage.removeItem("jwtToken");
        // navigate('/login/1');
      }
    } else {
      setIsLogin(false);
      setUserRole("");
      // navigate('/login/1');
    }
  }, [isLogin, navigate, themeRole]); // themeRole을 dependency에 추가

  // 테스트를 위한 임시 로그인/로그아웃
  const toggleLoginStatus = () => {
    if (isLogin) {
      localStorage.removeItem("jwtToken");
      setIsLogin(false);
      setUserRole(""); // 로그아웃 시 역할 초기화
      navigate("/login/1");
    } else {
      localStorage.setItem("jwtToken", JSON.stringify({}));
      setIsLogin(true);
      navigate("/select-role");
    }
  };

  // 역할 선택 페이지로 이동
  const handleRoleSelectionRedirect = () => {
    navigate("/select-role");
  };

  return (
    <div className="flex justify-between items-center w-full bg-white py-2 px-[10%]">
      <div className="flex items-center space-x-6">
        <div>
          <img
            src="/assets/logo.png"
            alt="로고"
            className="w-20 h-10 min-h-1 min-w-1 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <>
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
        </>
      </div>
      <div className="flex items-center space-x-4">
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
              className={
                userRole === "투자자"
                  ? "bg-red-500 px-5 py-3 rounded-full text-amber-50"
                  : userRole === "창작자"
                  ? "bg-blue-600 px-5 py-3 rounded-full text-amber-50"
                  : "bg-gray-400 px-5 py-3 rounded-full text-gray-700 hover:bg-gray-500"
              }
              onClick={handleRoleSelectionRedirect}
            >
              {userRole || "역할 선택"}
            </button>
          </div>
        )}

        {!isLogin ? (
          <div>
            <FaUser
              className="w-10 h-10 hover:cursor-pointer"
              onClick={() => navigate("/login/1")}
            />
          </div>
        ) : (
          <div>
            {userRole === "투자자" ? (
              <img
                src="/assets/bull.png"
                alt="투자자 아이콘"
                className="w-12 h-12 hover:cursor-pointer"
                onClick={() => navigate("/my-profile")}
              />
            ) : userRole === "창작자" ? (
              <img
                src="/assets/pig.png"
                alt="창작자 아이콘"
                className="w-12 h-12 hover:cursor-pointer"
                onClick={() => navigate("/my-profile")}
              />
            ) : (
              <FaUser
                className="w-12 h-12 hover:cursor-pointer"
                onClick={() => navigate("/my-profile")}
              />
            )}
          </div>
        )}
        {/* 로그인 테스트용 버튼 */}
        <button
          className="bg-gray-400 px-5 py-3 rounded-full text-white"
          onClick={toggleLoginStatus}
        >
          {isLogin ? "로그아웃 (테스트)" : "로그인 (테스트)"}
        </button>
              <>
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
                    onClick={() => {
                      if (themeRole === '창작자' || userRole === '창작자') {
                        navigate("/product-registration");
                      } else {
                        navigate("/market");
                      }
                    }}
                >
                  {themeRole === '창작자' || userRole === '창작자' ? '상품 등록' : '토큰 거래'}
                </span>
                </div>
              </>
        </div>
        <div className="flex items-center space-x-4">
          {!isLogin ? (
              <button
                  className={`${themeColors.primaryBg} px-5 py-3 rounded-full text-amber-50`}
                  onClick={() => navigate("/login/1")}
              >
                로그인
              </button>
          ) : (
              <div>
                <button
                    className={
                      userRole === '투자자' ? `${themeColors.primaryBg} px-5 py-3 rounded-full text-amber-50` :
                          userRole === '창작자' ? `${themeColors.primaryBg} px-5 py-3 rounded-full text-amber-50` :
                              "bg-gray-400 px-5 py-3 rounded-full text-gray-700 hover:bg-gray-500"
                    }
                    onClick={handleRoleSelectionRedirect}
                >
                  {userRole || '역할 선택'}
                </button>
              </div>
          )}

          {!isLogin ? (
              <div>
                <FaUser className="w-10 h-10 hover:cursor-pointer" onClick={() => navigate("/login/1")} />
              </div>
          ) : (
              <div>
                {userRole === '투자자' ? (
                    <img
                        src="/assets/bull.png"
                        alt="투자자 아이콘"
                        className="w-12 h-12 hover:cursor-pointer"
                        onClick={() => navigate("/my-profile")}
                    />
                ) : userRole === '창작자' ? (
                    <img
                        src="/assets/pig.png"
                        alt="창작자 아이콘"
                        className="w-12 h-12 hover:cursor-pointer"
                        onClick={() => navigate("/my-profile")}
                    />
                ) : (
                    <FaUser className="w-12 h-12 hover:cursor-pointer" onClick={() => navigate("/my-profile")} />
                )}
              </div>
          )}

          {/* 로그인 테스트용 버튼 */}
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
