import React, { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from '../axios/services/atractivo';


import { Link, useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Card from '../components/Card';
import TagsList from '../components/TagsList';
import Estrellas from '../components/Items/Estrellas';
import OpeningHours from '../components/OpeningHours';


function AtractivoScreen() {
  const { id, fechadesde, fechahasta } = useParams();
  const [atractivo, setAtractivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atractivos, setAtractivos] = useState([]);

  const [loadingAtractivos, setLoadingAtractivos] = useState(true);

  useEffect(() => {
    const obtenerAtractivo = async () => {
      try {
        const response = await service.obtener(id);
        const datosAtractivo = {
          ...response.data.data,
          fechadesde: fechadesde,
          fechahasta: fechahasta,
          image: response.data.data.attributes.image_url
          ? process.env.REACT_APP_API_URL + response.data.data.attributes.image_url
          : process.env.REACT_APP_IMAGE_DEFAULT,     
         tipo: "atractivo"
        };
        setAtractivo(datosAtractivo);

        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el atractivo');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };


    const obtenerAtractivos = async () => {
      try {
        const response = await service.obtenerTodos();
        const atracciones = response.data.data.map((obj) => {
          return {
            id: obj.id,
            title: obj.attributes.name,
            image: obj.attributes.image_url
              ? process.env.REACT_APP_API_URL + obj.attributes.image_url
              : process.env.REACT_APP_IMAGE_DEFAULT,
            puntuacion: obj.attributes.evaluation,
            favorito: obj.attributes.favorite,
            coordinates: obj.attributes.point,
            tourist_type: obj.attributes.tourist_type,
    
            type:obj.type
          };
        });
        setAtractivos(atracciones);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };

    obtenerAtractivos();
    obtenerAtractivo(); // Llama a la función para obtener el atractivo
  }, [id, fechadesde, fechahasta]);







  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
      </Alert>
    );
  }

  if (!atractivo) {
    return null;
  }

  return (<>
    <Header />

    <div className="w-full h-64 bg-gray-300">
      <img className="w-full object-cover object-center	h-64" src={atractivo.image} alt="Imagen 1" />
    </div>

    <div className="container mx-auto p-4">

      <div className="pb-4">
        <div className="botones float-right hidden sm:block">
          <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg mr-2">
            <i className="fa-regular fa-star"></i>
                        Calificar</button>
          <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg">
            <i className="fa-solid fa-arrow-up-right-from-square"></i>                        Compartir</button>

        </div>

        <div className="pb-3 text-center lg:text-left">
          <h2 className="text-sm font-semibold mt-2 color-principal">
          {atractivo?.attributes?.type_attractive}
          </h2>
          <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
            {atractivo?.attributes?.name}
          </h1>
          <div className="space-x-1 mt-2 p-2 flex justify-center lg:justify-start	">
          <TagsList tags= {atractivo?.attributes?.tourist_type} /> 

          </div>
          <Estrellas puntuacion={atractivo?.attributes?.puntuacion} size={'sm'} />
          <span className="puntacion font-semibold mx-1">{atractivo?.attributes?.puntuacion}</span>
        </div>

        <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
          Descripción
        </div>
        <div className="descripcion whitespace-pre-line">        {atractivo?.attributes?.description}

        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
          Dirección
        </div>
        <div className="descripcion">        {atractivo?.attributes?.street_address}

        </div>

        <Carousel images= {atractivo?.attributes?.contenidos} />

        <div className="grid grid-cols-1 md:grid-cols-3">
          <div id="horarios">
            <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
              Horarios
            </div>
          <OpeningHours openingHoursText={atractivo?.attributes?.opening_hours}/>
          </div>
          <div id="contacto">
            <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
              Contacto
            </div>
            <div className="flex descripcion">
              <img src="assets/img/phone.png" className="mr-3" />+54 9 223 521 9100
            </div>
            <div className="flex descripcion">
              <img src="assets/img/mail-03.png" className="mr-3" />info@mabubusiness.br
            </div>
            <div className="flex descripcion">
              <img src="assets/img/link-01.png" className="mr-3" />mabubusiness.br
            </div>
          </div>
          <div id="redes">
            <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
              Redes sociales
            </div>

            <div className="flex">
              <img src="assets/img/x-button.png" className="mr-2" />
              <img src="assets/img/fb-button.png" className="mr-2" />
              <img src="assets/img/in-button.png" className="mr-2" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl pl-4 pb-4 mt-4">
          <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
            Certificaciones y premios
          </div>
          <div className="descripcion">
          {atractivo?.attributes?.certifications}          </div>
          <div className="descripcion">
          {atractivo?.attributes?.certifications}          </div>
        </div>
        <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
          Información de la empresa
        </div>
        <ul className="descripcion list-disc ml-10">
          <li>Nombre legal: Razón social SRL</li>
          <li>ID: 30253458769</li>
        </ul>
        <div className="botones float-right sm:hidden">
          <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg mr-2">
            <i className="fa-regular fa-star"></i>
                        Calificar</button>
          <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg">
            <i className="fa-solid fa-arrow-up-right-from-square"></i>                        Compartir</button>

        </div>

        <div className="py-4">
          <div className="py-4">
            <div className="text-3xl font-semibold text-slate-900 tracking-tight dark:text-slate-200 mb-4">
              También puede interesarte...
            </div>
      <div className="slider-horizontal flex space-x-4 overflow-x-auto 2xl:justify-center pl-10">
        {atractivos.map((item, index) => (
                    <Link key={item.id} to={`/atractivo/${item.id}`}>

            <Card key={item.id} imgSrc={item.image} title={item.title} category={item.type} description={item.description} tags={item.tourist_type} puntuacion={item.puntuacion} />
            </Link>
          ))}
      </div>
 
          </div>
        </div>
      </div>
    </div>

    <Footer /></>
  );
}

export default AtractivoScreen;
