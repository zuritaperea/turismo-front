import React from 'react';
import { Row, Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AttractionCard from './AttractionCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Define un componente reutilizable para las secciones de contenido
export default function ContentSection({ title, data, to }) {
  return (
    <div>
      {title ? <Row className='p-2'>
        <h3>{title}</h3>
      </Row> : <></>}
      <Row className='p-2'>
        {data.map((item, index) => (
          <AttractionCard
            key={index}
            to={item.to}
            imgSrc={item.imgSrc}
            alt={item.alt}
            title={item.title}
          />
        ))}
      </Row>
      {to ? <Row className='ml-2'>
        <Col sm={12} md={2}><Link to={to}><div className="d-grid gap-2 mt-1">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faEye} /> Ver todos
          </button></div></Link>  </Col>
      </Row> : <></>}
      <hr />
    </div>
  );
}
