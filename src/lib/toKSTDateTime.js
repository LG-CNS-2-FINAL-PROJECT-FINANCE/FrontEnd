// 결과: { date: 'YYYY-MM-DD', time: 'HH:MM' }
export function toKSTDateTime(input, { assumeUTCNoTZ = true } = {}) {
  if (input == null) return { date: '', time: '' };

  let d;

  if (input instanceof Date) {
    d = new Date(input.getTime());
  } else if (typeof input === 'number') {
    d = new Date(input);
  } else if (typeof input === 'string') {
    const isoNoTZRegex =
      /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?$/; // 소수초 포함
    const hasTZ = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(input);
    let norm = input.replace(' ', 'T');

    if (isoNoTZRegex.test(norm) && !hasTZ && assumeUTCNoTZ) {
      // TZ 없는 ISO → UTC 가정
      norm = norm + 'Z';
    }
    d = new Date(norm);
  } else {
    return { date: '', time: '' };
  }

  if (isNaN(d.getTime())) return { date: '', time: '' };

  // 이미 UTC로 파싱됐다고 가정 → +9h 해서 KST
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);

  const pad = (n) => String(n).padStart(2, '0');
  const date = `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(
    kst.getUTCDate()
  )}`;
  const time = `${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;

  return { date, time };
}

// 날짜 + 시간(UTC 가정) → KST
export function toKSTFromDateAndTime(dateStr, timeStr, { assumeUTC = true } = {}) {
  if (!dateStr || !timeStr) return { date: '', time: '' };
  const t = /^\d{2}:\d{2}:\d{2}$/.test(timeStr) ? timeStr : `${timeStr}:00`;
  const iso = `${dateStr}T${t}${assumeUTC ? 'Z' : ''}`;
  return toKSTDateTime(iso, { assumeUTCNoTZ: false });
}