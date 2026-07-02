export const isValidMobile = (value) => /^09\d{9}$/.test(value);

export const isValidNationalCode = (value) => {
  if (!/^\d{10}$/.test(value)) return false;
  const check = +value[9];
  const sum = value
    .split("")
    .slice(0, 9)
    .reduce((acc, digit, i) => acc + +digit * (10 - i), 0);
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
};

export const isValidPostalCode = (value) => /^\d{10}$/.test(value);

export const isRequired = (value) =>
  value !== null && value !== undefined && value.toString().trim() !== "";
