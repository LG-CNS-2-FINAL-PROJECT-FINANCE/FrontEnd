// Header.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { LuUserRound } from "react-icons/lu";
import useUser from "../../lib/useUser";
import { IoIosNotificationsOutline, IoMdClose } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LanguageSwitcher from "../../component/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode"; // ✅ default import
import useFcmToken from "../../lib/useFcmToken";
import {
  deleteNotification,
  getMyNotification,
} from "../../api/notification_api";
import formatTimeAgo from "../../lib/formatTimeAgo";

function Header() {
  const navigate = useNavigate();
  const { userLoading, user, isLoggedIn } = useUser();
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const [openNotif, setOpenNotif] = useState(false);
  const {
    data: notifications,
    isLoading: notifLoading,
    isError: notifError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotification,
    enabled: openNotif,
    staleTime: 60_000,
  });

  // ESC로 알림 패널 닫기
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpenNotif(false);
    if (openNotif) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [openNotif]);

  // 역할 라벨
  const [userRole, setUserRole] = useState(isLoggedIn ? user?.role : "");
  useEffect(() => {
    setUserRole(isLoggedIn ? user?.role ?? "" : "");
  }, [isLoggedIn, user?.role]);

  // ✅ FCM 등록 제어용 상태
  const [userSeq, setUserSeq] = useState(null);
  const alreadyRegisteredRef = useRef(false);

  // ✅ userSeq가 세팅되면 훅이 내부에서 등록 진행
  useFcmToken(userSeq);

  // ✅ 로그인되면 1회 자동 등록
  useEffect(() => {
    if (!isLoggedIn) {
      alreadyRegisteredRef.current = false;
      setUserSeq(null);
      return;
    }
    if (alreadyRegisteredRef.current) return;

    let raw = localStorage.getItem("accessToken");
    if (!raw) return;

    if (raw.startsWith("Bearer ")) raw = raw.slice(7).trim();
    try {
      const decoded = jwtDecode(raw);
      const seq = decoded?.userSeq ?? decoded?.sub;
      if (!seq) {
        console.warn("JWT에 userSeq/sub 없음:", decoded);
        return;
      }
      setUserSeq(String(seq));
      alreadyRegisteredRef.current = true;
    } catch (e) {
      console.error("jwtDecode 실패:", e);
    }
  }, [isLoggedIn]);

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
                navigate(
                  userRole === "CREATOR" ? "/product-registration" : "/market"
                )
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
          <div className="relative">
            <LanguageSwitcher />
          </div>

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
                {!notifLoading && (notifications?.length ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                )}
              </div>
            </div>
          )}

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
          <div className="relative w-[380px] h-[700px] bg-white shadow-2xl rounded-l-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-bold">
                {t("header_notifications_title")}
              </h2>
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
                  {notifications.map((n) => {
                    const id = n.id;
                    const title = n?.title ?? "알림";
                    const body = n?.body ?? "";
                    const timeText = formatTimeAgo(n.sentAt); // ✅ 헬퍼 함수로 변환

                    return (
                      <li
                        key={id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="flex justify-between space-x-2">
                          <div className="w-[88%]">
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-sm">
                                {title}
                              </span>
                              <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                                {timeText}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-600 leading-snug line-clamp-2">
                              {body}
                            </p>
                          </div>
                          <IoMdClose
                            onClick={async () => {
                              await deleteNotification(id);
                              queryClient.refetchQueries({
                                queryKey: ["notifications"],
                              });
                            }}
                            className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
                          />
                        </div>
                      </li>
                    );
                  })}
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
