// src/pages/city-page.tsx
import CurrentWeather from "@/components/currentWeather";
import { FavoriteButton } from "@/components/FavoriteButton";
import HourlyTempreture from "@/components/hourly-tempreture";
import WeatherSkeleton from "@/components/loading.skeleton";
import WeatherForecast from "@/components/ui/WeatherForecast";
import WeatherDetails from "@/components/WeatherDetails";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { useAqiQuery } from "@/hooks/use-aqi";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import AQICard from "@/components/AQICard";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const aqiQuery = useAqiQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Failed to load weather data. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton data={{ ...weatherQuery.data, name: params.cityName }} />
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />
        <HourlyTempreture data={forecastQuery.data} />
        <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} aqi={aqiQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
