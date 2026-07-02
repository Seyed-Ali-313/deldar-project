import api from "./api";

export const submitStep1 = (data) => api.post("/onboarding/step-1/", data);
export const submitStep2 = (data) => api.post("/onboarding/step-2/", data);

export const uploadWork = (formData) =>
  api.post("/onboarding/works/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteWork = (workId) =>
  api.delete(`/onboarding/works/${workId}/`);

export const submitAllWorks = () => api.post("/onboarding/submit/");
export const getDraft = () => api.get("/onboarding/draft/");
export const verifyOtp = (otp_code) =>
  api.post("/onboarding/verify/", { otp_code });
