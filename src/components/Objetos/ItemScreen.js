// src/screens/ItemScreen.js
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import service from '../../axios/services/service';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from '../../components/Carousel';
import Card from '../../components/Card';
import TagsList from '../../components/TagsList';
import Estrellas from '../../components/Items/Estrellas';
import OpeningHours from '../../components/OpeningHours';
import Alert from '../Alert';
import Splash from '../../components/Splash';
import Tags from './Tags';
import phone from '../../assets/img/phone.png';
import mail from '../../assets/img/mail-03.png';
import link from '../../assets/img/link-01.png';
import x_button from '../../assets/img/x-button.png';
import fb_button from '../../assets/img/fb-button.png';
import in_button from '../../assets/img/in-button.png';
import Fecha from '../Fecha';

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
      <div className="w-full h-64 bg-gray-300">
        <img className="w-full object-cover object-center h-64" src={item.image} alt="Imagen 1" />
      </div>

      <div className="container mx-auto p-4">
        <div className="pb-4">
          <div className="botones float-right hidden sm:block">
            <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg mr-2">
              <i className="fa-regular fa-star"></i> Calificar
            </button>
            <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Compartir
            </button>
          </div>

          <div className="pb-3 text-center lg:text-left">
            <h2 className="text-sm font-semibold mt-2 color-principal">{item?.attributes?.type}</h2>
            <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
              {item?.attributes?.name}
            </h1>
            <div className="space-x-1 mt-2 p-2 flex justify-center lg:justify-start">
              <TagsList tags={item?.attributes?.tourist_type} />
            </div>
            <Estrellas puntuacion={item?.attributes?.puntuacion} size={'sm'} />
            <span className="puntacion font-semibold mx-1">{item?.attributes?.puntuacion}</span>
          </div>

          <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
            Descripción
          </div>
          <div className="descripcion whitespace-pre-line">
            {item?.attributes?.description}
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
            Dirección
          </div>

          <div className="descripcion">{item?.attributes?.street_address}</div>

          {item?.attributes?.amenity_feature ? (
            <>
              <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                Servicios
              </div>

              <Tags elementos={item?.attributes?.amenity_feature}></Tags>
            </>
          ) : null}


          <Carousel images={item?.attributes?.contenidos} />

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div id="horarios">
              <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                {tipoObjeto === 'evento' ? 'Fechas' : 'Horarios'}
              </div>
              <OpeningHours openingHoursText={item?.attributes?.opening_hours} />
              {item?.attributes?.checkin_time ? (
                <>
                  <div className="descripcion">Check in: {item?.attributes?.checkin_time?.substring(0, 5)} hs</div>
                </>
              ) : null}
              {item?.attributes?.checkout_time ? (
                <>
                  <div className="descripcion">Check out: {item?.attributes?.checkout_time?.substring(0, 5)} hs</div>
                </>
              ) : null}
              <Fecha
                fecha={item?.attributes?.start_date}
                label="Fecha de inicio"
              />
              <Fecha
                fecha={item?.attributes?.end_date}
                label="Fecha de fin"
              />



            </div>
            <div id="contacto">
              <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                Contacto
              </div>
              <div className="flex descripcion">
                <img src={phone} className="mr-3" />+54 9 223 521 9100
              </div>
              <div className="flex descripcion">
                <img src={mail} className="mr-3" />info@mabubusiness.br
              </div>
              <div className="flex descripcion">
                <img src={link} className="mr-3" />mabubusiness.br
              </div>
            </div>
            <div id="redes">
              <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                Redes sociales
              </div>

              <div className="flex">
                <img src={x_button} className="mr-2" />
                <img src={fb_button} className="mr-2" />
                <img src={in_button} className="mr-2" />
              </div>
            </div>
          </div>
          {item?.attributes?.price_range ? (
            <>
              <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                Rango de Precios
              </div>

              <div className='descripcion'>{item?.attributes?.price_range}</div>
            </>
          ) : null}


          <div className="bg-white border border-gray-200 rounded-xl pl-4 pb-4 mt-4">
            <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
              Certificaciones y premios
            </div>
            <div className="descripcion">
              {item?.attributes?.certifications}          </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
            Información de la empresa
          </div>
          <ul className="descripcion list-disc ml-10">
            <li>{item?.attributes?.legal_name}   </li>
            <li>ID: {item?.attributes?.identifier_organization}   </li>
          </ul>
          <div className="botones float-right sm:hidden">
            <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg mr-2">
              <i className="fa-regular fa-star"></i>
              Calificar</button>
            <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: document.title, // El título de la página
                      text: item?.attributes?.name
                      , // El texto que acompañará el enlace
                      url: window.location.href, // La URL actual de la página
                    })
                    .catch((error) => console.log('Error sharing', error)); // Maneja errores si no es compatible
                } else {
                  // Si no es compatible con 'navigator.share', mostrar un fallback
                  alert('Tu navegador no es compatible con el compartir nativo.');
                }
              }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              Compartir</button>

          </div>

          <div className="py-4">
            <div className="text-3xl font-semibold text-slate-900 tracking-tight dark:text-slate-200 mb-4">
              También puede interesarte...
            </div>
            <div className="slider-horizontal flex space-x-4 overflow-x-auto pl-2">
              {items.map((item, index) => (
                <Link key={item.id} to={`/${tipoObjeto}/${item.id}`}>
                  <Card key={item.id} imgSrc={item.image} title={item.title} category={item.type} description={item.description} tags={item.tourist_type} puntuacion={item.puntuacion} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ItemScreen;
