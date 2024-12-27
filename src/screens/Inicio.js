import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faHistory } from '@fortawesome/free-solid-svg-icons'
import Form from "../components/Form";
import Row from "../components/Row";
import Spinner from "../components/Spinner";
import Col from "../components/Col";
import Container from "../components/Container";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Autosuggest from 'react-autosuggest';
import Carrusel from "../components/Carrusel";
import service from '../axios/services/destino';
import atractivoService from '../axios/services/atractivo';
import circuitoService from '../axios/services/circuito';
import { v4 as uuidv4 } from 'uuid';
import SearchComponent from "../components/SearchComponent";
import SeccionesSlider from "../components/SectionSlider";
import ticketImg from '../assets/img/ticket-01.png';
import markerImg from '../assets/img/marker-pin-04.png';
import buildingImg from '../assets/img/building-07.png';
import busImg from '../assets/img/bus.png';
import shoppingBagImg from '../assets/img/shopping-bag-01.png';
import gastronomyImg from '../assets/img/face-happy.png';
import Carousel from "../components/Carousel";
import AttractionCard from "../components/AttractionCard";
import AttractionsSection from "../components/AttractionsSection";
import EventsSection from "../components/EventsSection";
import Splash from "../components/Splash";
export default function Inicio() {
  const [loading, setLoading] = useState(true);

  const [value, setValue] = useState('');
  const [objeto, setObjeto] = useState(null);
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [isInputLocked, setInputLocked] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState("");
  const [naturalAttractions, setNaturalAttractions] = useState([]);
  const [loadingAtractivos, setLoadingAtractivos] = useState(true);

  const [culturalAttractions, setCulturalAttractions] = useState([]);
  const [loadingAtractivosCulturales, setLoadingAtractivosCulturales] = useState(true);


  const [circuitos, setCircuitos] = useState([]);
  const [loadingCircuitos, setLoadingCircuitos] = useState(true);

  const [destinos, setDestinos] = useState([]);
  const [loadingDestinos, setLoadingDestinos] = useState(true);


  const navigate = useNavigate();


  const getSuggestions = async (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength > 2) {
      try {
        const response = await service.obtenerNombre(inputValue);
        const data = response.data;
        const suggestionsFromApi = data.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          provincia: item.provincia,
          type: "Destino",
        }));
        setSuggestions(suggestionsFromApi || []);
      } catch (error) {
        setError("Error al obtener sugerencias de la API.");
        console.error("Error al obtener sugerencias de la API", error);
        setSuggestions([]);
        clearInput();
      }
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestionValue = (suggestion) => {
    // Guarda la sugerencia completa en una variable
    setObjeto(suggestion);
    // Devuelve el valor que deseas mostrar en el input (por ejemplo, el nombre)
    return `${suggestion.nombre} (${suggestion.provincia})`;
  };

  const renderSuggestion = suggestion => (
    <div>
      {`${suggestion.nombre} (${suggestion.provincia})`}
    </div>
  );

  const onChange = (event, { newValue, method }) => {
    let suggestionValues = [];

    if (Array.isArray(suggestions) && suggestions.length > 0) {
      suggestionValues = suggestions.map((suggestion) => suggestion.nombre.toLowerCase());
    }

    if (method === 'click' || method === 'enter' || method === 'type') {
      setValue(newValue);
      setInputLocked(true);
    } else {
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        const lowercaseValue = newValue.toLowerCase();
        if (suggestionValues.includes(lowercaseValue)) {
          setValue(event.target.value);
          setInputLocked(true);
        } else {
          setInputLocked(false);
        }
      } else {
        setInputLocked(false);
      }
    }
  };


  const handleBuscarClick = (event) => {
    event.preventDefault(); // Previene el envío del formulario
    setError(""); // Limpiar el mensaje de error

    // Validar que haya una sugerencia seleccionada y fechas no vacías
    if (isInputLocked) {
      if (objeto) {
        if (objeto.type === "Destino") {
          const uuid = uuidv4();
          const viaje = {
            id: uuid,
            destino: objeto.nombre,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta
          };
          localStorage.setItem('viaje', JSON.stringify(viaje));
          if (fechaDesde && fechaHasta) {
            navigate(`/destino/${objeto.id}/${fechaDesde}/${fechaHasta}`
            );
          } else {
            navigate(`/destino/${objeto.id}/`);
          }
        } else {
          setError("La sugerencia seleccionada no es un destino válido.");
        }
      } else {
        setError("Por favor, seleccione una sugerencia válida.");
      }

    } else {
      setError("Por favor, seleccione una sugerencia antes de buscar.");
    }
  };

  const handleBuscarAvanzadaClick = (event) => {
    event.preventDefault(); // Previene el envío del formulario
    setError(""); // Limpiar el mensaje de error

    // Validar que haya una sugerencia seleccionada y fechas no vacías
    if (isInputLocked) {
      if (objeto) {
        if (objeto.type === "Destino") {
          if (fechaDesde && fechaHasta) {
            navigate(
              `/avanzada/${objeto.id}/${objeto.type}/${objeto.nombre}/${fechaDesde}/${fechaHasta}`
            );
          }
          else {
            navigate(
              `/avanzada/${objeto.id}/${objeto.type}/${objeto.nombre}`
            );
          }
        } else {
          setError("La sugerencia seleccionada no es un destino válido.");
        }
      }
      else {
        setError("Por favor, seleccione una sugerencia válida.");
      }
    } else {
      setError("Por favor, seleccione una sugerencia antes de buscar.");
    }
  };


  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const clearInput = () => {
    setValue('');
    setInputLocked(false);
  };

  const handleBlur = () => {
    if (!isInputLocked) {
      setValue(''); // Limpia el contenido si no está bloqueado
    }
  };

  const claseInput = 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
  const inputProps = {
    className: `form-control ${isInputLocked ? 'input-locked' : ''} ${claseInput}`,  // Condición correctamente aplicada
    placeholder: 'Ejemplo: Cataratas del Iguazú',
    value,
    onChange,
    type: 'search',
    onBlur: handleBlur, // Agrega esta línea para manejar el evento onBlur

  };




  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('user'));
    if (item) {
      setPersonaDenominacion(item?.username);
    }

    const obtenerDestinos = async () => {
      try {
        const response = await service.obtenerTodos();
        const destinos = response.data.data.map((destino) => {
          let toPath = `/destino/${destino.id}`;
          return {
            to: toPath,
            imgSrc: destino.attributes.image_url ? destino.attributes.image_url : process.env.REACT_APP_IMAGE_DEFAULT,
            alt: destino.attributes.name,
            title: destino.attributes.name,
          };
        });
        setDestinos(destinos);
        setLoadingDestinos(false);
      } catch (error) {
        setLoadingDestinos(false);
      }
    };


    const obtenerAtractivosNaturales = async () => {
      try {
        const response = await atractivoService.obtenerTodos();
        const atracciones = response.data.data.map((atractivo) => {
          let toPath = `/atractivo/${atractivo.id}`;
          return {
            to: toPath,
            imgSrc: atractivo.attributes.image_url ? atractivo.attributes.image_url : process.env.REACT_APP_IMAGE_DEFAULT,
            alt: atractivo.attributes.name,
            title: atractivo.attributes.name,
          };
        });
        setNaturalAttractions(atracciones);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };


    const obtenerAtractivosCulturales = async () => {
      try {
        const response = await atractivoService.obtenerTodos();
        const atracciones = response.data.map((atractivo) => {
          let toPath = `/atractivo/${atractivo.id}`;
          return {
            to: toPath,
            imgSrc: atractivo.attributes.image_url ? atractivo.attributes.image_url : process.env.REACT_APP_IMAGE_DEFAULT,
            alt: atractivo.attributes.name,
            title: atractivo.attributes.name,
          };
        });
        setCulturalAttractions(atracciones);
        setLoadingAtractivosCulturales(false);
      } catch (error) {
        setLoadingAtractivosCulturales(false);
      }
    };

    const obtenerCircuitos = async () => {
      try {
        const response = await circuitoService.obtenerTodos();
        const circuitos = response.data.map((circuito) => {
          let toPath = `/circuito/${circuito.id}`;
          return {
            to: toPath,
            imgSrc: circuito.imagenPrincipal,
            alt: circuito.nombre,
            title: circuito.nombre,
          };
        });
        setLoading(false);

        setCircuitos(circuitos);
        setLoadingCircuitos(false);
      } catch (error) {
        setLoading(false);

        setLoadingCircuitos(false);
      }
    };

    obtenerAtractivosNaturales();
    obtenerAtractivosCulturales();
    obtenerDestinos();
    obtenerCircuitos();
  }, []);


  const handleSearch = (query) => {
    console.log('Buscando:', query);
    // Aquí puedes agregar la lógica para manejar la búsqueda
  };
  const secciones = [
    { imagen: ticketImg, titulo: 'Eventos', link: '/eventos' },
    { imagen: markerImg, titulo: 'Atractivos', link: '/atractivos' },
    { imagen: buildingImg, titulo: 'Alojamientos', link: '/alojamientos' },
    { imagen: busImg, titulo: 'Circuitos', link: '/circuitos' },
    { imagen: shoppingBagImg, titulo: 'Comercios', link: '/comercios' },
    { imagen: gastronomyImg, titulo: 'Gastronomía', link: '/gastronomia' },
  ];

  const images = [
    { src: 'https://picsum.photos/id/227/300/200' },
    { src: 'https://picsum.photos/id/217/300/200' },
    { src: 'https://picsum.photos/id/237/300/200' },
  ];

  return (
    <>
      {loading ? <Splash /> : null}

      <Header />
      <Carousel images={images} />

      <SearchComponent onSearch={handleSearch} />
      <SeccionesSlider secciones={secciones} />
      <hr />
      <AttractionsSection />
      <hr />
      <EventsSection />


      <Container className="boxed">
        <Row className="justify-content-md-center p-2">
          <Col md="12">
            {!personaDenominacion ? (
              <Alert variant="light">
                ¿Sabías que al <Alert.Link href="/login">iniciar sesión </Alert.Link>
                puedes guardar tus destinos favoritos y recibir recomendaciones personalizadas?</Alert>
            ) : (
              <Alert variant="light">
                Para mejorar los resultados de tus búsquedas, <Alert.Link href="/perfil">completá  </Alert.Link>
                algunos datos que definan <Alert.Link href="/perfil">tu perfil de turista</Alert.Link>
              </Alert>)}
            <Col md="12" className="d-flex justify-content-between">
              <h1>{personaDenominacion ? `Hola ${personaDenominacion}` : 'Plataforma de Información Turística'}</h1>
              <Link to="/viajes" className="me-2">
                <FontAwesomeIcon icon={faHistory} size="sm" />
              </Link></Col>
            <Form>
              <Row>
                <Col md="3" xs="12">
                  <Form.Group controlId="destino" >
                    <Form.Label>¿Dónde vas a viajar?</Form.Label>
                    <div className="input-with-clear">
                      <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                      />
                      {isInputLocked && (
                        <button className="clear-input" onClick={clearInput}>
                          X
                        </button>
                      )}
                    </div>
                  </Form.Group>
                </Col>
                <Col md="3" xs="12">

                  <Form.Group controlId="fechaDesde">
                    <Form.Label>¿Cuándo vas a llegar a destino?</Form.Label>
                    <Form.Control type="date" value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md="3" xs="12">
                  <Form.Group controlId="fechaHasta">
                    <Form.Label>¿Hasta cuándo te vas a quedar?</Form.Label>
                    <Form.Control type="date" value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)} />
                  </Form.Group></Col>
                <Col md="3" xs="12" className="mt-2">
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit"
                      onClick={handleBuscarClick}>
                      <FontAwesomeIcon icon={faSearch} />
                      Buscar
                    </Button></div>
                  <Link to="/avanzada">
                    <div className="d-grid gap-2">
                      <Button variant="primary" type="submit" size="sm"
                        onClick={handleBuscarAvanzadaClick}>
                        <FontAwesomeIcon icon={faSearch} />
                        Búsqueda avanzada
                      </Button></div>
                  </Link>
                </Col>
              </Row>
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

            </Form>
          </Col>
        </Row>
        <Row className="p-2">
          {loadingDestinos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <Carrusel title="Destinos" data={destinos.sort(() => Math.random() - Math.random()).slice(0, 4)} to="/destinos" />
          )}
          {loadingAtractivos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <Carrusel title="Atractivos Naturales" data={naturalAttractions.sort(() => Math.random() - Math.random()).slice(0, 4)} to="/atractivos-naturales" />
          )}
          {loadingAtractivosCulturales ? (
            <Spinner animation="border" role="status" />
          ) : (
            <Carrusel title="Atractivos Culturales" data={culturalAttractions.sort(() => Math.random() - Math.random()).slice(0, 4)} to="/atractivos-culturales" />
          )}
          {loadingCircuitos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <Carrusel title="Circuitos" data={circuitos.sort(() => Math.random() - Math.random()).slice(0, 4)} to="/circuitos" />
          )}
        </Row>
      </Container>
      <Footer />
    </>
  );
}
