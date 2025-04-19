import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import service from '../../axios/services/service';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from '../../components/Carousel';
import TagsList from '../../components/TagsList';
import BotonesAccion from './BotonesAccion';
import FechasHorarios from './FechasHorarios';
import Contacto from './Contacto';
import Certificaciones from './Certificaciones';
import Alert from '../Alert';
import Splash from '../../components/Splash';
import SeccionConTitulo from './SeccionConTitulo';
import Servicios from './Servicios';
import Recomendaciones from './Recomendaciones';
import { AuthContext } from '../../components/AuthContext';
import Mapa from './Mapa.js';
import ActividadesListaPresentacion from '../EventosProductosLista.jsx';
import SocialLinks from '../SocialLinks.js';
import ObjetoOpinion from './ObjetoOpinion.js';
import RangoPrecios from './RangoPrecios.js';
import EncabezadoAtractivo from '../EncabezadoAtractivo.jsx';
import serviceInteraccion from '../../axios/services/interacciones.js';

import { SeccionDescripcionMultilingue } from '../DescripcionBilingue.jsx';

function ItemScreen({ tipoObjeto }) {
  const { id, fechadesde, fechahasta } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [atractivoData, setAtractivoData] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");
    console.log(queryParams)
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
        const datosItem = await service.obtenerDatos(tipoObjeto, id, fechadesde, fechahasta);
        setItem(datosItem);
        setLoading(false);
      } catch (error) {
        setError('Hubo un error al cargar el item');
        setLoading(false);
      }
    };
    const obtenerItems = async () => {
      try {
        const datosItems = await service.obtenerTodos(tipoObjeto);
        setItems(datosItems);
        setLoadingItems(false);

      } catch (error) {
        setLoadingItems(false);

      }
    };
    obtenerItem();

    obtenerItems();
  }, [id, fechadesde, fechahasta, tipoObjeto]);

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
      <EncabezadoAtractivo item={item} />
      <div className="container  mt-62 lg:mt-20 mx-auto p-4 pt-28">
        <div className="pb-4 mt-40 lg:mt-1">
          <SeccionDescripcionMultilingue
            titulo="Descripción"
            descripcion={item.attributes.description}
          />
          {item.attributes.contenidos && item.attributes.contenidos.length > 1 && (
            <div className="w-full max-w-[1376px] mx-auto my-10">
              <Carousel images={item.attributes?.contenidos} detail={true} imagePrincipalUrl={item.attributes.image_url
                ? process.env.REACT_APP_API_URL + item.attributes.image_url
                : process.env.REACT_APP_IMAGE_DEFAULT} />
            </div>
          )}
          {/* {item.attributes.productos_turisticos?.length > 0 && (
            <ActividadesListaPresentacion listData={item.attributes.productos_turisticos} />
          )} */}
          <SeccionConTitulo titulo="Dirección" contenido={item.attributes.street_address} />
          {/* {item.attributes.point && (
            <Mapa
              objetosFiltrados={[
                {
                  id: item.id,
                  title: item.attributes.name,
                  coordinates: item.attributes.point,
                },
              ]}
            />
          )} */}
          {item.attributes.amenity_feature && <Servicios servicios={item.attributes.amenity_feature} />}

          <div className="grid grid-cols-1 md:grid-cols-3">
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
            <SocialLinks redes={item.attributes.redes_sociales} />
          </div>
          <RangoPrecios item={item} />

          {item.attributes.certificaciones && item.attributes.certificaciones.length > 0 && (
            <Certificaciones item={item} />
          )}

          <Recomendaciones items={items} tipoObjeto={tipoObjeto} objectId={item.id} />
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
          {/* <ObjetoOpinion objeto={{
            puntuacion: item.attributes.evaluation,
            evaluaciones: item.attributes.evaluaciones,
          }} /> */}
          {/* <BotonesAccion contentType={item.attributes.content_type} objectId={item.id}
            className="block sm:hidden w-full flex items-center justify-center" /> */}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ItemScreen;
