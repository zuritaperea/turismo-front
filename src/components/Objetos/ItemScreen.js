import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams, useLocation } from 'react-router-dom';
import service from '../../axios/services/service';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from '../../components/Carousel';
import FechasHorarios from './FechasHorarios';
import Contacto from './Contacto';
import Certificaciones from './Certificaciones';
import Alert from '../Alert';
import Splash from '../../components/Splash';
import SeccionConTitulo from './SeccionConTitulo';
import Servicios from './Servicios';
import Recomendaciones from './Recomendaciones';
import Mapa from './Mapa.js';
import ListaProductosTuristicos from '../ListaProductosTuristicos.jsx';
import ObjetoOpinion from './ObjetoOpinion.js';
import RangoPrecios from './RangoPrecios.js';
import EncabezadoAtractivo from '../EncabezadoAtractivo.jsx';
import serviceInteraccion from '../../axios/services/interacciones.js';

import { SeccionDescripcionMultilingue } from '../DescripcionBilingue.jsx';
import TablaPuntosCircuito from './TablaPuntosCircuito.js';
const toLocalMidnight = (isoString) => {
  const utcDate = new Date(isoString);
  const localDate = new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(), // <-- mantiene la "fecha" original
    0, 0, 0
  );
  return localDate;
};

function ItemScreen({ tipoObjeto }) {
  const { id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [cantidad, setCantidad] = useState(null);
  const [esPasaporte, setPasaporte] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");

    if (queryParams.get("fechadesde"))
      setFechaDesde(toLocalMidnight(queryParams.get("fechadesde")));
    if (queryParams.get("fechahasta"))
      setFechaHasta(toLocalMidnight(queryParams.get("fechahasta")));

    setCantidad(queryParams.get("cantidad"));
    setPasaporte(queryParams.get("pasaporte") === "true");

    if (item && item.id && source === "QR") {
      const data = {
        content_type: item.attributes?.content_type,
        object_id: item.id,
        latitude: null,
        longitude: null,
      };

      serviceInteraccion.generarInteraccionQR(data)
        .then((response) => {
          console.log("Interacción QR generada:", response);
        })
        .catch((error) => {
          console.error("Error generando interacción QR:", error);
        });
    }
  }, [location.search, item]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);


  useEffect(() => {

    const obtenerItem = async () => {
      try {
        setLoadingItems(true)
        const datosItem = await service.obtenerDatos(tipoObjeto, id);
        setItem(datosItem);
        setLoading(false);
      } catch (error) {
        setError('Hubo un error al cargar el item');
        setLoading(false);
      }
    };
    const obtenerItems = async () => {
      try {
        setLoadingItems(true)
        const datosItems = await service.obtenerTodos(tipoObjeto);
        setItems(datosItems);
        setLoadingItems(false);

      } catch (error) {
        setLoadingItems(false);

      }
    };
    obtenerItem();

    obtenerItems();
  }, [id, tipoObjeto]);

  const manejarInteraccionRed = async (red) => {
    const data = {
      content_type: item.attributes?.content_type,
      object_id: item.id,
      latitude: null,
      longitude: null,
    };

    try {
      const response = await serviceInteraccion.generarInteraccionRedes(data);
      console.log("Interacción Redes generada:", response);
    } catch (error) {
      console.error("Error generando interacción Redes:", error);
    }
  };

  if (loading) {
    return <Splash />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
      </Alert>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <>
      <Header />
      <EncabezadoAtractivo item={item} redesSociales={item.attributes.redes_sociales} onClickRed={manejarInteraccionRed} 
      inicio={item.attributes.start_date} final={item.attributes.end_date}/>
      <div className="container mt-20 mx-auto p-4 pt-28">
        <div className="pb-4 mt-40 lg:mt-1">
          <SeccionDescripcionMultilingue
            titulo="Descripción"
            descripcion={item.attributes.description}
          />
          {item.attributes.contenidos && item.attributes.contenidos.length > 1 && (
            <div className="w-full max-w-[1376px] mx-auto my-10 mb-20">
              <Carousel images={item.attributes?.contenidos} detail={true} imagePrincipalUrl={item.attributes.image_url
                ? process.env.REACT_APP_API_URL + item.attributes.image_url
                : process.env.REACT_APP_IMAGE_DEFAULT} />
            </div>
          )}
          {item.attributes.productos_turisticos?.length > 0 && (
            <ListaProductosTuristicos listData={item.attributes.productos_turisticos}
              fechaDesde={fechaDesde} fechaHasta={fechaHasta} cantidadPersonas={cantidad} esPasaporte={esPasaporte}
              tipoObjeto={tipoObjeto} />
          )}
          {item.attributes.puntos && Object.keys(item.attributes.puntos).length > 0 && (
            <TablaPuntosCircuito puntos={item.attributes.puntos} />
          )}

          {item.attributes.amenity_feature && Object.keys(item.attributes.amenity_feature).length > 0 && <Servicios services={item.attributes.amenity_feature} />}

          <div className="mb-20">
            {item.attributes.opening_hours && Object.keys(item.attributes.opening_hours).length > 0 && (
              <FechasHorarios item={item} tipoObjeto={tipoObjeto} />
            )}
            {(item.attributes.telefonos?.length > 0 ||
              item.attributes.correos_electronicos?.length > 0 ||
              item.attributes.url) && (
                <Contacto
                  contactoData={{
                    telefonos: item.attributes.telefonos,
                    correos_electronicos: item.attributes.correos_electronicos,
                    url: item.attributes.url,
                  }}
                />
              )}
          </div>
          <RangoPrecios item={item} />

          {item.attributes.certificaciones && item.attributes.certificaciones.length > 0 && (
            <Certificaciones item={item} />
          )}

          {item.attributes.street_address && <SeccionConTitulo titulo="Dirección" contenido={item.attributes.street_address} />}
          {item.attributes.puntos && Object.keys(item.attributes.puntos).length > 0 && (
            <Mapa
              objetosFiltrados={item.attributes.puntos.map((punto) => ({
                id: punto.contenido.id,
                title: punto.contenido.name,
                coordinates: punto.contenido.point,
              }))}
            />
          )}

          {item.attributes.point && (
            <Mapa
              objetosFiltrados={[
                {
                  id: item.id,
                  title: item.attributes.name,
                  coordinates: item.attributes.point,
                },
              ]}
            />
          )}
          <ObjetoOpinion objeto={{
            puntuacion: item.attributes.evaluation,
            evaluaciones: item.attributes.evaluaciones,
          }} />

          <Recomendaciones items={items} tipoObjeto={tipoObjeto} objectId={item.id} />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ItemScreen;
