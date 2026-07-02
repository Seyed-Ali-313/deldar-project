// src/services/api.js
import axios from "axios";

// ⚠️ آدرس موقت است — بعداً با آدرس واقعی بک‌اند جایگزین شود
const BASE_URL = "https://api.deldar-example.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const draftToken = localStorage.getItem("draft_token");
  const accessToken = localStorage.getItem("access_token");

  if (draftToken) config.headers["X-Draft-Token"] = draftToken;
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newDraftToken = response.headers["x-draft-token"];
    if (newDraftToken) localStorage.setItem("draft_token", newDraftToken);
    return response;
  },
  (error) => Promise.reject(error),
);

export default api;
