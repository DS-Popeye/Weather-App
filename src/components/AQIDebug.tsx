// AQIDebug.tsx
import { useEffect } from "react";
import { useAqiQuery } from "@/hooks/use-aqi";

interface AQIDebugProps {
  lat: number;
  lon: number;
}

export default function AQIDebug({ lat, lon }: AQIDebugProps) {
  const { data, error, isLoading } = useAqiQuery({ lat, lon });

  useEffect(() => {
    if (data) {
      console.log("AQI Data:", data);
    }
    if (error) {
      console.error("AQI Error:", error);
    }
  }, [data, error]);

  if (isLoading) return <p>Loading AQI...</p>;
  if (error) return <p>Error fetching AQI.</p>;
  if (!data) return <p>No AQI data available.</p>;

  const aqi = data.list?.[0]?.main?.aqi || 0;
  const components = data.list?.[0]?.components;

  return (
    <div className="space-y-2 border rounded p-4">
      <h2 className="font-bold text-lg">Air Quality Index</h2>
      <p>
        AQI: <span className="font-semibold">{aqi}</span> (
        {aqi === 1
          ? "Good"
          : aqi === 2
          ? "Fair"
          : aqi === 3
          ? "Moderate"
          : aqi === 4
          ? "Poor"
          : "Very Poor"}
        )
      </p>
      {components && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {Object.entries(components).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center">
              <p className="text-sm font-semibold">{key.toUpperCase()}</p>
              <p className="text-xs">{value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
