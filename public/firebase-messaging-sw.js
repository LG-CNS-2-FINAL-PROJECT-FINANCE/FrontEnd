importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Firebase 초기화
firebase.initializeApp({
  apiKey: "AIzaSyB-1S4Wez2ZUpgMSyTGzVG1eSiO6V6digg",
  authDomain: "zzogaemall-e8200.firebaseapp.com",
  projectId: "zzogaemall-e8200",
  storageBucket: "zzogaemall-e8200.firebasestorage.app",
  messagingSenderId: "173010769933",
  appId: "1:173010769933:web:a058435ed50c3e1fe09d44",
});

const messaging = firebase.messaging();

// 설치/활성화
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

// Background 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received", payload);

  const title = payload.notification?.title || "알림";
  const options = {
    body: payload.notification?.body || "내용 없음",
    icon: "/favicon.ico",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);

  // 모든 탭에도 이벤트 전달
  clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clientList) => {
      clientList.forEach((client) => {
        client.postMessage({ type: "SHOW_NOTIFICATION", payload });
      });
    });
});

// Foreground 메시지를 SW로부터 받음
self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const notification = event.data.payload.notification;
    const options = {
      body: notification?.body || "내용 없음",
      icon: "/favicon.ico",
      data: event.data.payload.data || {},
    };
    console.log("[SW] Foreground message forwarded", event.data.payload);
    self.registration.showNotification(notification?.title || "알림", options);
  }
});

// 알림 클릭 이벤트
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
