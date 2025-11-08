// WeatherPage.tsx
import { useEffect, useState } from "react";
import { weatherAPI } from "@/api/weather";
import type { WeatherData, AQIData } from "@/api/types";
import WeatherDetails from "@/components/WeatherDetails";

const WeatherPage = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace with your coordinates
  const coords = { lat: 31.4593, lon: 104.7542 }; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const weatherData = await weatherAPI.getCurrentWeather(coords);
        const aqiData = await weatherAPI.getAirQuality(coords);
        setWeather(weatherData);
        setAqi(aqiData);
      } catch (err: any) {
        console.error("Error fetching weather or AQI:", err);
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading weather data...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {weather && <WeatherDetails data={weather} aqi={aqi || undefined} />}
    </div>
  );
};

export default WeatherPage;
