// src/hooks/use-aqi.ts
import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/api/config';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface AQIData {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

const fetchAqi = async ({ lat, lon }: Coordinates): Promise<AQIData | null> => {
  if (!lat || !lon) return null;

  const url = `${API_CONFIG.AIR_POLLUTION}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch AQI: ${res.statusText}`);
  }

  const data = await res.json();
  if (!data?.list?.[0]?.main) return null;

  return data.list[0].main as AQIData;
};

export const useAqiQuery = ({ lat, lon }: Coordinates) => {
  return useQuery<AQIData | null, Error>({
    queryKey: ['aqi', lat, lon],
    queryFn: () => fetchAqi({ lat, lon }),
    enabled: !!lat && !!lon,
    staleTime: 5 * 60 * 1000,
  });
};
