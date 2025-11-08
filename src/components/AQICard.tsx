// src/components/AQICard.tsx
import type { AQIData } from "@/api/types";

interface AQICardProps {
  aqiData?: AQIData;
}

const componentIcons: Record<string, string> = {
  co: "../assets/icons/carbon-monoxide.png",
  no: "../assets/icons/nitric-oxide.png",
  no2: "../assets/icons/nitrogen-dioxide.png",
  o3: "../assets/icons/ozone.png",
  so2: "../assets/icons/sulfur-dioxide.png",
  pm2_5: "../assets/icons/pm2-5.png",
  pm10: "../assets/icons/pm10.png",
  nh3: "../assets/icons/ammonia.png",
};

export default function AQICard({ aqiData }: AQICardProps) {
  if (!aqiData || !aqiData.list?.[0]?.components) return null;

  const { components } = aqiData.list[0];

  return (
    <div className="grid grid-cols-3 gap-4 bg-white/10 p-4 rounded-lg shadow">
      {Object.entries(components).map(([key, value]) => (
        <div key={key} className="flex flex-col items-center justify-center">
          <img src={componentIcons[key] || ""} alt={key} className="h-8 w-8 mb-1" />
          <span className="text-sm font-medium">{key.toUpperCase()}</span>
          <span className="text-xs text-gray-300">{value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
