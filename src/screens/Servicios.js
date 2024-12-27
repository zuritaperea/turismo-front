import React from 'react';
import { Container, Row, Col, Image, Card, } from 'react-bootstrap';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom'; // Importa el componente Link de React Router
import Jumbotron from '../components/Jumbotron';

function ServiciosScreen() {



  return (<>
    <Header />
    <Jumbotron
      name='Servicios'
    />
    <Container className="boxed">

      <Row className="m-3">
        <Col sm={12}>
          <Link to="/alojamientos">
            <Card>
              <Card.Body>
                <Card.Title>Alojamientos</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>             
      </Row>

    </Container>

    <Footer /></>
  );
}

export default ServiciosScreen;
