import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export interface DeviceLocation {
  country: string;
  cityState: string;
  timeZone: string;
}

export type LocationStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

interface UseDeviceLocationResult {
  data: DeviceLocation | null;
  status: LocationStatus;
  refresh: () => Promise<void>;
}

function getTimeZoneLabel(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const long = extractTimeZoneName(now, tz, 'long');
  const short = extractTimeZoneName(now, tz, 'short');
  if (long && short && long !== short) return `${long} (${short})`;
  return long || short || tz;
}

function extractTimeZoneName(date: Date, timeZone: string, type: 'long' | 'short') {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: type,
    }).formatToParts(date);
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

export function useDeviceLocation(): UseDeviceLocationResult {
  const [data, setData] = useState<DeviceLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');

  const fetchLocation = useCallback(async () => {
    setStatus('loading');

    const { status: perm } = await Location.requestForegroundPermissionsAsync();
    if (perm !== Location.PermissionStatus.GRANTED) {
      setStatus('denied');
      return;
    }

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const cityState = [place?.city, place?.region].filter(Boolean).join(', ');
      setData({
        country: place?.isoCountryCode ?? place?.country ?? '',
        cityState,
        timeZone: getTimeZoneLabel(),
      });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void fetchLocation();
  }, [fetchLocation]);

  return { data, status, refresh: fetchLocation };
}
