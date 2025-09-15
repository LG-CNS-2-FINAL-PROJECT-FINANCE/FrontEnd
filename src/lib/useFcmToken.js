import { useEffect } from "react";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { privateApi } from "../api/axiosInstance";

const VAPID_KEY =
  "BBYUX5YqOCc7GnRi8Q2IBFOqt4HHGrXkIDkuWt2sLHvj2n7yFPf6Qx3GkNDWqSKG2vq4BvgYH-bdC0QPySvhEVE";

const saveDeviceToken = async ({ userSeq, fcmToken, deviceType }) => {
  // baseURL: "http://192.168.0.222:8080/api"
  // 최종 호출: POST http://192.168.0.222:8080/api/notification/device-tokens/save
  const { data } = await privateApi.post(
    "/notification/device-tokens/save",
    { userSeq, fcmToken, deviceType } // JSON 바디
  );
  return data; // 필요 시 가공
};

function useFcmToken(userSeq) {
  useEffect(() => {
    if (!userSeq) return;

    const ensurePermissionAndRegister = async () => {
      try {
        // 권한 요청
        if (Notification.permission !== "granted") {
          const perm = await Notification.requestPermission();
          console.log("Notification 권한:", perm);
          if (perm !== "granted") return;
        }

        // 토큰 발급
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) return;
        console.log("✅ FCM 토큰:", token);

        // 서버 저장 (axios)
        const res = await saveDeviceToken({
          userSeq,
          fcmToken: token,
          deviceType: "WEB",
        });
        console.log("💾 저장 완료:", res);
      } catch (e) {
        console.error("FCM 등록 실패:", e);
      }
    };

    ensurePermissionAndRegister();

    // 포그라운드 메시지 리스너
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("[FCM foreground] payload:", payload);
      const title = payload.notification?.title || "알림";
      const options = {
        body: payload.notification?.body || "내용 없음",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        data: payload.data || {},
        tag: payload.notification?.tag || "dev-tag",
        renotify: true,
      };

      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          payload,
        });
      } else {
        // 개발 중 SW 미동작시 직접 표시
        try {
          new Notification(title, options);
        } catch {
          console.warn("SW 없음/권한없음으로 알림 미표시");
        }
      }
    });

    return () => unsubscribe();
  }, [userSeq]);
}

export default useFcmToken;
