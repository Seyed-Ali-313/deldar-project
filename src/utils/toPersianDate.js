import toPersianNumber from "./toPersianNumber";

export default function toPersianDate(isoString) {
  if (!isoString) return "---";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "---";

  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  const jalali = gregorianToJalali(gregorianYear, gregorianMonth, gregorianDay);
  if (!jalali) return "---";

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `در تاریخ ${toPersianNumber(jalali[0])}/${toPersianNumber(String(jalali[1]).padStart(2, "0"))}/${toPersianNumber(String(jalali[2]).padStart(2, "0"))} در ساعت ${toPersianNumber(String(hours).padStart(2, "0"))}:${toPersianNumber(String(minutes).padStart(2, "0"))} بارگذاری شد`;
}

function gregorianToJalali(gy, gm, gd) {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const jDaysInMonth = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29];

  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm, jd;
  for (jm = 1; jm <= 11; jm++) {
    if (days < jDaysInMonth[jm]) break;
    days -= jDaysInMonth[jm];
  }
  jd = days + 1;
  return [jy, jm, jd];
}
