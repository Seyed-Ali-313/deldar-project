export default function UploadSuccess() {
  return (
    <div
      className="page"
      style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}
    >
      <div
        style={{
          background: "var(--color-bg-dark)",
          borderRadius: 24,
          padding: "30px 40px",
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <p style={{ lineHeight: 2 }}>
          عکس‌های شما با موفقیت بارگذاری شد.
          <br />
          تا پایان مرداد ۱۴۰۵، با ورود مجدد به سایت می‌توانید عکس‌های خود را
          ویرایش کنید.
          <br />
          از همراهی شما سپاسگزاریم.
        </p>
      </div>
    </div>
  );
}
