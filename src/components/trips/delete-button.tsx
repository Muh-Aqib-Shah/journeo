// Client component

'use client';

import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/auth';

async function deleteTrip(tripId: number) {
  const res = await fetchWithAuth('/api/my-trips/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tripId }),
  });

  if (!res.ok) return false;
  return true;
}

export function DeleteTripButton({ tripId }: { tripId: number }) {
  return (
    <Button
      className="bg-red-500"
      onClick={async () => {
        await deleteTrip(tripId);
        window.location.reload();
      }}
    >
      Delete
    </Button>
  );
}
