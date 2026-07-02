// src/components/common/Button.jsx
export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "flex items-center justify-center rounded-pill font-lotus font-semibold transition-colors";
  const variants = {
    primary: "w-[206px] h-[60px] bg-gold hover:bg-gold-hover text-white",
    login: "min-w-[104px] min-h-9 px-4 py-2 bg-primary text-white font-nian",
    secondary:
      "w-full max-w-[324px] min-h-[60px] px-6 py-3 bg-primary-dark text-white",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
