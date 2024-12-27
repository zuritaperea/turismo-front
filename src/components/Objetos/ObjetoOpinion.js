import React from "react";
import { Typography, Row, Col, Alert } from "antd";
import Estrellas from "../Items/Estrellas";
import styles from "./styles.module.css";
import imagen from '../../assets/pngegg.png';

const { Text } = Typography;

export default function ObjetoOpinionScreen({ objeto }) {
  return (
    <div>
      {objeto?.evaluaciones.length > 0 ? (
        objeto.evaluaciones.map((item) => (
          <Comentario key={item.id} item={item} />
        ))
      ) : (
        <Alert message="Todavía no hay ningún comentario" type="info" showIcon />
      )}
    </div>
  );
}

function Comentario({ item }) {
  return (
    <div className={styles.item}>
      <Row className={styles.listado} justify="flex-start" align="flex-start">
        <Col>
          <img
            src={imagen}
            className={styles.image}
          />
        </Col>
        <Col className={styles.centro}>
          <Text className={styles.text}>{item.user}</Text>
          <div className={styles.estrellas}>
            <Estrellas puntuacion={item.evaluation} size={'sm'} />
          </div>
        </Col>
      </Row>
      {item.estado === "aprobado" && <Text>{item.description}</Text>}
    </div>
  );
}
