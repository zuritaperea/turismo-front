import React from 'react';
import {Col, Card } from 'react-bootstrap';

import { Link } from 'react-router-dom';

// Define un componente reutilizable para las tarjetas de atractivos
export default function AttractionCard({ to, imgSrc, alt, title }) {
  return (
    <Col md={3} xs={6} >
      <Link to={to}>
        <Card className='mb-1'>
          <Card.Img src={imgSrc} alt={alt} className='custom-card-img'/>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}
