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
import ListaProductosTuristicos from './ProductoTuristico/ListaProductosTuristicos.js';
import ObjetoOpinion from './ObjetoOpinion.js';
import RangoPrecios from './RangoPrecios.js';
import EncabezadoAtractivo from '../EncabezadoAtractivo.jsx';
import serviceInteraccion from '../../axios/services/interacciones.js';

import { SeccionDescripcionMultilingue } from '../DescripcionBilingue.jsx';
import TablaPuntosCircuito from './TablaPuntosCircuito.js';
import { useTranslation } from 'react-i18next';
import { useSeoConfig } from '../../extras/useSeoConfig.js';
import SEOHelmet from '../SEOHelmet.js';
import RecomendacionesPorDestino from './RecomendacionesPorDestino.js';

const toLocalMidnight = (isoString) => {
  const utcDate = new Date(isoString);
  const localDate = new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
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
  const { t } = useTranslation();
  const { description: globalDescription } = useSeoConfig();

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
      <SEOHelmet
        customTitle={`${item.attributes.name} | ${process.env.REACT_APP_DOCUMENT_TITLE}`}
        customDescription={item.attributes.description}
        customImage={
          item.attributes.image_url
            ? process.env.REACT_APP_API_URL + item.attributes.image_url
            : process.env.REACT_APP_IMAGE_DEFAULT
        }
      />
      <Header />
      <EncabezadoAtractivo item={item} redesSociales={item.attributes.redes_sociales} onClickRed={manejarInteraccionRed}
        inicio={item.attributes.start_date} final={item.attributes.end_date} />
      <div className="container mt-20 mx-auto p-4 pt-28">
        <div className="pb-4 mt-40 lg:mt-1">
          <div className=" animate__fadeInUp">
            <SeccionDescripcionMultilingue
              titulo={t("common.descripcion")}
              descripcion={item.attributes.description}
            />
          </div>
          {item.attributes.location && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.location")}
                contenido={item.attributes.location}
              />
            </div>
          )}

          {item.attributes.contenidos && item.attributes.contenidos.length > 1 && (
            <div className="w-full max-w-[1376px] mx-auto my-10 mb-20  animate__zoomIn animate__delay-1s">
              <Carousel
                images={item.attributes?.contenidos}
                detail={true}
                imagePrincipalUrl={
                  item.attributes.image_url
                    ? process.env.REACT_APP_API_URL + item.attributes.image_url
                    : process.env.REACT_APP_IMAGE_DEFAULT
                }
              />
            </div>
          )}
          {item.attributes.productos_turisticos?.length > 0 && (
            <div className=" animate__fadeInUp animate__delay-2s">
              <ListaProductosTuristicos
                listData={item.attributes.productos_turisticos}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                cantidadPersonas={cantidad}
                esPasaporte={esPasaporte}
                tipoObjeto={tipoObjeto}
                inicio={item.attributes.start_date}
                final={item.attributes.end_date}
              />
            </div>
          )}

          {item.attributes.puntos && Object.keys(item.attributes.puntos).length > 0 && (
            <div className=" animate__fadeInLeft animate__delay-2s">
              <TablaPuntosCircuito puntos={item.attributes.puntos} />
            </div>
          )}

          {item.attributes.amenity_feature && Object.keys(item.attributes.amenity_feature).length > 0 && (
            <div className=" animate__fadeIn animate__delay-3s">
              <Servicios services={item.attributes.amenity_feature} />
            </div>
          )}

          <div className="mb-20  animate__fadeInUp animate__delay-3s">
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
          {item.attributes.certificaciones?.length > 0 && (
            <div className=" animate__fadeIn animate__delay-4s">
              <Certificaciones item={item} />
            </div>
          )}

          {item.attributes.street_address && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.direccion")}
                contenido={item.attributes.street_address}
              />
            </div>
          )}

          {item.attributes.distance_beach && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.distance_beach")}
                contenido={item.attributes.distance_beach}
              />
            </div>
          )}

          {item.attributes.duration && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.duration")}
                contenido={item.attributes.duration}
              />
            </div>
          )}

          {item.attributes.departures && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.departures")}
                contenido={item.attributes.departures}
              />
            </div>
          )}

          {item.attributes.guided && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.guided")}
                contenido={t("common.yes")}
              />
            </div>
          )}

          {item.attributes.accessible && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.accessible")}
                contenido={t("common.yes")}
              />
            </div>
          )}

          {item.attributes.allows_pets && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.allows_pets")}
                contenido={t("common.yes")}
              />
            </div>
          )}

          {item.attributes.includes && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.includes")}
                contenido={item.attributes.includes}
              />
            </div>
          )}

          {item.attributes.does_not_include && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.does_not_include")}
                contenido={item.attributes.does_not_include}
              />
            </div>
          )}

          {item.attributes.recommendations && (
            <div className="animate__fadeIn animate__delay-4s">
              <SeccionConTitulo
                titulo={t("common.recommendations")}
                contenido={item.attributes.recommendations}
              />
            </div>
          )}

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

          {tipoObjeto === "destino" && (
            <div className="animate__fadeInUp animate__delay-6s">
              <RecomendacionesPorDestino destinoId={item.id} />
            </div>
          )}

          <div className=" animate__fadeIn animate__delay-6s">
            <ObjetoOpinion
              objeto={{
                puntuacion: item.attributes.evaluation,
                evaluaciones: item.attributes.evaluaciones,
              }}
            />
          </div>

          <div className=" animate__fadeInUp animate__delay-6s">
            <Recomendaciones items={items} tipoObjeto={tipoObjeto} objectId={item.id} />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default ItemScreen;
