import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { LuUserRound } from "react-icons/lu";
import useUser from "../../lib/useUser";
import { useTheme } from "../../context/ThemeContext";

function Header() {
  const navigate = useNavigate();
  const { userLoading, user, isLoggedIn } = useUser();
  const { role: themeRole, themeColors } = useTheme();

  const [userRole, setUserRole] = useState(isLoggedIn ? user?.role : "");
  // 사용자/로그인 상태 변경 시 동기화
  useEffect(() => {
    setUserRole(isLoggedIn ? user?.role ?? "" : "");
  }, [isLoggedIn, user?.role]);
  const roleLabel =
    userRole === "CREATOR" ? "창작자" : userRole === "USER" ? "투자자" : "";

  // 테스트를 위한 임시 로그인/로그아웃
  const toggleLoginStatus = () => {
    if (isLoggedIn) {
      setUserRole(""); // 로그아웃 시 역할 초기화
      navigate("/login/1");
    } else {
      setUserRole("USER");
      navigate("/select-role");
    }
  };

  // 역할 선택 페이지로 이동
  const handleRoleSelectionRedirect = () => {
    navigate("/select-role");
  };

  return (
    <div className="flex justify-between items-center w-full bg-white py-2 px-[10%]">
      <div className="flex items-end space-x-8">
        <div>
          <img
            src="/assets/logo.png"
            alt="로고"
            className="w-20 h-10 min-h-1 min-w-1 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <>
          <div className="flex">
            <span
              className="hover:cursor-pointer font-bold"
              onClick={() => navigate("/asset")}
            >
              자산 조회
            </span>
          </div>
          <div>
            <span
              className="hover:cursor-pointer font-bold"
              onClick={() => navigate("/investment")}
            >
              투자 상품
            </span>
          </div>
          <div>
            <span
              className="hover:cursor-pointer font-bold"
              onClick={() => navigate("/market")}
            >
              토큰 거래
            </span>
          </div>
        </>
      </div>
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <></>
        ) : (
          <div>
            <button
              className={
                userRole === "USER"
                  ? "bg-red-500 px-3 py-2 rounded-xl text-amber-50 hover:bg-red-700"
                  : userRole === "CREATOR"
                  ? "bg-blue-500 px-3 py-2 rounded-xl text-amber-50 hover:bg-blue-700"
                  : "bg-gray-400 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-500"
              }
              onClick={handleRoleSelectionRedirect}
            >
              {roleLabel || "역할 선택"}
            </button>
          </div>
        )}

        {userLoading ? (
          // ✅ 로딩 중일 때
          <div className="flex items-center justify-center w-12 h-12">
            <span className="text-sm text-gray-400 animate-pulse">
              Loading...
            </span>
          </div>
        ) : !isLoggedIn ? (
          // ✅ 로그인 안 한 사용자
          <div
            className="group flex items-center rounded-full border-1 border-gray-300 p-1 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/login/1")}
          >
            <LuUserRound
              className="w-10 h-10 text-gray-400 group-hover:text-red-500 transition-colors"
              aria-label="로그인"
            />
          </div>
        ) : (
          // ✅ 로그인 한 사용자
          <div>
            {userRole === "USER" ? (
              <img
                src="/assets/bull.png"
                alt="투자자 아이콘"
                className="w-12 h-12 hover:cursor-pointer"
                onClick={() => navigate("/my-profile")}
              />
            ) : userRole === "CREATOR" ? (
              <img
                src="/assets/pig.png"
                alt="창작자 아이콘"
                className="w-12 h-12 hover:cursor-pointer"
                onClick={() => navigate("/my-profile")}
              />
            ) : (
              <LuUserRound
                className="w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                onClick={() => navigate("/login/1")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
