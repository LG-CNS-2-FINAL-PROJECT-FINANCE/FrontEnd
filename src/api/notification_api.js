import { privateApi } from "./axiosInstance";

// 서버 응답을 프론트에서 쓰기 좋은 형태로 변환
export const getMyNotification = async () => {
  try {
    const { data } = await privateApi.get(`/notification/list`);

    // 안전하게 배열인지 확인
    if (!Array.isArray(data)) return [];

    // 매핑
    return (
      data
        .map((it) => ({
          id: it.userNotificationSeq,
          userSeq: it.userSeq,
          status: it.notificationStatus, // UNREAD, READ
          sentAt: it.sentAt,
          readAt: it.readAt,
          title: it.notification?.title ?? "",
          body: it.notification?.message ?? "",
          type: it.notification?.notificationType ?? "INFORMATION",
        }))
        // 최신순 정렬
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
    );
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteNotification = async (userNotificationSeqs) => {
  try {
    const response = await privateApi.post(
      `/notification/read`,
      { userNotificationSeqs: [userNotificationSeqs] },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
