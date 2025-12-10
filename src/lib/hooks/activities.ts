import { useEffect, useState } from 'react';

import { fetchWithAuth } from '../auth';

export function useActivities({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    console.log('useActivities called with:', { latitude, longitude });
    if (!latitude || !longitude) {
      console.log('Missing coordinates, returning early');
      return;
    }

    async function fetchActivities() {
      try {
        console.log(`Fetching activities for lat=${latitude}&lng=${longitude}`);
        setLoading(true);
        const res = await fetchWithAuth(
          `/api/activities?lat=${latitude}&lng=${longitude}`,
        );
        console.log('Activities response status:', res.status);
        const data = await res.json();
        console.log('Activities data:', data);
        setActivities(data.data || data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
        setLoading(false);
      }
    }

    fetchActivities();
  }, [latitude, longitude]);

  return { activities, loading };
}
