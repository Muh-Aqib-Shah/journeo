'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import type { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 19,
};

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function RecenterMap({ posix }: { posix: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(posix);
  }, [posix, map]);

  return null;
}

export default function TripMap(props: MapProps) {
  const { posix, zoom } = props;

  return (
    <MapContainer
      center={posix}
      zoom={zoom || defaults.zoom}
      scrollWheelZoom={false}
      className="z-0 h-[540px] w-full rounded-xl"
    >
      <RecenterMap posix={posix} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={posix} icon={redIcon}>
        <Popup>Netherlands</Popup>
      </Marker>
    </MapContainer>
  );
}
