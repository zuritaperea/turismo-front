import React from 'react';
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";


function Opiniones({ opiniones }) {
  if (!opiniones) return null;
  if (Array.isArray(opiniones) && opiniones.length === 0) {
    return null;
  }
  return (
    <Row className="opinions">
      {opiniones.map((opinion, index) => (
        <div className="opinion" key={index}>
          <FontAwesomeIcon icon={faUser} size="lg" className="azul" />
          <div className="comentario">
            <h3>{opinion.autor}: </h3>
            <h5>{opinion.fecha}</h5>
            <span>{opinion.texto}</span>
          </div>
        </div>
      ))}
    </Row>
  );
}

export default Opiniones;