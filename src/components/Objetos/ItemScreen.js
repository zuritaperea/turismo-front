import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import service from '../../axios/services/service';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from '../../components/Carousel';
import TagsList from '../../components/TagsList';
import Estrellas from '../../components/Items/Estrellas';
import BotonesAccion from './BotonesAccion';
import FechasHorarios from './FechasHorarios';
import Contacto from './Contacto';
import RedesSociales from './RedesSociales';
import RangoPrecios from './RangoPrecios';
import Certificaciones from './Certificaciones';
import InformacionEmpresa from './InformacionEmpresa';
import Alert from '../Alert';
import Splash from '../../components/Splash';
import SeccionConTitulo from './SeccionConTitulo'; // Importamos el nuevo componente
import Servicios from './Servicios'; // Importamos el nuevo componente de servicios
import BotonesCalificarYCompartir from './BotonesCalificarYCompartir'; // Importamos el nuevo componente de botones
import Recomendaciones from './Recomendaciones';

function ItemScreen({ tipoObjeto }) {
  const { id, fechadesde, fechahasta } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

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

    obtenerItems();
    obtenerItem();
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
          className="w-full h-64 object-cover object-center rounded-xl md:rounded-xl lg:rounded-xl shadow-md"
          src={item.image}
          alt="Imagen 1"
        />
      </div>


      <div className="container mx-auto p-4">
        <div className="pb-4">
          <BotonesAccion />
          <div className="pb-3 text-center lg:text-left">
            <h2 className="text-sm font-semibold mt-2 color-principal">{item?.attributes?.type}</h2>
            <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
              {item?.attributes?.name}
            </h1>
            <div className="space-x-1 mt-2 mb-5 flex justify-center lg:justify-start">
              <TagsList tags={item?.attributes?.tourist_type} />
            </div>
            <div className="flex items-center justify-center md:justify-start mt-2">
              <Estrellas puntuacion={item?.attributes?.puntuacion} size={'sm'} />
              <span className="puntacion font-semibold mx-1">{item?.attributes?.puntuacion}</span>
            </div>

            <span className="puntacion font-semibold mx-1">{item?.attributes?.puntuacion}</span>
          </div>

          <SeccionConTitulo titulo="Descripción" contenido={item?.attributes?.description} />
          <SeccionConTitulo titulo="Dirección" contenido={item?.attributes?.street_address} />

          {item?.attributes?.amenity_feature && <Servicios servicios={item?.attributes?.amenity_feature} />}

          <div className="w-full max-w-[1376px] mx-auto ">
            <Carousel images={item?.attributes?.contenidos} detail={true} />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3">
            <FechasHorarios item={item} tipoObjeto={tipoObjeto} />
            <Contacto />
            <RedesSociales />
          </div>
          {/* <RangoPrecios item={item} /> */}
          <Certificaciones item={item} />
          {/* <InformacionEmpresa item={item} /> */}

          <BotonesCalificarYCompartir item={item} />

          <Recomendaciones />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ItemScreen;
