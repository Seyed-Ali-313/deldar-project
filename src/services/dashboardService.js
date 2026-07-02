import api from "./api";

export const getProfile = () => api.get("/dashboard/profile/");
export const updateProfile = (data) => api.put("/dashboard/profile/", data);

export const requestMobileChange = (new_mobile) =>
  api.post("/dashboard/profile/mobile/request/", { new_mobile });

export const verifyMobileChange = (new_mobile, otp_code) =>
  api.post("/dashboard/profile/mobile/verify/", { new_mobile, otp_code });

export const getWorks = () => api.get("/dashboard/works/");
export const updateWork = (id, data) =>
  api.patch(`/dashboard/works/${id}/`, data);
export const deleteWork = (id) => api.delete(`/dashboard/works/${id}/`);
export const addWork = (formData) =>
  api.post("/dashboard/works/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
