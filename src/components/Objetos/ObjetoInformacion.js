import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Spin, Button } from "antd";
import Tags from "./Tags.js";
import TagsTexto from "../Objetos/TagsTexto";
import TagSolo from "../Objetos/TagSolo";
import { useSelector } from 'react-redux';

import Imagenes from "../Objetos/ImagenesModal";
import ImagenesAtractivos from "../Objetos/ImagenesAtractivo";

import Fecha from "../Objetos/Fecha";
import styles from "./styles.module.css";

const ObjetoInformacionScreen = ({ objeto, navigation, type }) => {
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.user);

    const openURL = (url) => {
        window.open(url, "_blank");
    };


    return (
        <div className={styles.tab}>
            {loading ? (
                <Spin tip="Cargando..." size="large" className="spinner" />
            ) : (
                <>
                    {objeto.start_date ? (
                        <div className={styles.cabeceraevento}>
                            <Fecha inicio={objeto.start_date} final={objeto.end_date} />
                            <div className={styles.audience}>{objeto.audience}</div>
                        </div>
                    ) : null}
                    <div className={styles.title}>Descripción</div>
                    <div>{objeto.description}</div>
                    {user?.auth?.access_token && user?.profile?.included?.persona && objeto.beneficios && objeto.beneficios.length > 0 ? (
                        <Button
                            className={styles.submitButtonStyle}
                            onClick={() =>
                                navigation("/beneficio", { items: objeto.beneficios })
                            }
                        >
                            Obtener Beneficio
                        </Button>
                    ) : null}
                    {objeto.main_attractions && objeto.main_attractions.length > 0 ? (
                        <Button
                            className={styles.submitButtonStyle}
                            onClick={() => {
                                navigation("/rutamapa", {
                                    state: {
                                        items: objeto.main_attractions,
                                        image: objeto.image,
                                        title: objeto.title,
                                        target: 'atractivo'
                                    }
                                })
                            }
                            }
                        >
                            Ver en mapa
                        </Button>
                    ) : null}
                    {objeto.event_class ? (
                        <div className={styles.title}>Tipo Evento</div>
                    ) : null}
                    {objeto.event_class?.map((item, index) => {
                        return <div key={index}>{item}</div>;
                    })}
                    {objeto.about ? (
                        <>
                            <div className={styles.title}>Tema</div>
                            <div>{objeto.about}</div>
                        </>
                    ) : null}
                    {objeto.contenidos && objeto.contenidos.length > 0 ? (
                        <>
                            <div className={styles.title}>Galería</div>
                            <Imagenes images={objeto.contenidos} />
                        </>
                    ) : null}
                    {objeto.sale_method ? (
                        <>
                            <div className={styles.title}>Método de venta</div>
                            <div>{objeto.sale_method}</div>
                        </>
                    ) : null}
                    {objeto.travel_agency_type ? (
                        <>
                            <div className={styles.title}>Tipología de Agencia</div>
                            <TagSolo texto={objeto.travel_agency_type} />
                        </>
                    ) : null}
                    {objeto.amenity_feature ? (
                        <>
                            <div className={styles.title}>Servicios de Alojamiento</div>
                            <Tags elementos={objeto.amenity_feature}></Tags>
                        </>
                    ) : null}
                    {objeto.checkin_time ? (
                        <>
                            <div className={styles.title}>Hora de ingreso</div>
                            <div>{objeto.checkin_time?.substring(0, 5)}</div>
                        </>
                    ) : null}
                    {objeto.checkout_time ? (
                        <>
                            <div className={styles.title}>Hora de salida</div>
                            <div>{objeto.checkout_time?.substring(0, 5)}</div>
                        </>
                    ) : null}
                    {objeto.accommodation_type ? (
                        <>
                            <div className={styles.title}>Tipo de Alojamiento</div>
                            <TagSolo texto={objeto.accommodation_type} />
                        </>
                    ) : null}
                    {objeto.rooms_type ? (
                        <>
                            <div className={styles.title}>Tipo de Habitaciones</div>
                            <TagsTexto elementos={objeto.rooms_type} />
                        </>
                    ) : null}
                    {objeto.relevance ? (
                        <>
                            <div className={styles.title}>Relevancia</div>
                            <TagsTexto elementos={objeto.relevance} />
                        </>
                    ) : null}
                    {objeto.visiting_time ? (
                        <>
                            <div className={styles.title}>Época de visita</div>
                            <div>{objeto.visiting_time}</div>
                        </>
                    ) : null}
                    {objeto.activities_inside && objeto.activities_inside.length > 0 ? (
                        <>
                            <div className={styles.title}>Actividades dentro</div>
                            <Tags elementos={objeto.activities_inside}></Tags>
                        </>
                    ) : null}
                    {objeto.activities_outside && objeto.activities_outside.length > 0 ? (
                        <>
                            <div className={styles.title}>Actividades fuera</div>
                            <Tags elementos={objeto.activities_outside}></Tags>
                        </>
                    ) : null}
                    {objeto.services_inside && objeto.services_inside.length > 0 ? (
                        <>
                            <div className={styles.title}>Servicios dentro</div>
                            <Tags elementos={objeto.services_inside}></Tags>
                        </>
                    ) : null}
                    {objeto.services_outside && objeto.services_outside.length > 0 ? (
                        <>
                            <div className={styles.title}>Servicios fuera</div>
                            <Tags elementos={objeto.services_outside}></Tags>
                        </>
                    ) : null}
                    {objeto.type_attractive ? (
                        <>
                            <div className={styles.title}>Tipo de Atractivo</div>
                            <TagSolo texto={objeto.type_attractive} />
                        </>
                    ) : null}
                    {objeto.administration ? (
                        <>
                            <div className={styles.title}>Gestión</div>
                            <div>{objeto.administration}</div>
                        </>
                    ) : null}
                    {objeto.art_period ? (
                        <>
                            <div className={styles.title}>Periodo del arte</div>
                            <div>{objeto.art_period}</div>
                        </>
                    ) : null}
                    {objeto.historical_period ? (
                        <>
                            <div className={styles.title}>Periodo histórico</div>
                            <div>{objeto.historical_period}</div>
                        </>
                    ) : null}
                    {objeto.featured_artist ? (
                        <>
                            <div className={styles.title}>Principales artistas</div>
                            <Tags elementos={objeto.featured_artist}></Tags>
                        </>
                    ) : null}
                    {objeto.building_type ? (
                        <>
                            <div className={styles.title}>Tipo de edificio</div>
                            <div>{objeto.building_type}</div>
                        </>
                    ) : null}
                    {objeto.museum_type ? (
                        <>
                            <div className={styles.title}>Tipo de Museo</div>
                            <div>{objeto.museum_type}</div>
                        </>
                    ) : null}
                    {objeto.sea_state ? (
                        <>
                            <div className={styles.title}>Estado del mar</div>
                            <div>{objeto.sea_state}</div>
                        </>
                    ) : null}
                    {objeto.beach_type && objeto.beach_type.length > 0 ? (
                        <>
                            <div className={styles.title}>Tipo de playa</div>
                            <TagsTexto elementos={objeto.beach_type} />
                        </>
                    ) : null}
                    {objeto.historic_place_type ? (
                        <>
                            <div className={styles.title}>Tipo de lugar histórico</div>
                            <div>{objeto.historic_place_type}</div>
                        </>
                    ) : null}
                    {objeto.number_slides ? (
                        <>
                            <div className={styles.title}>Cantidad de toboganes</div>
                            <div>{objeto.number_slides}</div>
                        </>
                    ) : null}
                    {objeto.number_pools ? (
                        <>
                            <div className={styles.title}>Cantidad de piletas</div>
                            <div>{objeto.number_pools}</div>
                        </>
                    ) : null}
                    {objeto.height ? (
                        <>
                            <div className={styles.title}>Altura</div>
                            <div>{objeto.height}</div>
                        </>
                    ) : null}
                    {objeto.number_trail ? (
                        <>
                            <div className={styles.title}>Cantidad de senderos</div>
                            <div>{objeto.number_trail}</div>
                        </>
                    ) : null}
                    {objeto.virtual_exhibition ? (
                        <>
                            <div className={styles.title}>Exhibición virtual</div>
                            <div>{objeto.virtual_exhibition ? "Si" : "No"}</div>
                        </>
                    ) : null}
                    {objeto.art_type && objeto.art_type.length > 0 ? (
                        <>
                            <div className={styles.title}>Tipo de arte</div>
                            <TagsTexto elementos={objeto.art_type} />
                        </>
                    ) : null}
                    {objeto.movie_theater_type ? (
                        <>
                            <div className={styles.title}>Tipo de salas</div>
                            <TagsTexto elementos={objeto.movie_theater_type} />
                        </>
                    ) : null}
                    {objeto.number_rooms_cinema ? (
                        <>
                            <div className={styles.title}>Cantidad de salas</div>
                            <div>{objeto.number_rooms_cinema}</div>
                        </>
                    ) : null}
                    {objeto.number_seats_cinema ? (
                        <>
                            <div className={styles.title}>Cantidad de asientos</div>
                            <div>{objeto.number_seats_cinema}</div>
                        </>
                    ) : null}
                    {objeto.depth ? (
                        <>
                            <div className={styles.title}>Profundidad</div>
                            <div>{objeto.depth} mts</div>
                        </>
                    ) : null}
                    {objeto.resto_type ? (
                        <>
                            <div className={styles.title}>Tipo de restaurante</div>
                            <div>{objeto.resto_type}</div>
                        </>
                    ) : null}
                    {objeto.served_cuisine && objeto.served_cuisine.length > 0 ? (
                        <>
                            <div className={styles.title}>Cocina del restaurante</div>
                            <TagsTexto elementos={objeto.served_cuisine} />
                        </>
                    ) : null}
                    {objeto.accepts_reservations ? (
                        <>
                            <div className={styles.title}>Acepta reservas</div>
                            <div>{objeto.accepts_reservations ? "Si" : "No"}</div>
                        </>
                    ) : null}
                    {objeto.has_menu ? (
                        <button
                            className={styles.submitButtonStyle}
                            onClick={() => openURL(objeto.has_menu)}
                        >
                            <div className="textStyle">Menú Online</div>
                        </button>
                    ) : null}
                    {objeto.beer_type ? (
                        <>
                            <div className={styles.title}>Tipos de Cerveza</div>
                            <Tags elementos={objeto.beer_type}></Tags>
                        </>
                    ) : null}
                    {objeto.number_flavors ? (
                        <>
                            <div className={styles.title}>Cantidad de sabores</div>
                            <div>{objeto.number_flavors}</div>
                        </>
                    ) : null}
                    {objeto.flavors ? (
                        <>
                            <div className={styles.title}>Sabores de helado</div>
                            <Tags elementos={objeto.flavors}></Tags>
                        </>
                    ) : null}
                    {objeto.coffee_service ? (
                        <>
                            <div className={styles.title}>Servicio de cafeteria</div>
                            <div>{objeto.coffee_service ? "Si" : "No"}</div>
                        </>
                    ) : null}
                    {objeto.type_commerce ? (
                        <>
                            <div className={styles.title}>Tipo de Comercio</div>
                            <div>{objeto.type_commerce}</div>
                        </>
                    ) : null}
                    {objeto.duration ? (
                        <>
                            <div className={styles.title}>Duración</div>
                            <div>{objeto.duration}</div>
                        </>
                    ) : null}
                    {objeto.departures ? (
                        <>
                            <div className={styles.title}>Salidas</div>
                            <div>{objeto.departures}</div>
                        </>
                    ) : null}
                    {objeto.guided ? (
                        <>
                            <div className={styles.title}>¿Es Guiado?</div>
                            <div>{objeto.guided ? "Si" : "No"}</div>
                        </>
                    ) : null}
                    {objeto.accessible ? (
                        <>
                            <div className={styles.title}>¿Es accesible?</div>
                            <div>{objeto.accessible ? "Si" : "No"}</div>
                        </>
                    ) : null}
                    {objeto.allows_pets ? (
                        <>
                            <div className={styles.title}>¿Permite mascotas?</div>
                            <div>{objeto.allows_pets ? "Si" : "No"}</div>
                        </>
                    ) : null}
                    {objeto.includes ? (
                        <>
                            <div className={styles.title}>Incluye</div>
                            <div>{objeto.includes}</div>
                        </>
                    ) : null}
                    {objeto.does_not_include ? (
                        <>
                            <div className={styles.title}>No incluye</div>
                            <div>{objeto.does_not_include}</div>
                        </>
                    ) : null}
                    {objeto.recommendations ? (
                        <>
                            <div className={styles.title}>Recomendaciones</div>
                            <div>{objeto.recommendations}</div>
                        </>
                    ) : null}
                    {objeto.number_of_observable_tourist_attractions ? (
                        <>
                            <div className={styles.title}>Atractivos turísticos observables</div>
                            <div>{objeto.number_of_observable_tourist_attractions}</div>
                        </>
                    ) : null}
                    {objeto.number_of_services ? (
                        <>
                            <div className={styles.title}>Instalaciones y servicios turisticos</div>
                            <div>{objeto.number_of_services}</div>
                        </>
                    ) : null}
                    {objeto.number_of_tourist_stops ? (
                        <>
                            <div className={styles.title}>Paradores turisticos</div>
                            <div>{objeto.number_of_tourist_stops}</div>
                        </>
                    ) : null}
                    {objeto.tourist_route_type ? (
                        <>
                            <div className={styles.title}>Temática de ruta</div>
                            <div>{objeto.tourist_route_type}</div>
                        </>
                    ) : null}

                    {objeto.allowed_activities && objeto.allowed_activities.length > 0 ? (
                        <>
                            <div className={styles.title}> Actividades permitidas</div>
                            <Tags elementos={objeto.allowed_activities}></Tags>
                        </>
                    ) : null}
                    {objeto.main_attractions && objeto.main_attractions.length > 0 ? (
                        <>
                            <div className={styles.title}> Atractivos en la ruta</div>
                            <ImagenesAtractivos
                                navigation={navigation}
                                images={objeto.main_attractions}
                            />
                        </>
                    ) : null}

                    {objeto.contenidos_usuario && objeto.contenidos_usuario.length > 0 ? (
                        <> <div className={styles.title}>Contenido de los usuarios</div>
                            <Imagenes images={objeto.contenidos_usuarios} navigation={navigation} />
                            {/*  <div className={styles.buttoncontainer}>
                        <Button
                            className={styles.submitButtonStyleChico}
                            onClick={() =>
                                navigation("AgregarContenido", {
                                    state: {
                                        itemId: objeto.id,
                                        itemTitle: objeto.title,
                                        type: type,
                                        content_type: objeto.content_type
                                    }
                                })
                            }
                        >
                            Agregar +
                        </Button>
                        <Button
                            className={styles.submitButtonStyleChico}
                            onClick={() =>
                                navigation("Contenido", {
                                    state: {
                                        itemTitle: objeto.title,
                                        type: type,
                                        images: objeto.contenidos_usuarios
                                    }
                                })
                            }
                        >
                            Ver todos &gt;
                        </Button>
                        </div> */}
                        </>
                    ) : null}

                </>
            )}
        </div>
    );
};

export default ObjetoInformacionScreen;
