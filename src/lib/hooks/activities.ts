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
    if (!latitude || !longitude) {
      return;
    }

    async function fetchActivities() {
      try {
        setLoading(true);
        const res = await fetchWithAuth(
          `/api/activities?lat=${latitude}&lng=${longitude}`,
        );
        const data = await res.json();
        setActivities(data.data || data || []);
        setLoading(false);
      } catch (error) {
        setActivities([]);
        setLoading(false);
      }
    }

    fetchActivities();
  }, [latitude, longitude]);

  return { activities, loading };
}
