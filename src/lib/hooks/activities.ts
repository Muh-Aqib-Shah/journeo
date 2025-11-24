import { useEffect, useState } from 'react';

export function useActivities(lat: number, lng: number) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchActivities() {
      setLoading(true);
      const res = await fetch(`/api/activities?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setActivities(data.data || []);
      setLoading(false);
    }

    fetchActivities();
  }, [lat, lng]);

  return { activities, loading };
}
