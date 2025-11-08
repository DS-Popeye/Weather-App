// src/api/config.ts
export const API_CONFIG = {
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEO: "https://api.openweathermap.org/geo/1.0",
  AIR_POLLUTION: "https://api.openweathermap.org/data/2.5/air_pollution",
  API_KEY: import.meta.env?.VITE_OPENWEATHER_API_KEY,

  DEFAULT_PARAMS: {
    units: "metric",
    appid: import.meta.env?.VITE_OPENWEATHER_API_KEY,
  },
};

// Helper to generate AQI URL
export function getAQIUrl(lat: number, lon: number) {
  return `${API_CONFIG.AIR_POLLUTION}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.API_KEY}`;
}