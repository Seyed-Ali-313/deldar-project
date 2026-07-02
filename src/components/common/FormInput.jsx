// src/components/common/FormInput.jsx
export default function FormInput({
  placeholder,
  required,
  register,
  name,
  ...props
}) {
  return (
    <div className="pill">
      <input
        className="register-input"
        placeholder={placeholder}
        {...(register ? register(name, { required }) : {})}
        {...props}
      />
      {required && <span className="req">*</span>}
    </div>
  );
}
