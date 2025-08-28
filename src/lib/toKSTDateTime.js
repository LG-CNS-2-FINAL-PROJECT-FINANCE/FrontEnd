/**
 * 입력( Date | number(ms) | string )을 KST로 변환
 * 기본 반환: { date:'YYYY-MM-DD', time:'HH:MM' }
 * 옵션 asString:true → "YYYY-MM-DD HH:MM"
 */
export function toKSTDateTime(
  input,
  { assumeUTCNoTZ = true, asString = false } = {}
) {
  if (input == null) return asString ? "" : { date: "", time: "" };

  let d;
  if (input instanceof Date) {
    d = new Date(input.getTime());
  } else if (typeof input === "number") {
    d = new Date(input);
  } else if (typeof input === "string") {
    // YYYY-MM-DD HH:MM[:SS][.sss] OR T 구분
    const isoNoTZRegex = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?$/;
    const hasTZ = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(input);
    let norm = input.replace(" ", "T");
    if (isoNoTZRegex.test(norm) && !hasTZ && assumeUTCNoTZ) norm += "Z";
    d = new Date(norm);
  } else {
    return asString ? "" : { date: "", time: "" };
  }

  if (isNaN(d.getTime())) return asString ? "" : { date: "", time: "" };

  // UTC 기준 → +9h = KST
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(
    kst.getUTCDate()
  )}`;
  const time = `${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;

  return asString ? `${date} ${time}` : { date, time };
}

/**
 * 분리된 날짜/시간(UTC 가정) 문자열을 KST로
 * dateStr: 'YYYY-MM-DD'
 * timeStr: 'HH:MM' 또는 'HH:MM:SS'
 */
export function toKSTFromDateAndTime(
  dateStr,
  timeStr,
  { assumeUTC = true, asString = false } = {}
) {
  if (!dateStr || !timeStr) return asString ? "" : { date: "", time: "" };
  const t = /^\d{2}:\d{2}:\d{2}$/.test(timeStr) ? timeStr : `${timeStr}:00`;
  const iso = `${dateStr}T${t}${assumeUTC ? "Z" : ""}`;
  return toKSTDateTime(iso, { assumeUTCNoTZ: false, asString });
}

// 편의: 항상 "YYYY-MM-DD HH:MM"
export const toKSTString = (input) =>
  toKSTDateTime(input, { asString: true });

/**
 * 안전 출력 헬퍼 (객체/문자 모두 허용)
 */
export const formatKST = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && ("date" in v || "time" in v)) {
    return [v.date, v.time].filter(Boolean).join(" ").trim();
  }
  return String(v);
};