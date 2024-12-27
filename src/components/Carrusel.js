import React from 'react';
import Row from './Row';
import Col from './Col';
import Button from './Button';
import Alert from './Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Carrusel({ title, data, to }) {
  if (data.length === 0)
    return (
      <Row>
        <Alert variant="warning" className="mx-2">
          <p>No se encontraron {title}</p>
        </Alert>
      </Row>
    );

  return (
    <>
      <Row>
        <Col xl={12} xxl={10}>
          <div className="relative">
            <h4
              className="text-2xl text-tomato-700 font-bold opacity-90"
              data-aos="fade-in"
              data-aos-duration="1000"
            >
              <span className="block">{title}</span>
            </h4>

            <p
              data-aos="fade-in"
              data-aos-duration="1000"
              className="text-gray-400 text-lg mt-2"
            >
              {/* Puedes añadir subtítulo si lo necesitas */}
            </p>

            {/* Flechas de navegación */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 cursor-pointer">
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-gray-500 text-3xl hover:text-gray-700 transition duration-300"
              />
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 cursor-pointer">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-500 text-3xl hover:text-gray-700 transition duration-300"
              />
            </div>

            {/* Carrusel de contenido */}
            <div className="flex space-x-4 overflow-x-auto py-4 mt-6">
              {data.map((item, index) => (
                <a
                  key={index}
                  href={item.to}
                  className="block min-w-[200px] max-w-xs bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <img
                    loading="lazy"
                    alt={item.title}
                    title={item.title}
                    className="w-full h-auto object-cover rounded-t-lg"
                    src={item.imgSrc}
                    data-aos="fade-in"
                    data-aos-duration="1000"
                    data-aos-delay="400"
                  />
                  <p className="text-center text-sm text-gray-800 p-2">{item.title}</p>
                </a>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={4} xl={2}>
          <a href={to}>
            <div className="mt-5">
              <Button variant="primary" className="w-full">
                <FontAwesomeIcon icon={faEye} /> Ver todos
              </Button>
            </div>
          </a>
        </Col>
      </Row>
      <hr className="my-6" />
    </>
  );
}

export default Carrusel;
