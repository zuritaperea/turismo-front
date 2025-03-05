import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LandingHeader from "../Landing/LandingHeader/LandingHeader";
import LandingFooter from "../Landing/LandingFooter/LandingFooter";
import styles from "./styles.module.css"
import 'leaflet/dist/leaflet.css'
import { Row, Col, Typography } from "antd";
import Listado from "./Listado";
import Mapa from "./Mapa";

const AtractivosListaScreen = () => {
  const { Text } = Typography;

  const location = useLocation();
  const navigation = useNavigate();
  const { image, title, items, target } = location.state || {};
  const objetosData = items.map((obj) => ({
    id: obj.id,
    title: obj.name,
    image: obj.image_url,
    puntuacion: obj.evaluation,
    favorito: obj.favorite,
    coordinates: obj.point,
  }));

  return (
    <><LandingHeader />
      <div className={styles.container}>
        <div className={styles.full}>
          {image !== "" && (
            <div
              className={styles.imgfullAtractivo}
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className={styles.textContainer}>
                <Text className={styles.bigTitle}>{title}</Text>
              </div>
            </div>
          )}
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} >
            <Listado objetosFiltrados={objetosData} navigation={navigation} target={target} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} >
            <Mapa objetosFiltrados={objetosData} navigation={navigation} target={target} />
          </Col>
        </Row>
      </div>
      <LandingFooter /></>
  );
};

export default AtractivosListaScreen;
