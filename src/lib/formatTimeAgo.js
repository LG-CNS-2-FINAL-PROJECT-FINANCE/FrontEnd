import dayjs from "dayjs";
import { toKSTDateTime } from "./toKSTDateTime";

export default function formatTimeAgo(sentAt) {
  if (!sentAt) return "";

  // Convert both current time and sentAt to KST
  const nowKST = toKSTDateTime(new Date(), { asString: true });
  const pastKST = toKSTDateTime(sentAt, { asString: true });

  if (!nowKST || !pastKST) return "";

  const now = dayjs(nowKST);
  const past = dayjs(pastKST);
  
  if (!now.isValid() || !past.isValid()) return "";

  const diffMinutes = now.diff(past, "minute");
  const diffHours = now.diff(past, "hour");
  const diffDays = now.diff(past, "day");
  const diffMonths = now.diff(past, "month");

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`; // 0~59분
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`; // 1~23시간
  } else if (diffDays < 30) {
    return `${diffDays}일 전`; // 1~29일
  } else {
    return `${diffMonths}달 전`; // 1달 이상
  }
}
