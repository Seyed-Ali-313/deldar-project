const BACKEND_ORIGIN = "https://ipcphotos.com";

export default function getImageUrl(path) {
  if (!path) return null;
  if (typeof path === "object") {
    path = path.url || path.src || path.path || String(path);
  }
  if (typeof path !== "string") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path.replace(BACKEND_ORIGIN, "");
  }
  return path;
}
