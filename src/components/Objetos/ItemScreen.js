// src/screens/ItemScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import serviceGeneral from '../../axios/services/service';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from '../../components/Carousel';
import TagsList from '../../components/TagsList';
import BotonesAccion from './BotonesAccion';
import FechasHorarios from './FechasHorarios';
import Contacto from './Contacto';
import RedesSociales from './RedesSociales';
import Certificaciones from './Certificaciones';
import Alert from '../Alert';
import Splash from '../../components/Splash';
import SeccionConTitulo from './SeccionConTitulo';
import Servicios from './Servicios';
import Recomendaciones from './Recomendaciones';
import FiltrosBusqueda from './FiltrosBusqueda';
import ActividadesLista from '../ActividadesFidiLista.js';
import { AuthContext } from '../../components/AuthContext';
import Mapa from './Mapa.js';
import ActividadesListaPresentacion from '../EventosProductosLista.jsx';
import service from '../../axios/services/atractivo.js';

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

  const handleReserva = () => {
    if (!selectedDate) return;
    if (!user) {
      navigate('/login');
    } else {
      navigate('/confirmacion-reserva');
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Función de transformación para adaptar la respuesta al formato que espera ActividadesListaPresentacion
  // Como el atractivo no posee start_date ni end_date, asignamos valores por defecto.
  const transformAtractivoResponse = (response) => {
    const data = response.data.data;
    const defaultStart = "2025-03-19T09:00:00-03:00";
    const defaultEnd = "2025-03-19T18:00:00-03:00";
    return {
      data: {
        data: [
          {
            id: data.id,
            attributes: {
              name: data.attributes.name,
              start_date: data.attributes.opening_hours?.start || defaultStart,
              end_date: data.attributes.opening_hours?.end || defaultEnd,
              location: data.attributes.street_address,
              image_url: data.attributes.image_url
                ? process.env.REACT_APP_API_URL + data.attributes.image_url
                : process.env.REACT_APP_IMAGE_DEFAULT,
              // Se incluye este objeto interno para que el componente pueda formatear las horas
              objeto: {
                attributes: {
                  start_date: data.attributes.opening_hours?.start || defaultStart,
                  end_date: data.attributes.opening_hours?.end || defaultEnd,
                },
              },
            },
          },
        ],
      },
    };
  };

  useEffect(() => {
    const obtenerProductoTuristico = async () => {
      try {
        const response = await service.obtenerProductoTuristicoPorId(id);
        if (!response || !response.data || !response.data.data) {
          throw new Error("Datos inválidos recibidos de la API");
        }
        const transformData = transformAtractivoResponse(response);
        setAtractivoData(transformData);
        setItem(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error obteniendo el producto turístico:", error);
        setError("Hubo un error al cargar el producto turístico");
        setLoading(false);
      }
    };

    const obtenerItems = async () => {
      try {
        const datosItems = await serviceGeneral.obtenerTodos(tipoObjeto);
        setItems(datosItems);
        setLoadingItems(false);
      } catch (error) {
        setLoadingItems(false);
      }
    };

    obtenerItems();
    obtenerProductoTuristico();
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
      <div className="w-full max-w-[1376px] mx-auto p-4">
        <img
          className="w-full h-64 object-cover object-center rounded-xl shadow-md"
          src={item.attributes.image_url
            ? process.env.REACT_APP_API_URL + item.attributes.image_url
            : process.env.REACT_APP_IMAGE_DEFAULT}
          alt="Imagen 1"
        />
      </div>

      <div className="container mx-auto p-4">
        <div className="pb-4">
          <BotonesAccion />
          <div className="pb-3 text-center lg:text-left">
            <h2 className="text-sm font-semibold mt-2 color-principal">
              {item.attributes.type}
            </h2>
            <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
              {item.attributes.name}
            </h1>
            <div className="space-x-1 mt-2 mb-5 flex justify-center lg:justify-start">
              <TagsList tags={item.attributes.tourist_type} />
            </div>
            <span className="puntacion font-semibold mx-1">
              {item.attributes.evaluation}
            </span>

            {location.pathname.includes('/alojamiento/') && <FiltrosBusqueda />}
          </div>

          {tipoObjeto === "atractivo" && item.attributes.external_id && (
            <ActividadesLista idAtractivo={item.attributes.external_id} />
          )}

          {/* Se muestra ActividadesListaPresentacion solo si se obtuvo y transformó la data */}
          {atractivoData && <ActividadesListaPresentacion listData={atractivoData} />}

          <SeccionConTitulo titulo="Descripción" contenido={item.attributes.description} />
          <SeccionConTitulo titulo="Dirección" contenido={item.attributes.street_address} />
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

          {item.attributes.amenity_feature && <Servicios servicios={item.attributes.amenity_feature} />}

          {item.attributes.contenidos && item.attributes.contenidos.length > 1 && (
            <div className="w-full max-w-[1376px] mx-auto">
              <Carousel images={item.attributes.contenidos} detail={true} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3">
            <FechasHorarios item={item} tipoObjeto={tipoObjeto} />
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
            <RedesSociales idAtractivo={item.id} />
          </div>

          {item.attributes.certificaciones && item.attributes.certificaciones.length > 0 && (
            <Certificaciones item={item} />
          )}

          <Recomendaciones />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ItemScreen;
