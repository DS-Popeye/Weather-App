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

  const fetchIpLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/"); // fallback IP location API
      const data = await res.json();
      setLocationData({
        coordinates: { lat: data.latitude, lon: data.longitude },
        error: null,
        isLoading: false,
      });
    } catch (err) {
      setLocationData({
        coordinates: null,
        error: "Unable to determine location from IP",
        isLoading: false,
      });
    }
  };

  const getLocation = () => {
    setLocationData({ coordinates: null, error: null, isLoading: true });

    if (!navigator.geolocation) {
      // Browser doesn't support geolocation, fallback to IP
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success: use GPS coordinates
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
        // If GPS fails, fallback to IP location
        console.warn("GPS location failed, fallback to IP", error);
        fetchIpLocation();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...locationData,
    getLocation, // manually refresh location if needed
  };
}
