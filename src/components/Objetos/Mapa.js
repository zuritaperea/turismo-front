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
  const position = [
    parseFloat(process.env.REACT_APP_DEFAULT_LAT) || -25.441105,
    parseFloat(process.env.REACT_APP_DEFAULT_LNG) || -49.276855
  ];

  return (
    <div className="h-80 mx-auto rounded-lg overflow-hidden md:mt-5 lg:mt-5 my-5 z-10 mb-20">
      <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
        <MapContainer center={position} zoom={14} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            url={process.env.REACT_APP_TILE_LAYER_URL || "https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"}
            attribution={process.env.REACT_APP_TILE_LAYER_ATTRIBUTION || '&copy; <a href="https://carto.com/">Carto</a>'}
          />
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
    </div>
  );
};

export default Mapa;
