import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuUserRound } from "react-icons/lu";
import useUser from "../../lib/useUser";
import { IoIosNotificationsOutline, IoMdClose } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";

// (선택) 알림 조회 API 예시 함수 (없으면 실제 api 로 교체)
async function fetchNotifications() {
  // const { data } = await api.get('/notifications');
  // return data;
  return [
    { id: 1, title: "주문 체결", body: "ABC 토큰 10개 체결되었습니다.", time: "2분 전" },
    { id: 2, title: "새 댓글", body: "프로젝트 Q&A에 새 댓글이 있습니다.", time: "1시간 전" },
    { id: 3, title: "입금 완료", body: "KRW 50,000 입금 처리 완료.", time: "어제" },
  ];
}


function Header() {
  const navigate = useNavigate();
  const { userLoading, user, isLoggedIn } = useUser();

  const [openNotif, setOpenNotif] = useState(false);

  const { data: notifications = [], isLoading: notifLoading, isError: notifError } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: openNotif, // 열릴 때만 호출
    staleTime: 60_000,
  });

  const [userRole, setUserRole] = useState(isLoggedIn ? user?.role : "");
  // 사용자/로그인 상태 변경 시 동기화
  useEffect(() => {
    setUserRole(isLoggedIn ? user?.role ?? "" : "");
  }, [isLoggedIn, user?.role]);

  const roleLabel =
    userRole === "CREATOR" ? "창작자" : userRole === "USER" ? "투자자" : "";


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
              onClick={() => navigate(userRole === "CREATOR" ? "/product-registration" : "/market")}
            >
              {userRole === "CREATOR" ? "상품 등록" : "토큰 거래"}
            </span>
          </div>
        </>
      </div>
      <div className="flex items-end space-x-4">
        {!isLoggedIn ? (
          <></>
        ) : (
          <div className="flex items-center space-x-4">
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
            <IoIosNotificationsOutline
              className="w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
              onClick={() => setOpenNotif(o => !o)}
            />
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

        {openNotif && (
        <>
          {/* 바깥 클릭 영역 */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setOpenNotif(false)}
          />
          {/* 패널 */}
          <div
            className="fixed top-0 right-0 h-full w-[380px] max-w-full bg-white z-50 shadow-xl flex flex-col animate-slide-in"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-bold">알림</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {notifLoading && (
                <div className="p-5 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-56 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {notifError && !notifLoading && (
                <div className="p-6 text-sm text-red-500">
                  알림을 불러오지 못했습니다.
                </div>
              )}

              {!notifLoading && !notifError && notifications.length === 0 && (
                <div className="p-6 text-sm text-gray-400">
                  알림이 없습니다.
                </div>
              )}

              {!notifLoading && !notifError && notifications.length > 0 && (
                <ul className="divide-y">
                  {notifications.map(n => (
                    <li
                      key={n.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="flex justify-between space-x-2">
                        <div className="w-[88%]">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm">{n.title}</span>
                            <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                              {n.time}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600 leading-snug line-clamp-2">
                            {n.body}
                          </p>
                        </div>  
                        <div>
                          <IoMdClose className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t p-3 text-right">
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  // 전체 읽음 처리 (예: mutate)
                  setOpenNotif(false);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export default Header;