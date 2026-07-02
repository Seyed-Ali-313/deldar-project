// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(3, 65, 32, 1)", // سبز اصلی پس‌زمینه --color-bg-main
        "primary-dark": "rgba(0, 36, 3, 1)", // سبز خیلی تیره btn-secondary-second
        gold: "rgba(165, 135, 77, 1)", // --btn-bg (طلایی دکمه‌ها)
        "gold-hover": "rgba(178, 148, 90, 1)", // --btn-bg-hover
        pill: "#D9D9D9", // --pill-bg (فیلدهای ورودی)
        "pill-focus": "#ececec", // --pill-bg-focus
        "error-red": "#B00101", // رنگ ستاره الزامی (*)
      },
      fontFamily: {
        lotus: ["w_Lotus", "sans-serif"],
        nian: ["w_Nian", "sans-serif"],
      },
      borderRadius: {
        pill: "24px",
      },
    },
  },
  plugins: [],
};
