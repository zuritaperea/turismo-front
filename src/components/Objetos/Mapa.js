import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import Col from "../Col";
import { Icon, latLngBounds } from "leaflet";
import markerIconShadowPng from "leaflet/dist/images/marker-shadow.png";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const Mapa = ({ objetosFiltrados }) => {

  const position = [-25.441105, -49.276855];
  const defaultIcon = new Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: markerIconShadowPng,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (objetosFiltrados.length > 0 && mapRef.current) {
      const coordinates = objetosFiltrados.map((item) => [
        item.coordinates.latitude,
        item.coordinates.longitude,
      ]);
      const bounds = latLngBounds(coordinates);
      mapRef.current.flyToBounds(bounds, {
        padding: [50, 50],
      });
    }
  }, [objetosFiltrados]);

  return (
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          {objetosFiltrados.map(({ id, title, coordinates }) =>
          coordinates ? (
            <Marker
              key={id}
              icon={defaultIcon}
              position={[coordinates.latitude, coordinates.longitude]}
            >
              <Popup>{title}</Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
  );
};

export default Mapa;
