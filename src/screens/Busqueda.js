import React, { useState, useEffect } from "react";
import Buscar from "../components/Items/Buscar";
import 'leaflet/dist/leaflet.css';
import Row from "../components/Row";
import Col from "../components/Col";
import Listado from "../components/Objetos/Listado";
import EncabezadoCategoria from "../components/Objetos/EncabezadoCategoria";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import objetoService from "../axios/services/objeto";
import { useTranslation } from 'react-i18next';

const BusquedaScreen = ({ target }) => {
  let title = 'Resultados de la busqúeda';
  const [objetos, guardarObjetos] = useState([]);
  const [objetosFiltrados, setObjetosFiltrados] = useState([]);
  const [textoBuscar, setTextoBuscar] = useState("");
  const [loading, setLoading] = useState(true);
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const { t } = useTranslation();

  const handleSearch = (query) => {
    setTextoBuscar(query);
  };
  const onPressFind = () => {
    navigate(`/busqueda/${textoBuscar}`);
  };

  // Función para obtener los objetos filtrados según la búsqueda
  const obtenerTodos = async (nombre) => {
    setLoading(true);
    guardarObjetos([]);
    setObjetosFiltrados([]);
    try {
      const response = await objetoService.buscarObjeto(nombre);
      const data = response.data;

      const objetosData = data.map((obj) => ({
        id: obj.id,
        title: obj.name,
        image: obj.image_url
          ? process.env.REACT_APP_API_URL + obj.image_url
          : process.env.REACT_APP_IMAGE_DEFAULT,
        puntuacion: obj.evaluation,
        favorito: obj.favorite,
        coordinates: obj.point,
        tourist_type: obj.tourist_type,
        type: obj.type,
        tipo: obj.tipo,
      }));

      guardarObjetos(objetosData);
      setObjetosFiltrados(objetosData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Este useEffect escucha los cambios en `nombre` y actualiza la búsqueda
  useEffect(() => {
    document.title = `${process.env.REACT_APP_DOCUMENT_TITLE} - ${title}`;
    if (nombre) {
      obtenerTodos(nombre);  // Obtiene los objetos cuando cambia el parámetro `nombre`
    }
    setLoading(false);

  }, [nombre]);  // Añadimos `nombre` como dependencia para que se ejecute cuando cambie

  // Este useEffect es solo para asegurar que al cambiar de página, la vista se desplace hacia arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="p-5">
        <div>
          <h2 className="text-sm font-semibold mt-2 color-principal">{t('search.intro')}  </h2>
          <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
              {t('search.resultados_titulo')}

          </h1>
          <p className="mt-2 texto-tarjeta"></p>
        </div>

        {loading ? (
          <div className="loading">{t('common.cargando')}</div>
        ) : (
          <>
            <Row>
              <Col lg="6">
                <Buscar onChangeText={handleSearch} onPress={onPressFind} />
              </Col>
            </Row>
            <Row>
              <Col>
                {objetosFiltrados.length > 0 ? (
                  <Listado objetosFiltrados={objetosFiltrados} navigation={navigate} />
                ) : (
                  <div className="text-center mt-5 text-gray-500">
                    {t('search.sin_resultados')}</div>
                )}
              </Col>
            </Row>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default BusquedaScreen;
