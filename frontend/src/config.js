// Central API configuration for Vivienne
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If the frontend is running locally, point directly to local backend
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://127.0.0.1:5500";
    }
  }
  // Fallback to local server or environment variable for production cloud deployment
  // You can set VITE_API_URL in Vercel settings to your live Render/Railway backend URL!
  return import.meta.env.VITE_API_URL || "http://127.0.0.1:5500";
};

export const API_BASE_URL = getApiBaseUrl();
