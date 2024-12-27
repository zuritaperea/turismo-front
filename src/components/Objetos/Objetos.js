import React, { useState, useEffect } from "react";
import Buscar from "../../components/Items/Buscar";
import styles from "./styles.module.css"
import 'leaflet/dist/leaflet.css'
import Row from "../../components/Row";
import Col from "../../components/Col";
import Listado from "./Listado";
import Mapa from "./Mapa";
import EncabezadoCategoria from "./EncabezadoCategoria";
import Header from "../Header";
import Footer from "../Footer";

const ObjetosScreen = ({ navigation, target, title, objetoService }) => {
  const [objetos, guardarObjetos] = useState([]);
  const [objetosFiltrados, setObjetosFiltrados] = useState([]);
  const [textoBuscar, setTextoBuscar] = useState("");
  const [loading, setLoading] = useState(true);

  const obtenerTodos = async () => {
    setLoading(true);
    guardarObjetos([]);
    setObjetosFiltrados([]);
    try {
      const response = await objetoService.obtenerTodos();
      const data = response.data.data;

      const objetosData = data.map((obj) => ({
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
      }));

      guardarObjetos(objetosData);
      setObjetosFiltrados(objetosData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = `${process.env.REACT_APP_DOCUMENT_TITLE} - ${title}`;
    obtenerTodos();
  }, []);



  const search = (searchText) => {
    setLoading(true);
    setObjetosFiltrados([]);
    if (searchText !== "") {
      const regex = new RegExp(searchText, "gi");

      const filteredData = objetos.filter((record) =>
        record.title.match(regex)
      );

      setObjetosFiltrados(filteredData);
    } else {
      setObjetosFiltrados(objetos);
    }
    setLoading(false);
  };

  return (
    <><Header />
      <div className="p-5">
        <EncabezadoCategoria title={title} target={target} />

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            <Row>
              <Col  lg="6">
                <Buscar
                  onChangeText={(textoBuscar) => setTextoBuscar(textoBuscar)}
                  onPress={() => search(textoBuscar)}
                />      
                        </Col>
                        <Col  lg="6">
                <Mapa objetosFiltrados={objetosFiltrados} navigation={navigation} target={target} />
              </Col>
            </Row>
            <Row><Col>
              <Listado objetosFiltrados={objetosFiltrados} navigation={navigation} target={target} />
            </Col>
            </Row></>
        )}
      </div>
      <Footer /></>
  );
};

export default ObjetosScreen;
