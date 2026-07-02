// src/components/common/Countdown.jsx
import useCountdown from "../../hooks/useCountdown";
import toPersianNumber from "../../utils/toPersianNumber";

const DEFAULT_TARGET_DATE = "2026-07-08T23:59:59";

export default function Countdown({ targetDate = DEFAULT_TARGET_DATE }) {
  const { days, hours, minutes, seconds, isFinished } =
    useCountdown(targetDate);
  const pad = (num) => toPersianNumber(String(num).padStart(2, "0"));

  if (isFinished) {
    return (
      <div className="countdown-card">
        <p style={{ textAlign: "center" }}>
          مهلت ارسال آثار به پایان رسیده است
        </p>
      </div>
    );
  }

  return (
    <div className="countdown-card">
      <div className="countdown-numbers">
        <span>{pad(days)}</span>
        <span>{pad(hours)}</span>
        <span>{pad(minutes)}</span>
        <span>{pad(seconds)}</span>
      </div>
      <div className="countdown-labels">
        <span>روز</span>
        <span>ساعت</span>
        <span>دقیقه</span>
        <span>ثانیه</span>
      </div>
    </div>
  );
}
