import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ latitud, longitud, name, height }) {
  const position = [latitud, longitud];
  // Verificar si latitud y longitud son válidos antes de renderizar el componente
  if (latitud === null || longitud === null || latitud === undefined || longitud === undefined) {
    return null; // Si latitud o longitud son nulos, no se renderiza nada
  }
  
  return (
    <MapContainer center={position} zoom={15} style={{ height: height?height:"400px"} }         doubleClickZoom={true}
    scrollWheelZoom={false}>
      <TileLayer
        url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
        attribution='<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
      />
      <Marker position={position}>
        <Popup><div>
          <b>{name}</b>
          <br />
          <a href={`http://maps.google.com/maps?q=${latitud},${longitud}`}>
            Ver en Google Maps
          </a>
        </div></Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;
