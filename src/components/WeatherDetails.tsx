// WeatherDetails.tsx
import type { WeatherData, AQIData } from '@/api/types';
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface WeatherDetailsProps {
  data: WeatherData;
  aqi?: AQIData;
}

const WeatherDetails = ({ data, aqi }: WeatherDetailsProps) => {
  const { wind, main, sys } = data;

  const formatTime = (timestamp: number) => format(new Date(timestamp * 1000), "h:mm a");
  
  const getWindDirection = (degree: number) => {
    const directions = ["N","NE","E","SE","S","SW","W","NW"];
    return directions[Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8];
  };

  const getAQICategory = (aqi: number) => {
    switch (aqi) {
      case 1: return "Good";
      case 2: return "Fair";
      case 3: return "Moderate";
      case 4: return "Poor";
      case 5: return "Very Poor";
      default: return "Unknown";
    }
  };

  const details = [
    { title: "Sunrise", value: formatTime(sys.sunrise), icon: Sunrise, color: "text-orange-500" },
    { title: "Sunset", value: formatTime(sys.sunset), icon: Sunset, color: "text-blue-500" },
    { title: "Wind Direction", value: `${getWindDirection(wind.deg)} (${wind.deg}°)`, icon: Compass, color: "text-green-500" },
    { title: "Pressure", value: `${main.pressure} hPa`, icon: Gauge, color: "text-purple-500" },
    { title: "Humidity", value: `${main.humidity} %`, icon: Gauge, color: "text-blue-500" },
    { title: "Sea Level", value: `${main.sea_level} m`, icon: Gauge, color: "text-indigo-500" },
    { title: "Ground Level", value: `${main.grnd_level} m`, icon: Gauge, color: "text-yellow-500" },
    { title: "Visibility", value: `${data.visibility / 1000} km`, icon: Gauge, color: "text-red-500" },
  ];

  if (aqi) {
    details.push({
      title: "Air Quality",
      value: `${aqi.aqi} (${getAQICategory(aqi.aqi)})`,
      icon: Gauge,
      color: "text-red-600",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          {details.map(detail => (
            <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
              <detail.icon className={`h-5 w-5 ${detail.color}`} />
              <div>
                <p className="text-sm font-medium leading-none">{detail.title}</p>
                <p className="text-sm text-muted-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
