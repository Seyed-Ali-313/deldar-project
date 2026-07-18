// src/components/common/PersianDatePicker.jsx
import { useState, useRef, useEffect } from "react";

/* ===================== توابع تبدیل تاریخ ===================== */
function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

function jalaliToGregorian(jy, jm, jd) {
  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  gy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  let gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (gm = 1; gm <= 12 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }
  return [gy, gm, gd];
}

function isLeapJalaliYear(jy) {
  const breaks = [-14, 3, 5, 8, 9, 12, 15, 20, 21, 24, 30, 33];
  let mod = jy % 33;
  return breaks.includes(mod - (mod > 32 ? 33 : 0)) || (jy % 33) % 4 === 1;
}

function jalaliMonthLength(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

const MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const WEEKDAY_NAMES = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function toPersianDigits(str) {
  const map = {
    0: "۰",
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
  };
  return String(str).replace(/[0-9]/g, (d) => map[d]);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getFirstWeekday(jy, jm) {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, 1);
  const jsDay = new Date(gy, gm - 1, gd).getDay();
  return (jsDay + 1) % 7;
}

/* ===================== کامپوننت اصلی ===================== */
export default function PersianDatePicker({
  value,
  onChange,
  placeholder = "تاریخ تولد",
  required,
  error, // ← خطای سرور
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("days");
  const [yearPage, setYearPage] = useState(0);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  const today = new Date();
  const [todayJy, todayJm, todayJd] = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  const rawDate = value ? String(value).split("T")[0].replace(/\//g, "-") : "";
  const parsedValue =
    rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
      ? rawDate.split("-").map(Number)
      : null;

  const [viewYear, setViewYear] = useState(
    parsedValue ? parsedValue[0] : todayJy,
  );
  const [viewMonth, setViewMonth] = useState(
    parsedValue ? parsedValue[1] : todayJm,
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setView("days");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && dropdownRef.current && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dh = 380;

      let left = Math.max(8, Math.min(rect.left, window.innerWidth - 280 - 8));

      const style = dropdownRef.current.style;
      style.position = "fixed";
      style.left = `${left}px`;
      style.width = "280px";
      style.right = "auto";

      if (spaceBelow < dh && spaceAbove > spaceBelow) {
        style.top = "auto";
        style.bottom = `${window.innerHeight - rect.top + 8}px`;
      } else {
        style.top = `${rect.bottom + 8}px`;
        style.bottom = "auto";
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const displayValue = parsedValue
    ? toPersianDigits(
        `${parsedValue[0]}/${pad2(parsedValue[1])}/${pad2(parsedValue[2])}`,
      )
    : "";

  const daysInMonth = jalaliMonthLength(viewYear, viewMonth);
  const firstWeekday = getFirstWeekday(viewYear, viewMonth);

  const handleSelectDay = (day) => {
    const formatted = `${viewYear}-${pad2(viewMonth)}-${pad2(day)}`;
    onChange(formatted);
    setOpen(false);
    setView("days");
  };

  const handleSelectMonth = (m) => {
    setViewMonth(m);
    setView("days");
  };

  const handleSelectYear = (y) => {
    setViewYear(y);
    setView("days");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange && onChange("");
    setOpen(false);
  };

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d) =>
    parsedValue &&
    parsedValue[0] === viewYear &&
    parsedValue[1] === viewMonth &&
    parsedValue[2] === d;

  const isToday = (d) =>
    todayJy === viewYear && todayJm === viewMonth && todayJd === d;

  const baseYear = 1300 + yearPage * 10;
  const yearList = Array.from({ length: 10 }, (_, i) => baseYear + i);

  // ===== تم دارک-طلایی برای دراپ‌داون =====
  const THEME = {
    bg: "#0a1a12",
    bgCard: "#0f241a",
    bgHover: "rgba(164, 135, 77, 0.15)",
    bgSelected: "rgba(164, 135, 77, 0.25)",
    gold: "#C9A84C",
    goldDark: "#A4874D",
    goldLight: "#E8D5A3",
    goldGlow: "rgba(201, 168, 76, 0.3)",
    text: "#F5F0E8",
    textMuted: "#a8b5b0",
    textDark: "#1a1a1a",
    border: "rgba(201, 168, 76, 0.15)",
    borderLight: "rgba(255,255,255,0.06)",
    shadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08)",
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        className="pill"
        style={{
          position: "relative",
          borderColor: error ? "#B00101" : "transparent",
          borderWidth: error ? "1.5px" : "0",
          borderStyle: error ? "solid" : "none",
          backgroundColor: error ? "rgba(176,1,1,0.04)" : "var(--pill-bg)",
        }}
        ref={wrapperRef}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            borderRadius: "24px",
          }}
        >
          <input
            type="text"
            readOnly
            className="register-input persian-date-input"
            placeholder={placeholder} // ✅ همیشه placeholder اصلی
            value={displayValue}
            onClick={() => setOpen((o) => !o)}
            style={{
              cursor: "pointer",
              fontFamily: "w_Lotus, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              color: error ? "#c0392b" : "#1a1a1a", // ✅ اگر خطا داره قرمز، وگرنه مشکی
              padding: "9px 30px 9px 44px",
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              borderRadius: "24px",
              letterSpacing: "0.3px",
            }}
          />
          {required && (
            <span
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#B00101",
                fontSize: "15px",
                fontWeight: 700,
                pointerEvents: "none",
              }}
            >
              *
            </span>
          )}

          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="پاک کردن تاریخ"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#999",
                padding: "4px 8px",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                fontWeight: 300,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#A4874D";
                e.currentTarget.style.background = "rgba(164, 135, 77, 0.12)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#999";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ✕
            </button>
          )}
        </div>

        {open && (
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              zIndex: 9999,
              background: THEME.bgCard,
              borderRadius: "18px",
              boxShadow: THEME.shadow,
              padding: "14px 16px 12px",
              width: "280px",
              direction: "rtl",
              fontFamily: "w_Lotus, sans-serif",
              animation: "pickerFadeIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
              border: `1px solid ${THEME.border}`,
              backdropFilter: "blur(4px)",
            }}
          >
            {/* ===== هدر ===== */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {view === "days" && (
                <>
                  <button
                    type="button"
                    onClick={goPrevMonth}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "18px",
                      fontWeight: 300,
                      color: THEME.textMuted,
                      width: "28px",
                      height: "28px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = THEME.bgHover;
                      e.currentTarget.style.color = THEME.gold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = THEME.textMuted;
                    }}
                  >
                    ‹
                  </button>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setView("months")}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "17px",
                        color: THEME.text,
                        padding: "4px 12px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        letterSpacing: "0.3px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = THEME.bgHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {MONTH_NAMES[viewMonth - 1]}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setView("years");
                        setYearPage(Math.floor((viewYear - 1300) / 10));
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "17px",
                        color: THEME.text,
                        padding: "4px 12px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = THEME.bgHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {toPersianDigits(viewYear)}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={goNextMonth}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "18px",
                      fontWeight: 300,
                      color: THEME.textMuted,
                      width: "28px",
                      height: "28px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = THEME.bgHover;
                      e.currentTarget.style.color = THEME.gold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = THEME.textMuted;
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {view === "months" && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => setView("days")}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: THEME.text,
                      padding: "4px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = THEME.bgHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {toPersianDigits(viewYear)}
                  </button>
                </div>
              )}

              {view === "years" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setYearPage((p) => p - 1)}
                    disabled={baseYear <= 1300}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: baseYear <= 1300 ? "not-allowed" : "pointer",
                      fontSize: "18px",
                      fontWeight: 300,
                      color:
                        baseYear <= 1300
                          ? "rgba(255,255,255,0.2)"
                          : THEME.textMuted,
                      width: "28px",
                      height: "28px",
                      borderRadius: "10px",
                      opacity: baseYear <= 1300 ? 0.4 : 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (baseYear > 1300) {
                        e.currentTarget.style.background = THEME.bgHover;
                        e.currentTarget.style.color = THEME.gold;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      if (baseYear > 1300)
                        e.currentTarget.style.color = THEME.textMuted;
                    }}
                  >
                    ‹
                  </button>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: THEME.text,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {toPersianDigits(baseYear)} –{" "}
                    {toPersianDigits(baseYear + 9)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setYearPage((p) => p + 1)}
                    disabled={baseYear >= 1500}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: baseYear >= 1500 ? "not-allowed" : "pointer",
                      fontSize: "18px",
                      fontWeight: 300,
                      color:
                        baseYear >= 1500
                          ? "rgba(255,255,255,0.2)"
                          : THEME.textMuted,
                      width: "28px",
                      height: "28px",
                      borderRadius: "10px",
                      opacity: baseYear >= 1500 ? 0.4 : 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (baseYear < 1500) {
                        e.currentTarget.style.background = THEME.bgHover;
                        e.currentTarget.style.color = THEME.gold;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      if (baseYear < 1500)
                        e.currentTarget.style.color = THEME.textMuted;
                    }}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* ===== روزها ===== */}
            {view === "days" && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    marginBottom: "6px",
                    gap: "2px",
                  }}
                >
                  {WEEKDAY_NAMES.map((w) => (
                    <div
                      key={w}
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: THEME.textMuted,
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        padding: "2px 0",
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                  }}
                >
                  {cells.map((d, i) =>
                    d === null ? (
                      <div key={i} />
                    ) : (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectDay(d)}
                        style={{
                          border:
                            isToday(d) && !isSelected(d)
                              ? `1px solid ${THEME.gold}`
                              : "none",
                          borderRadius: "12px",
                          padding: "6px 0",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: isSelected(d)
                            ? 700
                            : isToday(d)
                              ? 600
                              : 400,
                          background: isSelected(d)
                            ? THEME.gold
                            : isToday(d)
                              ? THEME.bgSelected
                              : "transparent",
                          color: isSelected(d)
                            ? THEME.textDark
                            : isToday(d)
                              ? THEME.goldLight
                              : THEME.text,
                          transition: "all 0.15s ease",
                          boxShadow: isSelected(d)
                            ? `0 3px 12px ${THEME.goldGlow}`
                            : "none",
                          fontFamily: "w_Lotus, sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected(d)) {
                            e.currentTarget.style.background = THEME.bgHover;
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected(d)) {
                            e.currentTarget.style.background = isToday(d)
                              ? THEME.bgSelected
                              : "transparent";
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                        onMouseDown={(e) => {
                          if (!isSelected(d)) {
                            e.currentTarget.style.transform = "scale(0.93)";
                          }
                        }}
                        onMouseUp={(e) => {
                          if (!isSelected(d)) {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                      >
                        {toPersianDigits(d)}
                      </button>
                    ),
                  )}
                </div>

                <div
                  style={{
                    margin: "10px 0 2px",
                    borderTop: `1px solid ${THEME.borderLight}`,
                  }}
                />
              </>
            )}

            {/* ===== ماه‌ها ===== */}
            {view === "months" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "6px",
                  marginTop: "2px",
                }}
              >
                {MONTH_NAMES.map((name, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMonth(idx + 1)}
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      padding: "9px 4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: viewMonth === idx + 1 ? 600 : 500,
                      background:
                        viewMonth === idx + 1
                          ? THEME.gold
                          : "rgba(255,255,255,0.04)",
                      color:
                        viewMonth === idx + 1 ? THEME.textDark : THEME.text,
                      transition: "all 0.15s ease",
                      boxShadow:
                        viewMonth === idx + 1
                          ? `0 3px 12px ${THEME.goldGlow}`
                          : "none",
                      fontFamily: "w_Lotus, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (viewMonth !== idx + 1) {
                        e.currentTarget.style.background = THEME.bgHover;
                        e.currentTarget.style.transform = "scale(1.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewMonth !== idx + 1) {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            {/* ===== سال‌ها ===== */}
            {view === "years" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "6px",
                  marginTop: "2px",
                }}
              >
                {yearList.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => handleSelectYear(y)}
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      padding: "9px 4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: viewYear === y ? 600 : 500,
                      background:
                        viewYear === y ? THEME.gold : "rgba(255,255,255,0.04)",
                      color: viewYear === y ? THEME.textDark : THEME.text,
                      transition: "all 0.15s ease",
                      boxShadow:
                        viewYear === y
                          ? `0 3px 12px ${THEME.goldGlow}`
                          : "none",
                      fontFamily: "w_Lotus, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (viewYear !== y) {
                        e.currentTarget.style.background = THEME.bgHover;
                        e.currentTarget.style.transform = "scale(1.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewYear !== y) {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  >
                    {toPersianDigits(y)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ نمایش اخطار زیر فیلد */}
      {error && (
        <div
          style={{
            color: "#B00101",
            fontSize: "12.5px",
            fontWeight: 600,
            marginTop: "6px",
            paddingRight: "16px",
            textAlign: "right",
            fontFamily: "w_Lotus, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "14px" }}>⚠</span>
          {error}
        </div>
      )}

      <style>{`
        @keyframes pickerFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .persian-date-input::placeholder {
          color: rgba(0, 0, 0, 0.5);
          font-weight: 400;
        }
        .persian-date-input {
          font-feature-settings: "ss02";
        }
      `}</style>
    </div>
  );
}
