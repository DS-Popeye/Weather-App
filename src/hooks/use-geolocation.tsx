import { useState, useEffect } from "react";
import type { Coordinates } from "@/api/types";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const fetchIPLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      setLocationData({
        coordinates: { lat: data.latitude, lon: data.longitude },
        error: null,
        isLoading: false,
      });
    } catch (err) {
      setLocationData({
        coordinates: null,
        error: "Failed to get location via IP",
        isLoading: false,
      });
    }
  };

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      // No GPS → fallback to IP
      fetchIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        // GPS failed → fallback to IP
        fetchIPLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...locationData,
    getLocation,
  };
}
