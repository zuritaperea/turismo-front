import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { Icon, latLngBounds } from "leaflet";
import markerIconShadowPng from "leaflet/dist/images/marker-shadow.png";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const defaultIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: markerIconShadowPng,
});

// Opciones de mapas
const TILES = {
  GoogleMaps: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
  OSM: "https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
};

const FitBounds = ({ objetosFiltrados }) => {
  const map = useMap();

  useEffect(() => {
    if (objetosFiltrados.length > 0) {
      const coordinates = objetosFiltrados
        .map((item) => item.coordinates)
        .filter((coord) => coord);

      if (coordinates.length > 0) {
        const bounds = latLngBounds(coordinates.map(coord => [coord.latitude, coord.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [objetosFiltrados, map]);

  return null;
};

const Mapa = ({ objetosFiltrados }) => {
  const position = [-25.441105, -49.276855];
  const [tileLayer, setTileLayer] = useState("GoogleMaps");

  return (
    <div className="h-80 w-11/12 mx-auto rounded-lg overflow-hidden md:mt-5 lg:mt-5 my-5 z-10">
      <select
        className="absolute top-2 right-2 bg-white p-2 rounded shadow-md text-xs hidden"
        value={tileLayer}
        style={{ zIndex: 401 }}
        onChange={(e) => setTileLayer(e.target.value)}
      >
        {Object.keys(TILES).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <MapContainer center={position} zoom={14} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap & Google' url={TILES[tileLayer]} />
        <FitBounds objetosFiltrados={objetosFiltrados} />
        {objetosFiltrados.map(({ id, title, coordinates }) =>
          coordinates ? (
            <Marker key={id} icon={defaultIcon} position={[coordinates.latitude, coordinates.longitude]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">{title}</h3>
                  <a
                    href={`http://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default Mapa;
