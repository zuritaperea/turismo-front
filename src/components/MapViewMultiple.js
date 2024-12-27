import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'; // Agrega esta importación

function MapViewMultiple({ markers, height }) {
    const [map, setMap] = useState(null)

    useEffect(() => {
        if (map && markers.length > 0) {
            const bounds = L.latLngBounds(markers.map((marker) => [marker.latitud, marker.longitud]));
            map.fitBounds(bounds);
        }
    }, [markers, map]);


    return (
        <MapContainer center={[0,0]} zoom={10} style={{ height: height ? height : "400px" }}         ref={setMap}
            doubleClickZoom={true}
            scrollWheelZoom={false}>
            <TileLayer
                url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
                attribution='<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
            />
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.latitud, marker.longitud]}>
                    <Popup><a href={marker.to}>{marker.title}</a></Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapViewMultiple;
