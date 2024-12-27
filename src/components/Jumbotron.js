import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Container from './Container';
import Row from './Row';
import Col from './Col';
import Button from './Button';
import Form from './Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function Jumbotron({ backgroundImage,
  name,
  subtittle,
  fechadesde,
  fechahasta,
  description,
  id,
  tipo,
  isFavorite,
  isVisited,
  handleFavoriteClick,
  handleVisitedClick }) {
  const [showModal, setShowModal] = useState(false);
  const [newFechaDesde, setNewFechaDesde] = useState('');
  const [newFechaHasta, setNewFechaHasta] = useState('');

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  const navigate = useNavigate();

  useEffect(() => {
    setNewFechaDesde(fechadesde || '');
    setNewFechaHasta(fechahasta || '');
  }, [fechadesde, fechahasta]);


  backgroundImage = null; //Desactivar para todos
  const jumbotronStyle = backgroundImage
    ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
    : {
      background: '#999999', // Color de fondo gris claro
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  const jumbotronBodyClasses = `jumbotron_body ${backgroundImage ? 'jumbotron_imagen' : ''}`;

  // Función para formatear la fecha en el formato "dd/mm/yyyy"
  const formatDate = (date) => {
    if (date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    return null; // Si la fecha es nula, retornamos nulo
  }

  const fechaDesdeFormateada = formatDate(fechadesde);
  const fechaHastaFormateada = formatDate(fechahasta);

  const date = fechadesde && fechahasta
    ? `Desde ${fechaDesdeFormateada} Hasta ${fechaHastaFormateada}`
    : null; // Si ambas fechas son nulas, date también será nulo

  const handleDateUpdate = () => {
    // Actualizar la URL con las nuevas fechas
    const newPath = `/${tipo}/${id}/${newFechaDesde}/${newFechaHasta}`;
    navigate(newPath);
    setShowModal(false);
  };

  return (
    <section className="jumbotron" style={jumbotronStyle}>
      <div className="jumbotron_bar">
        <Container>
          <Row>
            <Col>
              <ol className="breadcrumb pull-left">
             {/*   <li><a href={`/`}>{tipo}</a></li>
                <li className="active">{name}</li>  */}
              </ol>
            </Col>
            <Col className="text-end">
              <FontAwesomeIcon role="button" size="2x"
                icon={faHeart}
                className={isFavorite ? "pe-3 text-danger" : "pe-3"}
                onClick={handleFavoriteClick}
              />
              <FontAwesomeIcon role="button" size="2x"
                icon={faCheckSquare}
                className={isVisited ? "text-primary" : ""}
                onClick={handleVisitedClick}
              />
            </Col>
          </Row>
        </Container>
      </div>
      <div className={jumbotronBodyClasses}>
        <Container>
          <Row>
            <Col xs={12} md={12} mdoffset={2}>
              <div className='h1'>{name}<span className="h3">{subtittle?  ` - ${subtittle}`: ''}</span></div>
              {date ?
                (<small>{date}
                  <FontAwesomeIcon icon={faFilter} size="1x"
                    onClick={handleModalShow}
                    style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </small>) : <></>}
              <p>{description}</p>
            </Col>
          </Row>
        </Container>
      </div>
      {backgroundImage && ( // Verifica si hay backgroundImage antes de mostrar el div overlay
        <div className="jumbotron_overlay"></div>
      )}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Fechas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFechaDesde">
              <Form.Label>Fecha Desde</Form.Label>
              <Form.Control
                type="date"
                value={newFechaDesde}
                onChange={(e) => setNewFechaDesde(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFechaHasta">
              <Form.Label>Fecha Hasta</Form.Label>
              <Form.Control
                type="date"
                value={newFechaHasta}
                onChange={(e) => setNewFechaHasta(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleDateUpdate}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

    </section>
  );
}

export default Jumbotron;
