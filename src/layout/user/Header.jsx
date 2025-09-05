import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuUserRound } from "react-icons/lu";
import useUser from "../../lib/useUser";
import { IoIosNotificationsOutline, IoMdClose } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import LanguageSwitcher from "../../component/LanguageSwitcher";
import { useTranslation } from "react-i18next";

// (예시) 알림 조회 API
async function fetchNotifications() {
  return [
    { id: 1, title: "주문 체결", body: "ABC 토큰 10개 체결되었습니다.", time: "2분 전" },
    { id: 2, title: "새 댓글", body: "프로젝트 Q&A에 새 댓글이 있습니다.", time: "1시간 전" },
    { id: 3, title: "입금 완료", body: "KRW 50,000 입금 처리 완료.", time: "어제" },
  ];
}

function Header() {
  const navigate = useNavigate();
  const { userLoading, user, isLoggedIn } = useUser();
  const { t } = useTranslation();

  const [openNotif, setOpenNotif] = useState(false);
  const { data: notifications = [], isLoading: notifLoading, isError: notifError } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: openNotif,
    staleTime: 60_000,
  });

  const [userRole, setUserRole] = useState(isLoggedIn ? user?.role : "");
  useEffect(() => {
    setUserRole(isLoggedIn ? user?.role ?? "" : "");
  }, [isLoggedIn, user?.role]);

  const roleLabel =
      userRole === "CREATOR"
          ? t("header_creator_role")
          : userRole === "USER"
              ? t("header_investor_role")
              : "";

  return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto py-3 px-6">
          {/* --- Left: Logo + Nav --- */}
          <div className="flex items-center space-x-10">
            <img
                src="/assets/logo.png"
                alt={t("header_logo_alt")}
                className="w-24 h-auto hover:cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate("/")}
            />

            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-700">
            <span
                className="hover:text-red-500 hover:underline cursor-pointer transition"
                onClick={() => navigate("/asset")}
            >
              {t("header_asset_inquiry")}
            </span>
              <span
                  className="hover:text-red-500 hover:underline cursor-pointer transition"
                  onClick={() => navigate("/investment")}
              >
              {t("header_investment_products")}
            </span>
              <span
                  className="hover:text-red-500 hover:underline cursor-pointer transition"
                  onClick={() =>
                      navigate(userRole === "CREATOR" ? "/product-registration" : "/market")
                  }
              >
              {userRole === "CREATOR"
                  ? t("header_product_registration")
                  : t("header_token_trading")}
            </span>
              <span
                  className="hover:text-red-500 hover:underline cursor-pointer transition"
                  onClick={() => navigate("/event")}
              >
              {t("header_events")}
            </span>
            </nav>
          </div>

          {/* --- Right: Language + Actions --- */}
          <div className="flex items-center space-x-5">
            {/* ✅ 언어 선택 */}
            <div className="relative">
              <LanguageSwitcher />
            </div>

            {/* ✅ 역할 버튼 & 알림 */}
            {isLoggedIn && (
                <div className="flex items-center space-x-3">
                  <button
                      className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-md transition
                  ${
                          userRole === "USER"
                              ? "bg-red-500 hover:bg-red-600"
                              : userRole === "CREATOR"
                                  ? "bg-blue-500 hover:bg-blue-600"
                                  : "bg-gray-400 hover:bg-gray-500"
                      }`}
                      onClick={() => navigate("/select-role")}
                  >
                    {roleLabel || t("header_select_role")}
                  </button>

                  <div className="relative">
                    <IoIosNotificationsOutline
                        className="w-7 h-7 text-gray-500 hover:text-gray-700 cursor-pointer transition"
                        onClick={() => setOpenNotif((o) => !o)}
                    />
                    {/* 빨간 점 뱃지 */}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                  </div>
                </div>
            )}

            {/* ✅ 로그인 아이콘 */}
            {userLoading ? (
                <div className="w-10 h-10 flex items-center justify-center animate-pulse text-gray-400 text-sm">
                  {t("header_loading_user")}
                </div>
            ) : !isLoggedIn ? (
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => navigate("/login/1")}
                >
                  <LuUserRound className="w-6 h-6 text-gray-500 hover:text-red-500 transition" />
                </div>
            ) : (
                <div>
                  {userRole === "USER" ? (
                      <img
                          src="/assets/bull.png"
                          alt={t("header_investor_icon_alt")}
                          className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => navigate("/my-profile")}
                      />
                  ) : userRole === "CREATOR" ? (
                      <img
                          src="/assets/pig.png"
                          alt={t("header_creator_icon_alt")}
                          className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => navigate("/my-profile")}
                      />
                  ) : (
                      <LuUserRound
                          className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                          onClick={() => navigate("/login/1")}
                      />
                  )}
                </div>
            )}
          </div>
        </div>

        {/* --- 알림 패널 --- */}
        {openNotif && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div
                  className="absolute inset-0 bg-black bg-opacity-30"
                  onClick={() => setOpenNotif(false)}
              />
              <div className="relative w-[380px] h-full bg-white shadow-2xl rounded-l-2xl flex flex-col animate-slide-in">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                  <h2 className="text-lg font-bold">{t("header_notifications_title")}</h2>
                  <IoMdClose
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500 transition"
                      onClick={() => setOpenNotif(false)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {notifLoading && (
                      <div className="space-y-4">
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
                      <div className="text-sm text-red-500">
                        {t("header_notifications_fetch_error")}
                      </div>
                  )}

                  {!notifLoading && !notifError && notifications.length === 0 && (
                      <div className="text-sm text-gray-400">
                        {t("header_notifications_empty")}
                      </div>
                  )}

                  {!notifLoading && !notifError && notifications.length > 0 && (
                      <ul className="divide-y">
                        {notifications.map((n) => (
                            <li
                                key={n.id}
                                className="p-4 hover:bg-gray-50 cursor-pointer transition"
                            >
                              <div className="flex justify-between space-x-2">
                                <div className="w-[88%]">
                                  <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm">
                              {t(`notification_${n.id}_title`, n.title)}
                            </span>
                                    <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                              {t(`notification_${n.id}_time`, n.time)}
                            </span>
                                  </div>
                                  <p className="mt-1 text-xs text-gray-600 leading-snug line-clamp-2">
                                    {t(`notification_${n.id}_body`, n.body)}
                                  </p>
                                </div>
                                <IoMdClose className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                              </div>
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
                <div className="border-t p-3 text-right">
                  <button
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => setOpenNotif(false)}
                  >
                    {t("header_close_button")}
                  </button>
                </div>
              </div>
            </div>
        )}
      </header>
  );
}

export default Header;
