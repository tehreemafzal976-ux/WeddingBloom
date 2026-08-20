// Centralized API Base URL configuration
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback to local server or Railway production URL if available
  return "https://weddingbloom-production-b2a2.up.railway.app/api";
};

export const API_URL = getApiUrl();
export default API_URL;
