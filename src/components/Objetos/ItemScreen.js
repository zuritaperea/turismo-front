// src/screens/ItemScreen.js
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
import RedesSociales from './RedesSociales';
import Certificaciones from './Certificaciones';
import Alert from '../Alert';
import Splash from '../../components/Splash';
import SeccionConTitulo from './SeccionConTitulo';
import Servicios from './Servicios';
import Recomendaciones from './Recomendaciones';
import FiltrosBusqueda from './FiltrosBusqueda';
import { AuthContext } from '../../components/AuthContext';
import Mapa from './Mapa.js';
import ActividadesListaPresentacion from '../EventosProductosLista.jsx';
import serviceProducto from '../../axios/services/producto_turistico.js';

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

          </div>


          {/* Listado de productos */}
          {item.attributes.productos_turisticos?.length > 0 && (
            <ActividadesListaPresentacion listData={item.attributes.productos_turisticos} />
          )}
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
