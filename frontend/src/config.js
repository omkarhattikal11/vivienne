// Central API configuration for Vivienne
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If the frontend is running locally, point directly to local backend
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://127.0.0.1:5500";
    }
    // If hosted on Render (same domain as backend), use relative paths
    if (hostname.includes("onrender.com")) {
      return "";
    }
  }
  // If hosted on Vercel, it uses VITE_API_URL environment variable.
  // You can set VITE_API_URL in your Vercel project settings.
  return import.meta.env.VITE_API_URL || "http://127.0.0.1:5500";
};

export const API_BASE_URL = getApiBaseUrl();
