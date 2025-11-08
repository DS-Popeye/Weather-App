// src/pages/WeatherDashboard.tsx
import { useState, useEffect } from "react";
import CurrentWeather from "@/components/currentWeather";
import { FavoriteCities } from "@/components/FavoriteCityTablet";
import HourlyTempreture from "@/components/hourly-tempreture";
import WeatherSkeleton from "@/components/loading.skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherForecast from "@/components/ui/WeatherForecast";
import WeatherDetails from "@/components/WeatherDetails";
import { useFavorites } from "@/hooks/use-favourite";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { RefreshCw, MapPin, AlertTriangle } from "lucide-react";
import { useAqiQuery } from "@/hooks/use-aqi";

const WeatherDashboard = () => {
  const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation();
  const { favorites } = useFavorites();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const aqiQuery = useAqiQuery(coordinates || { lat: 0, lon: 0 });

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
    }
  };

  if (locationLoading) return <WeatherSkeleton />;

  if (locationError || !coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError || "Please enable location access."}</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) return <WeatherSkeleton />;

  const locationName = locationQuery.data?.[0];

  return (
    <div className="space-y-4 relative">
      <FavoriteCities />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          <HourlyTempreture data={forecastQuery.data} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <WeatherDetails data={weatherQuery.data} aqi={aqiQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
