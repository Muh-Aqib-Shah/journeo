'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Trip {
  trip_id: number;
  destination: string;
  start_date: string;
  end_date: string;
}

export default function DeleteTripsComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, [isOpen]);

  const fetchTrips = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/trips/delete-multiple');
      const data = await res.json();

      if (data.success) {
        setTrips(data.trips);
      } else {
        toast.error('Failed to fetch trips');
      }
    } catch (err) {
      toast.error('Error fetching trips');
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleToggleTrip = (tripId: number) => {
    setSelectedTrips((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTrips.length === trips.length) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(trips.map((t) => t.trip_id));
    }
  };

  const handleDelete = async () => {
    if (selectedTrips.length === 0) {
      toast.error('Please select at least one trip');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedTrips.length} trip(s)? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await fetch('/api/trips/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripIds: selectedTrips }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setSelectedTrips([]);
        setIsOpen(false);
        fetchTrips();
      } else {
        toast.error(data.message || 'Failed to delete trips');
      }
    } catch (err) {
      toast.error('Error deleting trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Delete Trips
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Trips</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {fetching ? (
              <p className="text-center text-gray-500">Loading trips...</p>
            ) : trips.length === 0 ? (
              <p className="text-center text-gray-500">No trips found</p>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b pb-3">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={
                      selectedTrips.length === trips.length && trips.length > 0
                    }
                    onChange={handleSelectAll}
                    className="size-4 cursor-pointer"
                  />
                  <label
                    htmlFor="select-all"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Select All
                  </label>
                </div>

                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {trips.map((trip) => (
                    <div
                      key={trip.trip_id}
                      className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <input
                        type="checkbox"
                        id={`trip-${trip.trip_id}`}
                        checked={selectedTrips.includes(trip.trip_id)}
                        onChange={() => handleToggleTrip(trip.trip_id)}
                        className="mt-1 size-4 cursor-pointer"
                      />
                      <label
                        htmlFor={`trip-${trip.trip_id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="text-sm font-medium">
                          {trip.destination}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(trip.start_date).toLocaleDateString()} -{' '}
                          {new Date(trip.end_date).toLocaleDateString()}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={selectedTrips.length === 0 || loading}
            >
              {loading ? 'Deleting...' : 'Delete Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
